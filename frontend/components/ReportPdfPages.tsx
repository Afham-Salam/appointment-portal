import type {
  ApplicationPdfData,
  ApplicationPdfPage,
} from "@/components/ApplicationPdf";
import { StudentIntakePdfPage } from "./report-pages/StudentIntakePdfPage";
import { ParentsDetailsPdfPage } from "./report-pages/ParentsDetailsPdfPage";
import { AssessmentReportPdfPage } from "./report-pages/AssessmentReportPdfPage";
import { RemediationPdfPage } from "./report-pages/RemediationPdfPage";
import { MentalStatusPdfPage } from "./report-pages/MentalStatusPdfPage";
import { PlansPdfPage } from "./report-pages/PlansPdfPage";

export {
  StudentIntakePdfPage,
  ParentsDetailsPdfPage,
  AssessmentReportPdfPage,
  RemediationPdfPage,
  MentalStatusPdfPage,
  PlansPdfPage,
};

export function ReportPdfPage({
  page,
  data,
}: {
  page: Exclude<ApplicationPdfPage, "Application Form">;
  data: ApplicationPdfData;
}) {
  switch (page) {
    case "Student Intake Form":
      return <StudentIntakePdfPage data={data} />;
    case "Parents' Details":
      return <ParentsDetailsPdfPage data={data} />;
    case "Assessment Report":
      return <AssessmentReportPdfPage data={data} />;
    case "Remediation & Improvement":
      return <RemediationPdfPage data={data} />;
    case "Mental Status Exam":
      return <MentalStatusPdfPage data={data} />;
    case "Plans":
      return <PlansPdfPage data={data} />;
  }
}
