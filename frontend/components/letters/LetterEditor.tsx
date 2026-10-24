"use client";
import { useEffect, useRef, useState } from "react";
import type Quill from "quill";
import { Alert, Button } from "antd";
import "quill/dist/quill.snow.css";
import LetterFields, { type LetterFieldsValue } from "./LetterFields";
import { FiEdit3, FiRotateCcw } from "react-icons/fi";

export default function LetterEditor({ onChange, fields, onFieldsChange }: { onChange: (html: string) => void; fields: LetterFieldsValue; onFieldsChange: (fields: LetterFieldsValue) => void }) {
  const host = useRef<HTMLDivElement>(null);
  const editor = useRef<Quill | null>(null);
  const callback = useRef(onChange);
  const [error, setError] = useState(false);
  useEffect(() => { callback.current = onChange; }, [onChange]);
  useEffect(() => {
    let disposed = false;
    const node = host.current;
    import("quill").then(({ default: QuillEditor }) => {
      if (disposed || !node) return;
      const container = document.createElement("div");
      node.append(container);
      const instance = new QuillEditor(container, {
        theme: "snow", placeholder: "Write your letter here…",
        modules: {
          toolbar: [[{ header: [1, 2, 3, false] }, { size: ["small", false, "large", "huge"] }],
            ["bold", "italic", "underline", "strike"], [{ color: [] }, { background: [] }],
            [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
            [{ align: [] }], ["link", "blockquote"], ["clean"]],
          history: { userOnly: true },
        },
      });
      editor.current = instance;
      instance.on("text-change", () => callback.current(instance.getSemanticHTML()));
    }).catch(() => { if (!disposed) setError(true); });
    return () => { disposed = true; editor.current = null; node?.replaceChildren(); };
  }, []);
  return <div className="letter-editor">
    {error && <Alert type="error" title="The editor could not load. Please reload the page." />}
    <div className="letter-editor-history">
      <div className="letter-editor-heading"><span className="letter-editor-heading-icon"><FiEdit3 aria-hidden="true" /></span><div><h2>Letter body</h2><p>Compose your letter below</p></div></div>
      <div className="letter-editor-controls"><LetterFields value={fields} onChange={onFieldsChange} /><div className="letter-editor-undo"><Button type="text" icon={<FiRotateCcw />} onClick={() => editor.current?.history.undo()}>Undo</Button></div></div>
    </div>
    <div ref={host} />
  </div>;
}
