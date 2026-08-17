import {
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

import type { ApplicationPdfData } from "@/components/ApplicationPdf";

type PageProps = {
  data: ApplicationPdfData;
};

const BORDER = "#333333";
const SECTION_BG = "#F5F5F2";

/* =========================================================
   STYLES
========================================================= */

const styles = StyleSheet.create({
  /* ================= PAGE ================= */

  page: {
    paddingTop: 8,
    paddingBottom: 8,
    paddingHorizontal: 9,

    fontFamily: "Helvetica",
    backgroundColor: "#FFFFFF",
  },

  /* ================= MAIN TABLE ================= */

  exam: {
    width: "100%",

    borderWidth: 1,
    borderColor: BORDER,
  },

  /* ======================================================
     CLIENT NAME / DATE
  ====================================================== */

  clientRow: {
    flexDirection: "row",

    minHeight: 24,

    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },

  clientNameGroup: {
    width: "64%",

    flexDirection: "row",
    alignItems: "center",

    borderRightWidth: 1,
    borderRightColor: BORDER,
  },

  dateGroup: {
    width: "36%",

    flexDirection: "row",
    alignItems: "center",
  },

  clientLabel: {
    width: 105,

    paddingHorizontal: 7,

    fontFamily: "Helvetica-Bold",
    fontSize: 9,
  },

  clientValue: {
    flex: 1,

    paddingHorizontal: 6,

    fontSize: 9,
  },

  dateLabel: {
    width: 48,

    paddingHorizontal: 7,

    fontFamily: "Helvetica-Bold",
    fontSize: 9,
  },

  dateValue: {
    flex: 1,

    paddingHorizontal: 6,

    fontSize: 9,
  },

  /* ======================================================
     SECTION TITLE
  ====================================================== */

  sectionTitle: {
    minHeight: 23,

    justifyContent: "center",

    paddingHorizontal: 7,

    backgroundColor: SECTION_BG,

    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },

  sectionTitleText: {
    fontFamily: "Helvetica-Bold",

    fontSize: 10,
  },

  /* ======================================================
     NORMAL EXAM ROW
  ====================================================== */

  tableRow: {
    flexDirection: "row",

    minHeight: 23,

    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },

  labelCell: {
    width: "19%",

    justifyContent: "center",

    paddingHorizontal: 6,
    paddingVertical: 3,

    borderRightWidth: 1,
    borderRightColor: BORDER,
  },

  labelText: {
    fontSize: 8.5,
  },

  optionsCell: {
    width: "81%",

    flexDirection: "row",
    flexWrap: "wrap",

    alignItems: "center",

    paddingHorizontal: 5,
    paddingVertical: 4,
  },

  /* ======================================================
     CHECKBOX OPTION

     Do NOT use marginRight for alignment.

     Each option is placed inside a fixed-width column.
  ====================================================== */

  optionItem: {
    flexDirection: "row",

    alignItems: "center",

    paddingRight: 3,

    marginBottom: 1,
  },

  checkbox: {
    width: 6,
    height: 6,

    borderWidth: 0.7,
    borderColor: "#444444",

    marginRight: 4,
  },

  optionText: {
    fontSize: 8.2,
  },

  /* ======================================================
     COMMENTS
  ====================================================== */

  commentRow: {
    minHeight: 34,

    paddingTop: 5,
    paddingHorizontal: 7,

    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },

  commentText: {
    fontSize: 8.5,
  },

  /* ======================================================
     BEHAVIOR
  ====================================================== */

  behaviorRow: {
    flexDirection: "row",

    minHeight: 42,

    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },

  /* ======================================================
     INSIGHT / JUDGEMENT
  ====================================================== */

  bottomRow: {
    flexDirection: "row",

    minHeight: 28,

    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },

  bottomRowLast: {
    flexDirection: "row",

    minHeight: 28,
  },

  bottomLabel: {
    width: "20%",

    justifyContent: "center",

    paddingHorizontal: 7,

    borderRightWidth: 1,
    borderRightColor: BORDER,
  },

  bottomLabelText: {
    fontFamily: "Helvetica-Bold",

    fontSize: 9.5,
  },

  bottomContent: {
    width: "80%",

    flexDirection: "row",

    alignItems: "center",

    paddingHorizontal: 7,
  },

  bottomOptions: {
    width: "40%",

    flexDirection: "row",

    alignItems: "center",
  },

  commentsLabel: {
    fontSize: 8.5,

    marginLeft: 5,
  },

  commentsLine: {
    flex: 1,

    height: 13,

    marginLeft: 5,

    borderBottomWidth: 0.6,
    borderBottomColor: "#777777",
  },
});

/* =========================================================
   DATA TYPES
========================================================= */

type ExamRowData = {
  label: string;

  options: readonly string[];

  /*
   * Number of fixed checkbox columns.
   *
   * Observations = 5
   * Mood = 7
   * Behavior = 5 (wraps to second row)
   */
  columns: number;
};

type ExamSectionData = {
  title: string;
  rows: readonly ExamRowData[];
};

/* =========================================================
   EXAM DATA
========================================================= */

const sections: readonly ExamSectionData[] = [
  {
    title: "OBSERVATIONS",

    rows: [
      {
        label: "Appearance",

        columns: 5,

        options: [
          "Neat",
          "Dishevelled",
          "Inappropriate",
          "Bizarre",
          "Other",
        ],
      },

      {
        label: "Speech",

        columns: 5,

        options: [
          "Normal",
          "Tangential",
          "Pressured",
          "Impoverished",
          "Other",
        ],
      },

      {
        label: "Eye Contact",

        columns: 5,

        options: [
          "Normal",
          "Intense",
          "Avoidant",
          "Other",
        ],
      },

      {
        label: "Motor Activity",

        columns: 5,

        options: [
          "Normal",
          "Restless",
          "Tics",
          "Slowed",
          "Other",
        ],
      },

      {
        label: "Affect",

        columns: 5,

        options: [
          "Full",
          "Constricted",
          "Flat",
          "Labile",
          "Other",
        ],
      },
    ],
  },

  {
    title: "MOOD",

    rows: [
      {
        label: "",

        columns: 7,

        options: [
          "Euthymic",
          "Anxious",
          "Angry",
          "Depressed",
          "Euphoric",
          "Irritable",
          "Other",
        ],
      },
    ],
  },

  {
    title: "COGNITION",

    rows: [
      {
        label: "Orientation Impairment",

        columns: 5,

        options: [
          "None",
          "Place",
          "Object",
          "Person",
          "Time",
        ],
      },

      {
        label: "Memory Impairment",

        columns: 5,

        options: [
          "None",
          "Short-Term",
          "Long-Term",
          "Other",
        ],
      },

      {
        label: "Attention",

        columns: 5,

        options: [
          "Normal",
          "Distracted",
          "Other",
        ],
      },
    ],
  },

  {
    title: "PERCEPTION",

    rows: [
      {
        label: "Hallucinations",

        columns: 5,

        options: [
          "None",
          "Auditory",
          "Visual",
          "Other",
        ],
      },

      {
        label: "Other",

        columns: 5,

        options: [
          "None",
          "Derealization",
          "Depersonalization",
        ],
      },
    ],
  },

  {
    title: "THOUGHTS",

    rows: [
      {
        label: "Suicidality",

        columns: 5,

        options: [
          "None",
          "Ideation",
          "Plan",
          "Intent",
          "Self-Harm",
        ],
      },

      {
        label: "Homicidality",

        columns: 5,

        options: [
          "None",
          "Aggressive",
          "Intent",
          "Plan",
        ],
      },

      {
        label: "Delusions",

        columns: 5,

        options: [
          "None",
          "Grandiose",
          "Paranoid",
          "Religious",
          "Other",
        ],
      },
    ],
  },

  {
    title: "BEHAVIOR",

    rows: [
      {
        label: "",

        /*
         * Five columns.
         *
         * 10 options automatically become:
         *
         * Row 1 = 5
         * Row 2 = 5
         */
        columns: 5,

        options: [
          "Cooperative",
          "Guarded",
          "Hyperactive",
          "Agitated",
          "Paranoid",
          "Stereotyped",
          "Aggressive",
          "Bizarre",
          "Withdrawn",
          "Other",
        ],
      },
    ],
  },
];

/* =========================================================
   CHECKBOX OPTION
========================================================= */

function CheckOption({
  label,
  columns,
}: {
  label: string;
  columns: number;
}) {
  /*
   * Example:
   *
   * 5 columns = 20%
   * 7 columns = 14.285%
   * 4 columns = 25%
   */

  const width = `${100 / columns}%`;

  return (
    <View
      style={[
        styles.optionItem,

        {
          width,
        },
      ]}
    >
      <View style={styles.checkbox} />

      <Text style={styles.optionText}>
        {label}
      </Text>
    </View>
  );
}

/* =========================================================
   EXAM ROW
========================================================= */

function ExamRow({
  label,
  options,
  columns,
  behavior = false,
}: {
  label: string;
  options: readonly string[];
  columns: number;
  behavior?: boolean;
}) {
  return (
    <View
      style={
        behavior
          ? styles.behaviorRow
          : styles.tableRow
      }
      wrap={false}
    >
      {/* LEFT LABEL */}

      <View style={styles.labelCell}>
        {label ? (
          <Text style={styles.labelText}>
            {label}
          </Text>
        ) : null}
      </View>

      {/* CHECKBOX GRID */}

      <View style={styles.optionsCell}>
        {options.map((option) => (
          <CheckOption
            key={option}
            label={option}
            columns={columns}
          />
        ))}
      </View>
    </View>
  );
}

/* =========================================================
   COMMENTS ROW
========================================================= */

function CommentsRow() {
  return (
    <View
      style={styles.commentRow}
      wrap={false}
    >
      <Text style={styles.commentText}>
        Comments:
      </Text>
    </View>
  );
}

/* =========================================================
   EXAM SECTION
========================================================= */

function ExamSection({
  section,
}: {
  section: ExamSectionData;
}) {
  const isBehavior =
    section.title === "BEHAVIOR";

  return (
    <View wrap={false}>
      {/* SECTION TITLE */}

      <View style={styles.sectionTitle}>
        <Text
          style={styles.sectionTitleText}
        >
          {section.title}
        </Text>
      </View>

      {/* ROWS */}

      {section.rows.map(
        (
          {
            label,
            options,
            columns,
          },
          index,
        ) => (
          <ExamRow
            key={`${section.title}-${label}-${index}`}
            label={label}
            options={options}
            columns={columns}
            behavior={isBehavior}
          />
        ),
      )}

      {/* COMMENTS */}

      <CommentsRow />
    </View>
  );
}

/* =========================================================
   BOTTOM CHECKBOX
========================================================= */

function BottomCheckOption({
  label,
}: {
  label: string;
}) {
  return (
    <View
      style={[
        styles.optionItem,

        {
          width: "33.333%",
        },
      ]}
    >
      <View style={styles.checkbox} />

      <Text style={styles.optionText}>
        {label}
      </Text>
    </View>
  );
}

/* =========================================================
   INSIGHT / JUDGEMENT ROW
========================================================= */

function BottomRow({
  title,
  last = false,
}: {
  title: string;
  last?: boolean;
}) {
  return (
    <View
      style={
        last
          ? styles.bottomRowLast
          : styles.bottomRow
      }
      wrap={false}
    >
      {/* TITLE */}

      <View style={styles.bottomLabel}>
        <Text
          style={styles.bottomLabelText}
        >
          {title}
        </Text>
      </View>

      {/* OPTIONS + COMMENTS */}

      <View style={styles.bottomContent}>
        <View
          style={styles.bottomOptions}
        >
          <BottomCheckOption label="Good" />

          <BottomCheckOption label="Fair" />

          <BottomCheckOption label="Poor" />
        </View>

        <Text
          style={styles.commentsLabel}
        >
          Comments:
        </Text>

        <View
          style={styles.commentsLine}
        />
      </View>
    </View>
  );
}

/* =========================================================
   MENTAL STATUS PDF PAGE
========================================================= */

export function MentalStatusPdfPage({
  data,
}: PageProps) {
  return (
    <Page
      size="A4"
      style={styles.page}
      wrap={false}
    >
      <View style={styles.exam}>
        {/* =================================================
            CLIENT NAME + DATE
        ================================================= */}

        <View style={styles.clientRow}>
          {/* CLIENT */}

          <View
            style={
              styles.clientNameGroup
            }
          >
            <Text
              style={styles.clientLabel}
            >
              Client Name
            </Text>

            <Text
              style={styles.clientValue}
            >
              {data.name || ""}
            </Text>
          </View>

          {/* DATE */}

          <View style={styles.dateGroup}>
            <Text
              style={styles.dateLabel}
            >
              Date
            </Text>

            <Text
              style={styles.dateValue}
            >
              {data.date || ""}
            </Text>
          </View>
        </View>

        {/* =================================================
            OBSERVATIONS / MOOD / ETC.
        ================================================= */}

        {sections.map((section) => (
          <ExamSection
            key={section.title}
            section={section}
          />
        ))}

        {/* =================================================
            INSIGHT
        ================================================= */}

        <BottomRow title="INSIGHT" />

        {/* =================================================
            JUDGEMENT
        ================================================= */}

        <BottomRow
          title="JUDGEMENT"
          last
        />
      </View>
    </Page>
  );
}