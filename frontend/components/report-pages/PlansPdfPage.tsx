import { Page, Text, View, StyleSheet } from "@react-pdf/renderer";

import type { ApplicationPdfData } from "@/components/ApplicationPdf";

type PageProps = {
  data: ApplicationPdfData;
};

const BORDER = "#999999";

const styles = StyleSheet.create({
  page: {
    padding: 42,
    fontFamily: "Helvetica",
  },

  title: {
    textAlign: "center",
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    marginBottom: 10,
  },

  section: {
    borderWidth: 1,
    borderColor: "#333333",
  },

  planBlock: {
    marginBottom: 18,
  },

  secondPlanBlock: {
    marginTop: 18,
  },

  row: {
    flexDirection: "row",
    minHeight: 34,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },

  /* Separate the two plan blocks with one continuous divider. */
  secondSectionRow: {
    borderTopWidth: 1,
    borderTopColor: "#333333",
  },

  planRow: {
    minHeight: 75,
  },

  improvementRow: {
    minHeight: 65,
  },

  signatureRow: {
    minHeight: 32,
  },

  lastRow: {
    borderBottomWidth: 0,
  },

  label: {
    width: "42%",

    paddingHorizontal: 8,
    paddingVertical: 8,

    fontSize: 10,

    borderRightWidth: 1,
    borderRightColor: BORDER,
  },

  value: {
    flex: 1,

    paddingHorizontal: 8,
    paddingVertical: 8,

    fontSize: 10,
  },
});

function Layout({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Page size="A4" style={styles.page} wrap={false}>
      <Text style={styles.title}>{title}</Text>

      {children}
    </Page>
  );
}

const rows = [
  "Date",
  "Plan / Recommendation",
  "Improvement Seen",
  "Doctor / Counsellor Name & Signature",

  "Date",
  "Plan / Recommendation",
  "Improvement Seen",
  "Doctor / Counsellor Name & Signature",
];

function getRowStyle(label: string, index: number, isLast: boolean) {
  const rowStyles: any[] = [styles.row];

  /* Second Date starts new section */
  if (index === 4) {
    rowStyles.push(styles.secondSectionRow);
  }

  if (label === "Plan / Recommendation") {
    rowStyles.push(styles.planRow);
  }

  if (label === "Improvement Seen") {
    rowStyles.push(styles.improvementRow);
  }

  if (label === "Doctor / Counsellor Name & Signature") {
    rowStyles.push(styles.signatureRow);
  }

  if (isLast) {
    rowStyles.push(styles.lastRow);
  }

  return rowStyles;
}

function Table() {
  return (
    <>
      {[rows.slice(0, 4), rows.slice(4)].map((block, blockIndex) => (
        <View
          key={blockIndex}
          style={[
            styles.section,
            styles.planBlock,
            blockIndex === 1 ? styles.secondPlanBlock : undefined,
          ]}
        >
          {block.map((label, index) => (
            <View
              key={`${label}-${blockIndex}-${index}`}
              style={getRowStyle(label, index, index === block.length - 1)}
              wrap={false}
            >
              <Text style={styles.label}>{label}</Text>
              <Text style={styles.value} />
            </View>
          ))}
        </View>
      ))}
    </>
  );
}

export function PlansPdfPage({ data }: PageProps) {
  return (
    <Layout title="Plans">
      <Table />
    </Layout>
  );
}
