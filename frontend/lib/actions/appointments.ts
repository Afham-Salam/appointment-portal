'use server'

import { createClient } from '@/lib/supabase/server'

// Search client by phone number (for returning clients)
export async function searchClientByPhone(phone: string) {
  const supabase = await createClient()

  const { data: client, error } = await supabase
    .from('clients')
    .select(`
      *,
      appointments (
        id,
        status,
        scheduled_date,
        created_at
      )
    `)
    .eq('phone', phone)
    .single()

  if (error || !client) return { client: null, appointments: [] }

  return {
    client,
    appointments: client.appointments || [],
  }
}

// Create a new appointment (handles both new and returning clients)
export async function createAppointment(values: {
  name: string
  age: string
  relative: string
  address: string
  countryCode: string
  phone: string
  clientType: 'Student' | 'Client'
  scheduledDate?: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  // Check if client already exists by phone
  const { data: existingClient } = await supabase
    .from('clients')
    .select('id')
    .eq('phone', values.phone)
    .single()

  let clientId: string

  if (existingClient) {
    // Update existing client info
    const { error: updateError } = await supabase
      .from('clients')
      .update({
        name: values.name,
        age: values.age,
        relative: values.relative,
        address: values.address,
        country_code: values.countryCode,
        client_type: values.clientType,
      })
      .eq('id', existingClient.id)

    if (updateError) return { error: updateError.message }
    clientId = existingClient.id
  } else {
    // Create new client
    const { data: newClient, error: clientError } = await supabase
      .from('clients')
      .insert({
        name: values.name,
        age: values.age,
        relative: values.relative,
        address: values.address,
        country_code: values.countryCode,
        phone: values.phone,
        client_type: values.clientType,
        created_by: user.id,
      })
      .select('id')
      .single()

    if (clientError) return { error: clientError.message }
    clientId = newClient.id
  }

  // Create the appointment
  const { data: appointment, error: appointmentError } = await supabase
    .from('appointments')
    .insert({
      client_id: clientId,
      status: 'Pending',
      scheduled_date: values.scheduledDate || null,
      created_by: user.id,
    })
    .select('id')
    .single()

  if (appointmentError) return { error: appointmentError.message }

  // Create empty application form for this appointment
  await supabase
    .from('application_forms')
    .insert({ appointment_id: appointment.id })

  return { success: true, appointmentId: appointment.id, clientId }
}

// Fetch all appointments with client info
export async function getAppointments() {
  const supabase = await createClient()

 const { data, error } = await supabase
  .from('appointments')
  .select(`
    id,
    status,
    scheduled_date,
    notes,
    created_at,
    client:clients!inner (
      id,
      name,
      age,
      relative,
      address,
      country_code,
      phone,
      client_type
    )
  `)
  .order('created_at', { ascending: false })

  if (error) return { error: error.message, appointments: [] }

const appointments = (data || []).map((apt) => {
  const client = apt.client as unknown as {
    id: string
    name: string
    age: string
    relative: string
    address: string
    country_code: string
    phone: string
    client_type: string
  }

  return {
    id: apt.id,
    name: client.name || '',
    age: client.age || '',
    relative: client.relative || '',
    address: client.address || '',
    countryCode: client.country_code || '+91',
    phone: client.phone || '',
    clientType: (client.client_type || 'Client') as 'Student' | 'Client',
    status: apt.status as 'Pending' | 'Accepted' | 'Rejected',
    createdAt: new Date(apt.created_at).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
    clientId: client.id || '',
    scheduledDate: apt.scheduled_date,
  }
})

  return { appointments, error: null }
}

// Update appointment status
export async function updateAppointmentStatus(
  appointmentId: string,
  status: 'Accepted' | 'Rejected'
) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('appointments')
    .update({ status })
    .eq('id', appointmentId)

  if (error) return { error: error.message }
  return { success: true }
}

// Delete appointment
export async function deleteAppointment(appointmentId: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('appointments')
    .delete()
    .eq('id', appointmentId)

  if (error) return { error: error.message }
  return { success: true }
}

// Fetch clients who have at least one accepted appointment
export async function getApprovedClients() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('clients')
    .select(`
      id,
      name,
      age,
      phone,
      country_code,
      client_type,
      address,
      created_at,
      appointments!inner (
        id,
        status,
        scheduled_date,
        created_at
      )
    `)
    .eq('appointments.status', 'Accepted')
    .order('created_at', { ascending: false })

  if (error) return { error: error.message, clients: [] }

  const seen = new Set<string>()
  const clients = (data || [])
    .filter((c) => {
      if (seen.has(c.id)) return false
      seen.add(c.id)
      return true
    })
    .map((c) => {
      const appts = c.appointments as unknown as {
        id: string
        status: string
        scheduled_date: string | null
        created_at: string
      }[]

      // Get the latest scheduled date
      const latestDate = appts
        .map((a) => a.scheduled_date)
        .filter(Boolean)
        .sort()
        .pop() || ''

      return {
        id: c.id,
        name: c.name,
        age: c.age || '',
        phone: c.phone,
        countryCode: c.country_code || '+91',
        clientType: c.client_type as string,
        address: c.address || '',
        createdAt: new Date(c.created_at).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        totalAppointments: appts.length,
        scheduledDate: latestDate,
      }
    })

  return { clients, error: null }
}