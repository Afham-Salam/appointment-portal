"use client";

import { Button, Checkbox, ConfigProvider, Modal } from "antd";
import {
  downloadApplicationPdf,
  type ApplicationPdfPage,
} from "@/components/ApplicationPdf";
import { useState } from "react";

export type ReportClient = {
  name: string;
  phone: string;
  clientType: string;
};

export function pagesForClient(clientType: string): ApplicationPdfPage[] {
  if (clientType === "Student") {
    return [
      "Application Form",
      "Student Intake Form",
      "Parents' Details",
      "Assessment Report",
      "Remediation & Improvement",
    ];
  }

  if (clientType === "Parent") {
    return ["Application Form", "Parents' Details", "Assessment Report"];
  }

  return ["Application Form", "Mental Status Exam", "Plans"];
}

export default function ReportDownloadModal({
  client,
  open,
  onClose,
}: {
  client: ReportClient | null;
  open: boolean;
  onClose: () => void;
}) {
  const [selectedPages, setSelectedPages] = useState<ApplicationPdfPage[]>(
    client ? pagesForClient(client.clientType) : [],
  );
  const [loading, setLoading] = useState(false);

  const downloadReport = async () => {
    if (!client || !selectedPages.length || loading) return;

    setLoading(true);
    try {
      await downloadApplicationPdf(
        {
          name: client.name,
          age: "",
          relative: "",
          address: "",
          phone: client.phone,
        },
        selectedPages,
      );
      onClose();
    } catch (error) {
      console.error("Report PDF generation failed:", error);
      window.alert("Could not generate the report PDF. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#144229",
          colorPrimaryHover: "#2d5a3f",
          colorPrimaryActive: "#0d301d",
          borderRadius: 6,
          fontFamily: "var(--font-manrope), system-ui, sans-serif",
        },
        components: {
          Modal: {
            colorBgElevated: "#ffffff",
            titleColor: "#144229",
          },
          Button: {
            colorPrimary: "#144229",
            colorPrimaryHover: "#2d5a3f",
            colorPrimaryActive: "#0d301d",
          },
        },
      }}
    >
      <Modal
        title={`Download report · ${client?.name ?? "Client"}`}
        open={open}
        onCancel={onClose}
        footer={[
          <Button key="cancel" onClick={onClose}>
            Cancel
          </Button>,
          <Button
            key="download"
            type="primary"
            disabled={!selectedPages.length}
            loading={loading}
            onClick={downloadReport}
          >
            Download PDF
          </Button>,
        ]}
      >
        <p className="mb-4 text-sm text-[#414942]">
          Select the pages to include in this client&apos;s PDF report.
        </p>
        <Checkbox.Group
          className="flex! flex-col! gap-3! [&_.ant-checkbox-checked_.ant-checkbox-inner]:border-[#144229]! [&_.ant-checkbox-checked_.ant-checkbox-inner]:bg-[#144229]! [&_.ant-checkbox-wrapper:hover_.ant-checkbox-inner]:border-[#2d5a3f]!"
          value={selectedPages}
          options={client ? pagesForClient(client.clientType) : []}
          onChange={(values) => setSelectedPages(values as ApplicationPdfPage[])}
        />
      </Modal>
    </ConfigProvider>
  );
}
