"use client";

import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  pdf,
} from "@react-pdf/renderer";

const GREEN = "#064C2E";
const GOLD = "#C99532";
const LIGHT_GOLD = "#F8F1DF";

const styles = StyleSheet.create({
  page: {
    paddingTop: 40,
    paddingHorizontal: 45,
    paddingBottom: 60,
    fontFamily: "Helvetica",
    backgroundColor: "#FFFFFF",
    position: "relative",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 18,
  },
  brand: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 70,
    height: 62,
  },
  brandText: {
    marginLeft: 12,
  },
  treasure: {
    fontFamily: "Times-Roman",
    fontSize: 28,
    letterSpacing: 3,
    color: GOLD,
  },
  tagline: {
    marginTop: 4,
    fontFamily: "Helvetica-Bold",
    fontSize: 8,
    color: GREEN,
    textAlign: "center",
  },
  contact: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
    lineHeight: 1.7,
    textAlign: "right",
    marginTop: 8,
  },
  titleArea: {
    alignItems: "center",
    marginBottom: 16,
  },
  mainTitleImage: {
    height: 28,
  },
  locationImage: {
    marginTop: 8,
    height: 18,
  },
  formBox: {
    borderWidth: 1,
    borderColor: GREEN,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 22,
  },
  field: {
    flexDirection: "row",
    alignItems: "flex-end",
    minHeight: 28,
    marginBottom: 6,
  },
  labelImage: {
    width: 130,
    height: 16,
  },
  line: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: "#222222",
    borderBottomStyle: "dashed",
    minHeight: 16,
    justifyContent: "flex-end",
    paddingBottom: 2,
  },
  value: {
    fontSize: 11,
    fontFamily: "Helvetica",
  },
  problemSection: {
    borderWidth: 1,
    borderColor: GREEN,
    minHeight: 160,
    paddingTop: 18,
    paddingHorizontal: 14,
    paddingBottom: 10,
    marginBottom: 20,
  },
  sectionTitleImage: {
    height: 24,
    marginBottom: 12,
  },
  writingLine: {
    height: 28,
    borderBottomWidth: 1,
    borderBottomColor: "#222222",
    borderBottomStyle: "dashed",
  },
  problemText: {
    fontSize: 11,
    fontFamily: "Helvetica",
    lineHeight: 1.5,
    marginBottom: 8,
  },
  consent: {
    borderWidth: 1,
    borderColor: GREEN,
    backgroundColor: LIGHT_GOLD,
    paddingVertical: 12,
    paddingHorizontal: 18,
    marginBottom: 8,
  },
  consentImage: {
    width: "100%",
    height: 56,
  },
  signatureArea: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
  },
  signatureLeft: {
    width: "42%",
    flexDirection: "row",
    alignItems: "flex-end",
  },
  signatureRight: {
    width: "48%",
  },
  signatureRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 18,
  },
  signatureLabelImage: {
    width: 40,
    height: 14,
  },
  signatureLine: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: "#222222",
    borderBottomStyle: "dashed",
  },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 48,
    backgroundColor: GREEN,
    borderTopWidth: 3,
    borderTopColor: GOLD,
  },
});

export type ApplicationPdfData = {
  name: string;
  age: string;
  relative: string;
  address: string;
  phone: string;
  currentProblem?: string;
};

type MalayalamImages = {
  title: string;
  location: string;
  name: string;
  age: string;
  relative: string;
  address: string;
  phone: string;
  currentProblem: string;
  consent1: string;
  consent2: string;
  date: string;
  signName: string;
  sign: string;
};

type ApplicationPdfProps = {
  data: ApplicationPdfData;
  logoSrc: string | null;
  ml: MalayalamImages;
};

function arrayBufferToDataUri(buffer: ArrayBuffer, mime: string) {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return `data:${mime};base64,${btoa(binary)}`;
}

async function loadMalayalamFont() {
  const font = new FontFace(
    "NotoMalayalamPdf",
    `url(${window.location.origin}/fonts/NotoSansMalayalam-Regular.ttf)`,
  );
  await font.load();
  document.fonts.add(font);
  await document.fonts.ready;
}

function renderMalayalamText(
  text: string,
  options: {
    fontSize?: number;
    color?: string;
    background?: string;
    paddingX?: number;
    paddingY?: number;
    maxWidth?: number;
    bold?: boolean;
  } = {},
) {
  const {
    fontSize = 14,
    color = "#111111",
    background = "transparent",
    paddingX = 0,
    paddingY = 0,
    maxWidth = 520,
    bold = false,
  } = options;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unavailable");

  const dpr = 2;
  ctx.font = `${bold ? "700" : "400"} ${fontSize}px NotoMalayalamPdf`;
  const lines: string[] = [];
  const words = text.split(/\s+/).filter(Boolean);
  let current = "";

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (ctx.measureText(next).width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);
  if (!lines.length) lines.push(text);

  const lineHeight = fontSize * 1.45;
  const width =
    Math.ceil(
      Math.max(...lines.map((line) => ctx.measureText(line).width)) +
        paddingX * 2,
    ) || 10;
  const height = Math.ceil(lines.length * lineHeight + paddingY * 2);

  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, width, height);

  if (background !== "transparent") {
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, width, height);
  }

  ctx.font = `${bold ? "700" : "400"} ${fontSize}px NotoMalayalamPdf`;
  ctx.fillStyle = color;
  ctx.textBaseline = "top";
  lines.forEach((line, index) => {
    ctx.fillText(line, paddingX, paddingY + index * lineHeight);
  });

  return {
    src: canvas.toDataURL("image/png"),
    width,
    height,
  };
}

async function prepareAssets() {
  await loadMalayalamFont();

  const logoRes = await fetch(`${window.location.origin}/logo.png`);
  const logoSrc = logoRes.ok
    ? arrayBufferToDataUri(await logoRes.arrayBuffer(), "image/png")
    : null;

  const ml: MalayalamImages = {
    title: renderMalayalamText("അപേക്ഷ ഫോം", {
      fontSize: 16,
      color: "#FFFFFF",
      background: GREEN,
      paddingX: 18,
      paddingY: 7,
      bold: true,
    }).src,
    location: renderMalayalamText("കാഞ്ഞിലിപ്പടി, പിരിഹാരത്തോട്", {
      fontSize: 12,
    }).src,
    name: renderMalayalamText("പേര്", { fontSize: 12 }).src,
    age: renderMalayalamText("വയസ്സ്", { fontSize: 12 }).src,
    relative: renderMalayalamText("അടുത്ത ബന്ധുവിന്റെ പേര്", {
      fontSize: 12,
    }).src,
    address: renderMalayalamText("പൂർണ്ണ മേൽവിലാസം", { fontSize: 12 }).src,
    phone: renderMalayalamText("ഫോൺ", { fontSize: 12 }).src,
    currentProblem: renderMalayalamText("ഇപ്പോഴത്തെ പ്രശ്നം", {
      fontSize: 12,
      color: "#FFFFFF",
      background: GREEN,
      paddingX: 12,
      paddingY: 5,
      bold: true,
    }).src,
    consent1: renderMalayalamText(
      "എന്റെ പരിചരണ സഹായത്തിനോടെയാണ് ഞാൻ കൗൺസിലിംഗിന് എത്തിച്ചേരുന്നത്. ഇവിടെനിന്നും നൽകുന്ന നിർദ്ദേശങ്ങൾ സ്വീകരിക്കാനും പിന്തുടരാനും ഞാൻ തയ്യാറാണ്.",
      { fontSize: 11, maxWidth: 460 },
    ).src,
    consent2: renderMalayalamText(
      "വൈദ്യന്റെ ഏതെങ്കിലും പ്രവർത്തനങ്ങൾ പരിഹരിക്കുവാനും ഞാൻ ആഗ്രഹിക്കുന്നു.",
      { fontSize: 11, maxWidth: 460 },
    ).src,
    date: renderMalayalamText("തീയതി", { fontSize: 11 }).src,
    signName: renderMalayalamText("പേര്", { fontSize: 11 }).src,
    sign: renderMalayalamText("ഒപ്പ്", { fontSize: 11 }).src,
  };

  return { logoSrc, ml };
}

export function ApplicationPdf({ data, logoSrc, ml }: ApplicationPdfProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.brand}>
            {logoSrc ? <Image src={logoSrc} style={styles.logo} /> : null}
            <View style={styles.brandText}>
              <Text style={styles.treasure}>TREASURE</Text>
              <Text style={styles.tagline}>FOR THE PEOPLE WHO MATTER</Text>
            </View>
          </View>
          <View style={styles.contact}>
            <Text>9061200099</Text>
            <Text>7306941801</Text>
          </View>
        </View>

        <View style={styles.titleArea}>
          <Image src={ml.title} style={styles.mainTitleImage} />
          <Image src={ml.location} style={styles.locationImage} />
        </View>

        <View style={styles.formBox}>
          <FormField labelSrc={ml.name} value={data.name} />
          <FormField labelSrc={ml.age} value={data.age} />
          <FormField labelSrc={ml.relative} value={data.relative} />
          <FormField labelSrc={ml.address} value={data.address} />
          <FormField labelSrc={ml.phone} value={data.phone} />
        </View>

        <View style={styles.problemSection}>
          <Image src={ml.currentProblem} style={styles.sectionTitleImage} />
          {data.currentProblem ? (
            <Text style={styles.problemText}>{data.currentProblem}</Text>
          ) : null}
          <View style={styles.writingLine} />
          <View style={styles.writingLine} />
          <View style={styles.writingLine} />
          <View style={styles.writingLine} />
        </View>

        <View style={styles.consent}>
          <Image src={ml.consent1} style={styles.consentImage} />
          <Image src={ml.consent2} style={[styles.consentImage, { height: 28 }]} />
        </View>

        <View style={styles.signatureArea}>
          <View style={styles.signatureLeft}>
            <Image src={ml.date} style={styles.signatureLabelImage} />
            <View style={styles.signatureLine} />
          </View>
          <View style={styles.signatureRight}>
            <View style={styles.signatureRow}>
              <Image src={ml.signName} style={styles.signatureLabelImage} />
              <View style={styles.signatureLine} />
            </View>
            <View style={styles.signatureRow}>
              <Image src={ml.sign} style={styles.signatureLabelImage} />
              <View style={styles.signatureLine} />
            </View>
          </View>
        </View>

        <View style={styles.footer} />
      </Page>
    </Document>
  );
}

function FormField({
  labelSrc,
  value,
}: {
  labelSrc: string;
  value?: string;
}) {
  return (
    <View style={styles.field}>
      <Image src={labelSrc} style={styles.labelImage} />
      <View style={styles.line}>
        {value ? <Text style={styles.value}>{value}</Text> : null}
      </View>
    </View>
  );
}

export async function downloadApplicationPdf(data: ApplicationPdfData) {
  const { logoSrc, ml } = await prepareAssets();
  const blob = await pdf(
    <ApplicationPdf data={data} logoSrc={logoSrc} ml={ml} />,
  ).toBlob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `application-form-${data.name || "client"}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
