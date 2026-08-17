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

export function StudentIntakePdfPage({ data }: PageProps) {
  return (
    <Layout title="Student Intake Form">
      <Table
        rows={[
          "Name",
          "Gender",
          "Age & DOB",
          "Name of school & Place",
          "Class",
          "Medium",
          "Board of Education",
          "Father & Mother Name",
          "Contact Number",
          "Place & District",
          "Medical Problem (if any)",
          "Behavior issues",
          "Psychological issues",
          "History Of Family",
          "Special Talents",
          "Areas of improvement",
          "Type of learner",
          "Family",
        ]}
      />
    </Layout>
  );
}
