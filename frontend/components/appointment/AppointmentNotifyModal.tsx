"use client";

import { useEffect, useState } from "react";
import { ConfigProvider, Modal } from "antd";
import { FaWhatsapp } from "react-icons/fa";
import { FiDownload } from "react-icons/fi";
import {
  CLINIC_NAME,
  createConfirmationBlob,
  shareOrNotifyConfirmation,
  triggerPdfDownload,
  type AppointmentNotifyDetails,
} from "@/components/appointment/AppointmentConfirmationPdf";

const themeConfig = {
  token: {
    colorPrimary: "#2D5A3F",
    colorLink: "#144229",
    borderRadius: 6,
    fontFamily: "var(--font-manrope), system-ui, sans-serif",
  },
};

type AppointmentNotifyModalProps = {
  open: boolean;
  details: AppointmentNotifyDetails | null;
  onClose: () => void;
};

export default function AppointmentNotifyModal({
  open,
  details,
  onClose,
}: AppointmentNotifyModalProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let revoked: string | null = null;
    let cancelled = false;

    async function prepare() {
      if (!open || !details) {
        setPreviewUrl(null);
        setPdfBlob(null);
        setError("");
        return;
      }

      setBusy(true);
      setError("");
      try {
        const blob = await createConfirmationBlob(details);
        if (cancelled) return;
        const url = URL.createObjectURL(blob);
        revoked = url;
        setPdfBlob(blob);
        setPreviewUrl(url);
        triggerPdfDownload(blob, details.name);
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          setError("Could not generate the confirmation PDF. Please try again.");
        }
      } finally {
        if (!cancelled) setBusy(false);
      }
    }

    prepare();

    return () => {
      cancelled = true;
      if (revoked) URL.revokeObjectURL(revoked);
    };
  }, [open, details]);

  const handleDownload = () => {
    if (!details || !pdfBlob) return;
    triggerPdfDownload(pdfBlob, details.name);
  };

  const handleWhatsApp = async () => {
    if (!details || !pdfBlob) return;
    await shareOrNotifyConfirmation(details, pdfBlob);
  };

  return (
    <ConfigProvider theme={themeConfig}>
      <Modal
        title={
          <span className="text-lg font-semibold capitalize tracking-wide text-[#144229]">
            Appointment confirmation
          </span>
        }
        open={open}
        onCancel={onClose}
        footer={null}
        width="100%"
        style={{ maxWidth: 880, top: 8, paddingBottom: 0 }}
        className="px-3 sm:px-0"
        styles={{ body: { maxHeight: "88vh", overflowY: "auto", paddingBottom: 16 } }}
        destroyOnHidden
      >
        {details ? (
          <div className="space-y-4 pt-1">
            <p className="m-0 text-sm text-[#414942]">
              Confirmation for <strong className="text-[#144229]">{details.name}</strong>{" "}
              at {details.time} on {details.date}. Notify opens WhatsApp chat
              with this number even if it is not saved. Attach the downloaded
              PDF before sending.
            </p>

            <div className="overflow-hidden rounded-md border border-[#d8c9a3] bg-[#faf7ee]">
              {previewUrl ? (
                <iframe
                  title={`${CLINIC_NAME} appointment confirmation`}
                  src={`${previewUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                  className="h-[min(72vh,760px)] w-full bg-[#faf7ee]"
                />
              ) : (
                <div className="flex h-[280px] items-center justify-center text-sm text-[#667362]">
                  {busy ? "Preparing confirmation PDF…" : "PDF preview unavailable"}
                </div>
              )}
            </div>

            {error ? <p className="m-0 text-sm text-[#7b2027]">{error}</p> : null}

            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                disabled={busy}
                onClick={handleDownload}
                className="inline-flex cursor-pointer h-11 flex-1 items-center justify-center gap-2 rounded-md border border-[#2d5a3f] bg-white px-4 text-sm font-bold text-[#144229] hover:bg-[#e8f7ee] disabled:opacity-60"
              >
                <FiDownload aria-hidden="true" />
                Download PDF
              </button>
              <button
                type="button"
                disabled={busy || !details.phone}
                onClick={handleWhatsApp}
                className="cursor-pointer inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-md bg-[#25D366] px-4 text-sm font-bold text-white hover:bg-[#1ebe5d] disabled:opacity-60"
              >
                <FaWhatsapp aria-hidden="true" className="text-lg" />
                Notify on WhatsApp
              </button>
            </div>
          </div>
        ) : null}
      </Modal>
    </ConfigProvider>
  );
}
