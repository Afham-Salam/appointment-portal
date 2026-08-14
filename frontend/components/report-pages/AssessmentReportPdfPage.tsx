import { Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import type { ApplicationPdfData } from "@/components/ApplicationPdf";

type PageProps = { data: ApplicationPdfData };

const styles = StyleSheet.create({
  page: { padding: 48, fontFamily: "Helvetica", fontSize: 9, color: "#222" },
  heading: {
    textAlign: "center",
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    marginBottom: 10,
  },
  table: { borderWidth: 1, borderColor: "#777" },
  row: {
    flexDirection: "row",
    minHeight: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#999",
  },
  cell: { padding: 4, borderRightWidth: 1, borderRightColor: "#999" },
  serial: { width: 28 },
  assessment: { flex: 1 },
  score: { width: 180, borderRightWidth: 0 },
  header: { fontFamily: "Helvetica-Bold", textAlign: "center", padding: 5 },
  subTable: { marginTop: 18 },
  subHeader: {
    flexDirection: "row",
    minHeight: 24,
    backgroundColor: "#f4f4f2",
    borderBottomWidth: 1,
    borderBottomColor: "#777",
  },
  writingIntro: {
    minHeight: 42,
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#999",
  },
  blankRow: { minHeight: 34 },
  pageTwoTable: { borderWidth: 1, borderColor: "#777", marginBottom: 18 },
  largeRow: {
    flexDirection: "row",
    minHeight: 92,
    borderBottomWidth: 1,
    borderBottomColor: "#999",
  },
  largeLabel: {
    width: "48%",
    padding: 5,
    borderRightWidth: 1,
    borderRightColor: "#999",
  },
  shortRow: { minHeight: 27 },
});

const assessmentRows = [
  "Logical Thinking",
  "Listening & following verbal instructions",
  "Sequencing of Numbers",
  "Sequencing of incidents",
  "Reasoning",
  "Number concept",
  "General awareness",
  "Age appropriate colour identification",
  "Attention",
  "Visual memory",
  "Verbal memory",
  "Reading (Level)",
];

const readingRows = [
  "Transposition",
  "Reversal",
  "Omissions",
  "Substitutions",
  "Insertions",
  "Pauses",
  "Inversion",
  "Comprehension",
];
const writingRows = [
  "Transposition",
  "Reversal",
  "Omissions",
  "Substitutions",
  "Inversion",
  "Self-correction",
  "Insertion",
];

function AssessmentTable() {
  return (
    <View style={styles.table}>
      <View style={styles.row}>
        <Text style={[styles.cell, styles.serial, styles.header]}>Sl</Text>
        <Text style={[styles.cell, styles.assessment, styles.header]}>
          Type of Assessment
        </Text>
        <Text style={[styles.cell, styles.score, styles.header]}>Score</Text>
      </View>
      {assessmentRows.map((label, index) => (
        <View style={styles.row} key={label}>
          <Text style={[styles.cell, styles.serial]}>{index + 1}</Text>
          <Text style={[styles.cell, styles.assessment]}>{label}</Text>
          <Text style={[styles.cell, styles.score]}>
            {label === "Number concept" ? "Yes              No" : ""}
          </Text>
        </View>
      ))}
    </View>
  );
}

function SimpleScoreTable({
  title,
  rows,
  writing = false,
}: {
  title: string;
  rows: string[];
  writing?: boolean;
}) {
  return (
    <View style={[styles.table, styles.subTable]}>
      <View style={styles.subHeader}>
        <Text style={[styles.cell, styles.assessment, styles.header]}>
          {title}
        </Text>
        <Text style={[styles.cell, styles.score, styles.header]}>Score</Text>
      </View>
      {writing && (
        <Text style={styles.writingIntro}>
          (Check notebook writing for the last 6 months. Select 6 pages
          randomly)
        </Text>
      )}
      {rows.map((label) => (
        <View style={[styles.row, styles.blankRow]} key={label}>
          <Text style={[styles.cell, styles.assessment]}>{label}</Text>
          <Text style={[styles.cell, styles.score]} />
        </View>
      ))}
    </View>
  );
}

function AssessmentPage({ data }: PageProps) {
  return (
    <Page size="A4" style={styles.page} wrap={false}>
      <Text style={styles.heading}>Assessment Report Sheet</Text>
      <AssessmentTable />
      <SimpleScoreTable title="General Reading" rows={readingRows} />
      <View style={[styles.table, styles.subTable]}>
        <View style={styles.row}>
          <Text style={[styles.cell, styles.assessment]}>
            13&nbsp;&nbsp; Writing
          </Text>
          <Text style={[styles.cell, styles.score]} />
        </View>
      </View>
      <SimpleScoreTable title="Writing" rows={writingRows} writing />
    </Page>
  );
}

function DetailsPage() {
  const blocks = ["Presented Problem", "Identified Problem", "Remarks"];
  return (
    <Page size="A4" style={styles.page} wrap={false}>
      <View style={styles.pageTwoTable}>
        <View style={[styles.row, styles.shortRow]}>
          <Text style={[styles.cell, styles.largeLabel]}>14. Mathematics</Text>
          <Text style={[styles.cell, styles.assessment]} />
        </View>
      </View>
      <View style={styles.pageTwoTable}>
        <View style={[styles.row, styles.shortRow]}>
          <Text style={[styles.cell, styles.largeLabel]}>
            Family History (if any)
          </Text>
          <Text style={[styles.cell, styles.assessment]} />
        </View>
      </View>
      {blocks.map((label) => (
        <View style={styles.pageTwoTable} key={label}>
          <View style={styles.largeRow}>
            <Text style={styles.largeLabel}>{label}</Text>
            <Text style={styles.assessment} />
          </View>
        </View>
      ))}
      <View style={styles.table}>
        <View style={[styles.row, styles.shortRow]}>
          <Text style={[styles.cell, styles.largeLabel]}>Assessed by</Text>
          <Text style={[styles.cell, styles.assessment]} />
        </View>
        <View style={[styles.row, styles.shortRow]}>
          <Text style={[styles.cell, styles.largeLabel]}>Name & Signature</Text>
          <Text style={[styles.cell, styles.assessment]} />
        </View>
        <View style={[styles.row, styles.shortRow]}>
          <Text style={[styles.cell, styles.largeLabel]}>Date</Text>
          <Text style={[styles.cell, styles.assessment]} />
        </View>
      </View>
    </Page>
  );
}

export function AssessmentReportPdfPage({ data }: PageProps) {
  return (
    <>
      <AssessmentPage data={data} />
      <DetailsPage />
    </>
  );
}
