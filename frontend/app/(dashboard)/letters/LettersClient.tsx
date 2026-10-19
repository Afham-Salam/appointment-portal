"use client";
import { useRef, useState } from "react";
import { App, ConfigProvider } from "antd";
import dayjs from "dayjs";
import LetterEditor from "@/components/letters/LetterEditor";
import {
  type LetterFieldsValue,
} from "@/components/letters/LetterFields";
import LetterPreview from "@/components/letters/LetterPreview";
import LetterActions from "@/components/letters/LetterActions";
import "./letters.css";

const emptyFields = (): LetterFieldsValue => ({
  date: dayjs().format("YYYY-MM-DD"),
});

function LetterWorkspace() {
  const [fields, setFields] = useState(emptyFields);
  const [html, setHtml] = useState("");
  const [preview, setPreview] = useState(false);
  const [revision, setRevision] = useState(0);
  const [printing, setPrinting] = useState(false);
  const paper = useRef<HTMLDivElement>(null);
  const { message } = App.useApp();
  const print = async () => {
    if (!paper.current) return;
    setPrinting(true);
    const frame = document.createElement("iframe");
    frame.title = "Letter print preview";
    frame.style.cssText = "position:fixed;width:0;height:0;border:0;";
    document.body.append(frame);
    try {
      const doc = frame.contentDocument;
      if (!doc || !frame.contentWindow)
        throw new Error("Print window unavailable");
      doc.open();
      doc.write(
        `<!doctype html><html><head><title>Treasure Letter</title></head><body class="letter-print-document"></body></html>`,
      );
      doc.close();
      document
        .querySelectorAll('style, link[rel="stylesheet"]')
        .forEach((style) => doc.head.append(style.cloneNode(true)));
      doc.body.append(paper.current.firstElementChild!.cloneNode(true));
      await Promise.all(
        [...doc.querySelectorAll("img")].map((image) =>
          image.decode().catch(() => undefined),
        ),
      );
      await doc.fonts.ready;
      // Allow linked stylesheets to finish loading before the print layout is measured.
      await Promise.all(
        [
          ...doc.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]'),
        ].map((link) =>
          link.sheet
            ? Promise.resolve()
            : new Promise((resolve) => {
                link.onload = resolve;
                link.onerror = resolve;
              }),
        ),
      );
      frame.contentWindow.focus();
      frame.contentWindow.print();
      setTimeout(() => frame.remove(), 60000);
    } catch {
      frame.remove();
      message.error("Could not open print preview. Please try again.");
    } finally {
      setPrinting(false);
    }
  };
  return (
    <div className="letters-page min-w-0 space-y-5 pb-8">
      <div className="page-heading flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1>Letters</h1>
          <p>
            Your clinic letterhead. Thoughtfully written, beautifully presented.
          </p>
        </div>
        <LetterActions
          preview={preview}
          onPreview={setPreview}
          printing={printing}
          onPrint={print}
          onNew={() => {
            setFields(emptyFields());
            setHtml("");
            setRevision((value) => value + 1);
            setPreview(false);
          }}
        />
      </div>
    
      <div className={preview ? "hidden" : "letter-compose space-y-5"}>
        <LetterEditor key={revision} onChange={setHtml} fields={fields} onFieldsChange={setFields} />
      </div>
      <section>
        <div className="mb-3 flex items-center justify-between text-xs font-medium text-[#697461]">
          <span>{preview ? "LETTER PREVIEW" : "LIVE A4 PREVIEW"}</span>
          <span>Long letters continue onto additional printed pages</span>
        </div>
        <div className="letter-preview-scroll">
          <div ref={paper}>
            <LetterPreview fields={fields} html={html} />
          </div>
        </div>
      </section>
    </div>
  );
}

export default function LettersClient() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#2D5A3F",
          borderRadius: 6,
          fontFamily: "var(--font-manrope), sans-serif",
        },
        components: {
          Segmented: { itemSelectedBg: "#2D5A3F", itemSelectedColor: "white", borderRadius: 6, borderRadiusSM: 6 },
        },
      }}
    >
      <App>
        <LetterWorkspace />
      </App>
    </ConfigProvider>
  );
}
