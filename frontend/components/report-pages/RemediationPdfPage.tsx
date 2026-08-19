import { Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { ApplicationPdfData } from "@/components/ApplicationPdf";
type PageProps = { data: ApplicationPdfData };
const styles = StyleSheet.create({
  page: { padding: 42, fontFamily: "Helvetica" },
  title: {
    textAlign: "center",
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    marginBottom: 10,
  },
  section: { borderWidth: 1 },
  block: { marginBottom: 22 },
  row: {
    flexDirection: "row",
    minHeight: 34,
    borderBottomWidth: 1,
    borderBottomColor: "#999",
  },
  dateRow: { minHeight: 32 },
  planRow: { minHeight: 100 },
  improvementRow: { minHeight: 86 },
  signatureRow: { minHeight: 32 },
  label: {
    width: "42%",
    padding: 8,
    fontSize: 10,
    borderRightWidth: 1,
    borderRightColor: "#999",
  },
  value: { flex: 1 },
});
function Block() {
  const rows = [
    ["Date", styles.dateRow],
    ["Plan / Recommendation", styles.planRow],
    ["Improvement Seen", styles.improvementRow],
    ["Doctor / Counsellor Name & Signature", styles.signatureRow],
  ] as const;

  return (
    <View style={styles.section} wrap={false}>
      {rows.map(([label, rowStyle]) => (
        <View style={[styles.row, rowStyle]} key={label}>
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.value} />
        </View>
      ))}
    </View>
  );
}

export function RemediationPdfPage({ data }: PageProps) {
  const entries = data.remediationEntries || [];

  const blocks = entries.length > 0
    ? entries
    : [{ entry_date: "", remediation_given: "", improvement_seen: "" }];

  return (
    <Page size="A4" style={styles.page} wrap={false}>
      <Text style={styles.title}>Remediation &amp; Improvement</Text>
      {blocks.map((entry: any, index: number) => (
        <View key={index} style={[styles.section, styles.block]} wrap={false}>
          {([
            ["Date", entry.entry_date || "", styles.dateRow],
            ["Remediation given", entry.remediation_given || "", styles.planRow],
            ["Improvement seen", entry.improvement_seen || "", styles.improvementRow],
            ["Doctor / Counsellor Name & Signature", "", styles.signatureRow],
          ] as const).map(([label, value, rowStyle]) => (
            <View style={[styles.row, rowStyle]} key={`${label}-${index}`}>
              <Text style={styles.label}>{label}</Text>
              <Text style={[styles.value, { padding: 8, fontSize: 10 }]}>{value}</Text>
            </View>
          ))}
        </View>
      ))}
    </Page>
  );
}
