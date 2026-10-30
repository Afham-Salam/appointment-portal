'use server'

import { createClient } from '@/lib/supabase/server'

async function getAuthenticatedUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  return { supabase, user }
}

export async function getTransactions() {
  const { supabase } = await getAuthenticatedUser()

  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .order('date', { ascending: false })

  if (error) return { error: error.message, transactions: [] }
  return { transactions: data || [], error: null }
}

export async function createTransaction(input: {
  type: 'income' | 'expense'
  date: string
  payee: string
  category: string
  amount_paise: number
  payment_method: string
  reference: string
  notes: string
  client_id?: string | null
  source?: string
}) {
  const { supabase, user } = await getAuthenticatedUser()

  const { data, error } = await supabase
    .from('transactions')
    .insert({
      type: input.type,
      date: input.date,
      payee: input.payee,
      category: input.category,
      amount_paise: input.amount_paise,
      payment_method: input.payment_method,
      reference: input.reference,
      notes: input.notes,
      client_id: input.client_id || null,
      source: input.source || 'other',
      status: 'active',
      version: 1,
      created_by: user.id,
    })
    .select()
    .single()

  if (error) return { error: error.message }

  await supabase.from('transaction_audit').insert({
    transaction_id: data.id,
    action: 'Created',
    actor: user.email || '',
    after_data: data,
  })

  return { success: true, transaction: data }
}

export async function updateTransaction(
  id: string,
  input: {
    type?: 'income' | 'expense'
    date?: string
    payee?: string
    category?: string
    amount_paise?: number
    payment_method?: string
    reference?: string
    notes?: string
  }
) {
  const { supabase, user } = await getAuthenticatedUser()

  // Get current version
  const { data: before } = await supabase
    .from('transactions')
    .select('*')
    .eq('id', id)
    .single()

  if (!before) return { error: 'Transaction not found' }

  const { data: after, error } = await supabase
    .from('transactions')
    .update({
      ...input,
      version: before.version + 1,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()

  if (error) return { error: error.message }

  await supabase.from('transaction_audit').insert({
    transaction_id: id,
    action: 'Edited',
    actor: user.email || '',
    before_data: before,
    after_data: after,
  })

  return { success: true, transaction: after }
}

export async function voidTransaction(id: string) {
  const { supabase, user } = await getAuthenticatedUser()

  const { data: before } = await supabase
    .from('transactions')
    .select('*')
    .eq('id', id)
    .single()

  if (!before) return { error: 'Transaction not found' }

  const { data: after, error } = await supabase
    .from('transactions')
    .update({
      status: 'void',
      version: before.version + 1,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()

  if (error) return { error: error.message }

  await supabase.from('transaction_audit').insert({
    transaction_id: id,
    action: 'Voided',
    actor: user.email || '',
    before_data: before,
    after_data: after,
  })

  return { success: true }
}

export async function getTransactionAudit(transactionId: string) {
  const { supabase } = await getAuthenticatedUser()

  const { data, error } = await supabase
    .from('transaction_audit')
    .select('*')
    .eq('transaction_id', transactionId)
    .order('occurred_at', { ascending: false })

  if (error) return { error: error.message, entries: [] }
  return { entries: data || [], error: null }
}

// Get clients for dropdown
export async function searchClientsForDropdown(search: string) {
  if (!search || search.trim().length < 2) return []

  const { supabase } = await getAuthenticatedUser()

  const { data } = await supabase
    .from('clients')
    .select('id, name, phone, country_code')
    .or(`name.ilike.%${search.trim()}%,phone.ilike.%${search.trim()}%`)
    .limit(10)
    .order('name', { ascending: true })

  return (data || []).map((c) => ({
    id: c.id,
    name: c.name,
    phone: `${c.country_code || ''} ${c.phone}`.trim(),
  }))
}

export async function getPendingClientPayments() {
  const { supabase } = await getAuthenticatedUser()

  const { data: configs } = await supabase
    .from('client_payments')
    .select('client_id, total_amount')

  if (!configs || configs.length === 0) return { pending: 0, clientCount: 0 }

  const clientIds = configs.map((c) => c.client_id)

  const { data: payments } = await supabase
    .from('transactions')
    .select('client_id, amount_paise')
    .eq('type', 'income')
    .neq('status', 'void')
    .in('client_id', clientIds)

  // Sum paid in PAISE (don't divide)
  const paidMap = new Map<string, number>()
  for (const p of (payments || [])) {
    paidMap.set(p.client_id, (paidMap.get(p.client_id) || 0) + Number(p.amount_paise))
  }

  let totalPending = 0
  let clientCount = 0
  for (const cfg of configs) {
    // Convert total_amount from rupees to paise
    const totalPaise = Number(cfg.total_amount) * 100
    const paidPaise = paidMap.get(cfg.client_id) || 0
    const balance = totalPaise - paidPaise
    if (balance > 0) {
      totalPending += balance
      clientCount++
    }
  }

  return { pending: totalPending, clientCount }
}