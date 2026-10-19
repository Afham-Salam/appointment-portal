"use client";
import { Button, Popconfirm, Segmented } from "antd";
import { FiPlus, FiPrinter } from "react-icons/fi";

export default function LetterActions({ preview, onPreview, onNew, onPrint, printing }: {
  preview: boolean; onPreview: (value: boolean) => void; onNew: () => void; onPrint: () => void; printing: boolean;
}) {
  return <div className="letter-actions flex flex-wrap items-center gap-2">
    <Segmented options={["Edit", "Preview"]} value={preview ? "Preview" : "Edit"} onChange={value => onPreview(value === "Preview")} />
    <Popconfirm title="Start a new letter?" description="Your current letter will be cleared." onConfirm={onNew}><Button icon={<FiPlus />}>New letter</Button></Popconfirm>
    <Button type="primary" icon={<FiPrinter />} loading={printing} onClick={onPrint}>Print / Save PDF</Button>
  </div>;
}
