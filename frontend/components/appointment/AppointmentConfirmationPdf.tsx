"use client";

import {
  Document,
  Font,
  Image,
  Page,
  Path,
  Svg,
  Text,
  View,
  StyleSheet,
  pdf,
} from "@react-pdf/renderer";

export type ConfirmationDetails = {
  name: string;
  date: string;
  time: string;
  location: string;
};

export type AppointmentNotifyDetails = ConfirmationDetails & {
  countryCode: string;
  phone: string;
};

export const CLINIC_NAME = "Treasure Counseling Center";
export const CLINIC_LOCATION =
  "Treasure Counseling Center, Malappuram, Kerala";

const green = "#003e2b";
const gold = "#b58a44";

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#faf7ee",
    color: green,
    fontFamily: "Times-Roman",
    padding: 28,
  },
  border: {
    position: "absolute",
    top: 7,
    left: 8,
    right: 8,
    bottom: 10,
    border: `0.8pt solid ${gold}`,
  },
  brand: { alignItems: "center", marginTop: 4 },
  logo: { width: 132, height: 105, objectFit: "contain" },
  name: { fontSize: 40, letterSpacing: 5, color: "#805b24", marginTop: 0 },
  caption: {
    fontFamily: "Helvetica-Bold",
    fontSize: 11,
    letterSpacing: 0.6,
    marginTop: 0,
  },
  tagline: {
    fontFamily: "Helvetica",
    fontSize: 10,
    textAlign: "center",
    marginTop: 5,
    lineHeight: 1.25,
  },
  ornament: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    marginVertical: 12,
  },
  rule: { width: 94, height: 0.5, backgroundColor: gold },
  diamond: {
    width: 5,
    height: 5,
    backgroundColor: "#805b24",
    transform: "rotate(45deg)",
  },
  heading: {
    fontFamily: "Times-Bold",
    textAlign: "center",
    fontSize: 36,
    lineHeight: 0.98,
  },
  rows: { marginHorizontal: 40 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    height: 76,
    flexShrink: 0,
    paddingVertical: 6,
    borderBottom: "0.5pt solid #d4b77f",
  },
  icon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    flexShrink: 0,
    backgroundColor: "#e5e8d1",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },
  detail: { borderLeft: `0.6pt solid ${gold}`, paddingLeft: 14, flex: 1 },
  label: {
    fontFamily: "Helvetica",
    fontSize: 11,
    letterSpacing: 1,
    marginBottom: 3,
  },
  value: { fontFamily: "Times-Bold", fontSize: 19 },
  message: {
    textAlign: "center",
    fontFamily: "Times-Italic",
    fontSize: 15,
    lineHeight: 1.3,
    marginTop: 9,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 37,
    marginTop: "auto",
    alignItems: "flex-end",
  },
  thanks: { fontFamily: "Times-Italic", fontSize: 22, marginBottom: 4 },
  clinic: { fontFamily: "Helvetica-Bold", fontSize: 10 },
  signature: {
    borderLeft: `0.6pt solid ${gold}`,
    paddingLeft: 16,
    fontFamily: "Helvetica",
    fontSize: 9,
    lineHeight: 1.4,
  },
});

function Leaves({ bottom = false }: { bottom?: boolean }) {
  return (
    <Svg
      width={115}
      height={156}
      viewBox="0 0 115 156"
      style={
        bottom
          ? {
              position: "absolute",
              bottom: 0,
              right: 0,
              transform: "rotate(180deg)",
            }
          : { position: "absolute", top: 0, left: 0 }
      }
    >
      <Path
        d="M0 0 C35 35 49 84 79 149 M9 10 C49 13 76 25 102 36 M21 32 C12 65 11 86 15 108 M36 59 C66 56 83 65 103 86"
        fill="none"
        stroke="#a47b37"
        strokeWidth={1}
      />
      {[
        { x: 8, y: 7, r: -65, c: "#405537" },
        { x: 20, y: 26, r: -30, c: "#294b34" },
        { x: 32, y: 48, r: -70, c: "#52633b" },
        { x: 40, y: 70, r: -20, c: "#304d31" },
        { x: 55, y: 98, r: -45, c: "#c69c55" },
        { x: 66, y: 121, r: -10, c: "#d7b578" },
      ].map((leaf, index) => (
        <Path
          key={index}
          d="M0 0 C-20 17 -15 42 0 60 C16 38 19 15 0 0 Z M0 2 L0 56 M0 14 L-7 24 M0 26 L8 35 M0 38 L-6 45"
          style={{
            transform: `translate(${leaf.x}px, ${leaf.y}px) rotate(${leaf.r}deg)`,
          }}
          fill={leaf.c}
          stroke="#bfa975"
          strokeWidth={0.5}
        />
      ))}
    </Svg>
  );
}

function Icon({ type }: { type: "client" | "date" | "time" | "location" }) {
  const paths = {
    client: "M12 3a4 4 0 1 0 0 8a4 4 0 0 0 0-8 M4 22v-3a8 8 0 0 1 16 0v3Z",
    date: "M4 5h16v16H4Z M8 2v6 M16 2v6 M4 10h16 M8 13h1 M12 13h1 M16 13h1 M8 17h1 M12 17h1 M16 17h1",
    time: "M12 2a10 10 0 1 0 0 20a10 10 0 0 0 0-20 M12 6v7l5 3",
    location:
      "M12 22S4 13 4 9a8 8 0 1 1 16 0c0 4-8 13-8 13Z M12 6a3 3 0 1 0 0 6a3 3 0 0 0 0-6",
  };
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24">
      <Path
        d={paths[type]}
        stroke={green}
        strokeWidth={1.8}
        fill={type === "client" ? green : "none"}
      />
    </Svg>
  );
}

function Ornament() {
  return (
    <View style={styles.ornament}>
      <View style={styles.rule} />
      <View style={styles.diamond} />
      <View style={styles.rule} />
    </View>
  );
}

export function AppointmentConfirmationPdf({
  details,
  logoSrc,
}: {
  details: ConfirmationDetails;
  logoSrc?: string | null;
}) {
  const rows = [
    { label: "CLIENT NAME:", value: details.name, type: "client" as const },
    { label: "DATE:", value: details.date, type: "date" as const },
    { label: "TIME:", value: details.time, type: "time" as const },
    { label: "LOCATION:", value: details.location, type: "location" as const },
  ];

  return (
    <Document
      title={`Appointment confirmation — ${details.name}`}
      author={CLINIC_NAME}
    >
      <Page size="A4" style={styles.page} wrap={false}>
        <View style={styles.border} />
        <Leaves />
        <Leaves bottom />
        <View style={styles.brand}>
          {logoSrc ? <Image src={logoSrc} style={styles.logo} /> : null}
          <Text style={styles.name}>TREASURE</Text>
          <Text style={styles.caption}>FOR THE PEOPLE WHO NEED HELP</Text>
          <Text style={styles.tagline}>
            A safe space for healing,{"\n"}self-discovery and transformation.
          </Text>
        </View>
        <Ornament />
        <Text style={styles.heading}>APPOINTMENT{"\n"}CONFIRMATION</Text>
        <Ornament />
        <View style={styles.rows}>
          {rows.map((row) => (
            <View key={row.type} style={styles.row}>
              <View style={styles.icon}>
                <Icon type={row.type} />
              </View>
              <View style={styles.detail}>
                <Text style={styles.label}>{row.label}</Text>
                <Text
                  style={[
                    styles.value,
                    {
                      fontSize:
                        row.value.length > 60
                          ? 13
                          : row.value.length > 28
                            ? 16
                            : row.type === "location"
                              ? 20
                              : 24,
                    },
                    /[\u0D00-\u0D7F]/.test(row.value)
                      ? { fontFamily: "ConfirmationMalayalam" }
                      : {},
                  ]}
                >
                  {row.value}
                </Text>
              </View>
            </View>
          ))}
        </View>
        <Text style={styles.message}>
          Your appointment has been scheduled.{"\n"}We look forward to seeing
          you.
        </Text>
        <Ornament />
        <View style={styles.footer}>
          <View>
            <Text style={styles.thanks}>Thanks,</Text>
            <Text style={styles.clinic}>{CLINIC_NAME}</Text>
          </View>
          <Text style={styles.signature}>
            Treasure{"\n"}Counseling Center
          </Text>
        </View>
      </Page>
    </Document>
  );
}

function arrayBufferToDataUri(buffer: ArrayBuffer, mime: string) {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return `data:${mime};base64,${btoa(binary)}`;
}

let fontRegistered = false;

async function ensurePdfAssets() {
  if (!fontRegistered) {
    Font.register({
      family: "ConfirmationMalayalam",
      src: `${window.location.origin}/fonts/NotoSansMalayalam-Regular.ttf`,
    });
    fontRegistered = true;
  }

  const logoResponse = await fetch(`${window.location.origin}/logo.png`);
  if (!logoResponse.ok) return null;
  return arrayBufferToDataUri(await logoResponse.arrayBuffer(), "image/png");
}

export function formatAppointmentDate(value?: string) {
  if (!value) return "To be confirmed";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatAppointmentTime(value?: string) {
  if (!value) return "To be confirmed";
  const [hours, minutes] = value.split(":");
  const hour = Number(hours);
  if (Number.isNaN(hour)) return value;
  const suffix = hour >= 12 ? "PM" : "AM";
  return `${hour % 12 || 12}:${minutes || "00"} ${suffix}`;
}

export function toNotifyDetails(input: {
  name: string;
  scheduledDate?: string;
  scheduledTime?: string;
  countryCode: string;
  phone: string;
  location?: string;
}): AppointmentNotifyDetails {
  return {
    name: input.name.trim(),
    date: formatAppointmentDate(input.scheduledDate),
    time: formatAppointmentTime(input.scheduledTime),
    location: input.location || CLINIC_LOCATION,
    countryCode: input.countryCode,
    phone: input.phone,
  };
}

export function getWhatsAppNumber(details: AppointmentNotifyDetails) {
  let phoneDigits = details.phone.replace(/\D/g, "");
  const codeDigits = (details.countryCode || "+91").replace(/\D/g, "") || "91";

  if (phoneDigits.startsWith("00")) {
    phoneDigits = phoneDigits.slice(2);
  }
  if (codeDigits && phoneDigits.startsWith(codeDigits)) {
    return phoneDigits;
  }
  if (phoneDigits.startsWith("0")) {
    phoneDigits = phoneDigits.replace(/^0+/, "");
  }
  return `${codeDigits}${phoneDigits}`;
}

export function confirmationFileName(name: string) {
  const safeName =
    name.trim().replace(/[^a-zA-Z0-9-_ ]/g, "").replace(/\s+/g, "-") ||
    "client";
  return `appointment-confirmation-${safeName}.pdf`;
}

export function buildWhatsAppMessage(details: AppointmentNotifyDetails) {
  return [
    `Hello ${details.name},`,
    "",
    `Greetings from ${CLINIC_NAME}.`,
    "",
    "Your appointment has been scheduled.",
    "",
    `Client name: ${details.name}`,
    `Date: ${details.date}`,
    `Time: ${details.time}`,
    `Location: ${details.location}`,
    "",
    "Your appointment confirmation PDF is attached with this message. Please download and keep it for your visit.",
    "",
    "We look forward to seeing you.",
    "",
    `${CLINIC_NAME}`,
  ].join("\n");
}

export function buildWhatsAppUrl(details: AppointmentNotifyDetails) {
  const number = getWhatsAppNumber(details);
  const text = encodeURIComponent(buildWhatsAppMessage(details));
  return `https://api.whatsapp.com/send/?phone=${number}&text=${text}&type=phone_number&app_absent=0`;
}

export async function createConfirmationBlob(details: ConfirmationDetails) {
  const logoSrc = await ensurePdfAssets();
  return pdf(
    <AppointmentConfirmationPdf details={details} logoSrc={logoSrc} />,
  ).toBlob();
}

export function triggerPdfDownload(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = confirmationFileName(name);
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

export async function downloadConfirmationPdf(details: ConfirmationDetails) {
  const blob = await createConfirmationBlob(details);
  triggerPdfDownload(blob, details.name);
  return blob;
}

export function openWhatsAppNotify(details: AppointmentNotifyDetails) {
  window.open(buildWhatsAppUrl(details), "_blank", "noopener,noreferrer");
}

export async function shareOrNotifyConfirmation(
  details: AppointmentNotifyDetails,
  blob: Blob,
) {
  triggerPdfDownload(blob, details.name);
  openWhatsAppNotify(details);
  return "whatsapp";
}
