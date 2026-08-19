import { Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { ApplicationPdfData } from "@/components/ApplicationPdf";
type PageProps = { data: ApplicationPdfData };

function labelToKey(label: string, index: number): string {
  return `${label.toLowerCase().replace(/[^a-z0-9]+/g, "_")}_${index}`;
}
const styles = StyleSheet.create({
  page: { padding: 42, fontFamily: "Helvetica" },
  title: {
    textAlign: "center",
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    marginBottom: 10,
  },
  section: { borderWidth: 1 },
  row: {
    flexDirection: "row",
    minHeight: 34,
    borderBottomWidth: 1,
    borderBottomColor: "#999",
  },
  label: {
    width: "42%",
    padding: 8,
    fontSize: 10,
    borderRightWidth: 1,
    borderRightColor: "#999",
  },
  value: { flex: 1 },
});
function Layout({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>{title}</Text>
      {children}
    </Page>
  );
}
function Table({ rows }: { rows: string[] }) {
  return (
    <View style={styles.section}>
      {rows.map((label, i) => (
        <View style={styles.row} key={`${label}-${i}`}>
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.value} />
        </View>
      ))}
    </View>
  );
}

export function ParentsDetailsPdfPage({ data }: PageProps) {
  const labels = [
    "Father's Name", "Father's Occupation", "Father's Contact Number",
    "Father's Education", "Father's Address", "Mother's Name",
    "Mother's Occupation", "Mother's Contact Number", "Mother's Education",
    "Mother's Address", "Type of family", "Type of House",
    "Child living with", "Number of brothers", "Number of sisters",
    "Age difference with immediate sibling", "Note", "Assessed by",
    "Name & Signature", "Date",
  ];
 
  return (
    <Layout title="Parents' Details">
      <View style={styles.section}>
        {labels.map((label, i) => (
          <View style={styles.row} key={`${label}-${i}`}>
            <Text style={styles.label}>{label}</Text>
            <Text style={[styles.value, { padding: 8, fontSize: 10 }]}>
              {data.parentsDetails?.[labelToKey(label, i)] || ""}
            </Text>
          </View>
        ))}
      </View>
    </Layout>
  );
}
