"use client";
import { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import Letterhead from "./Letterhead";
import LetterSignoff from "./LetterSignoff";
import type { LetterFieldsValue } from "./LetterFields";

export default function LetterPreview({
  fields,
  html,
}: {
  fields: LetterFieldsValue;
  html: string;
}) {
  const measurement = useRef<HTMLDivElement>(null);
  const [pages, setPages] = useState<string[]>([""]);
  useEffect(() => {
    let cancelled = false;
    const frame = requestAnimationFrame(() => {
      const body = measurement.current;
      if (!body) return;
      const header =
        body.parentElement?.querySelector<HTMLElement>(".letterhead");
      const date =
        body.parentElement?.querySelector<HTMLElement>(".letter-metadata");
      if (header) header.style.display = "";
      if (date) date.style.display = "";
      const source = document.createElement("div");
      source.innerHTML = html || "<p><br></p>";
      const result: string[] = [];
      body.replaceChildren();
      const fits = () => body.scrollHeight <= body.clientHeight + 1;
      const finish = () => {
        result.push(body.innerHTML);
        body.replaceChildren();
        // Continuation pages use the extra space left by the first-page header.
        if (header) header.style.display = "none";
        if (date) date.style.display = "none";
      };
      const pending = [...source.childNodes];
      while (pending.length) {
        const node = pending.shift()!;
        body.append(node);
        if (fits()) continue;
        node.remove();
        // Split long paragraphs/lists while retaining their inline formatting.
        if (
          node instanceof HTMLElement &&
          (node.textContent?.length || 0) > 1
        ) {
          const texts: Text[] = [];
          const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
          while (walker.nextNode()) texts.push(walker.currentNode as Text);
          const length = texts.reduce((sum, text) => sum + text.length, 0);
          const fragment = (start: number, end: number) => {
            const range = document.createRange();
            range.selectNodeContents(node);
            let offset = 0;
            for (const text of texts) {
              if (start >= offset && start < offset + text.length)
                range.setStart(text, start - offset);
              if (end > offset && end <= offset + text.length) {
                range.setEnd(text, end - offset);
                break;
              }
              offset += text.length;
            }
            const clone = node.cloneNode(false) as HTMLElement;
            clone.append(range.cloneContents());
            return clone;
          };
          let low = 0,
            high = length;
          while (low < high) {
            const middle = Math.ceil((low + high) / 2);
            const part = fragment(0, middle);
            body.append(part);
            const fitsPart = fits();
            part.remove();
            if (fitsPart) low = middle;
            else high = middle - 1;
          }
          if (low > 0 && low < length) {
            // Prefer a word boundary, retaining every character in the remainder.
            const boundary = node.textContent!.lastIndexOf(" ", low - 1);
            if (boundary > low * 0.7) low = boundary + 1;
            body.append(fragment(0, low));
            pending.unshift(fragment(low, length));
            finish();
            continue;
          }
        }
        if (body.childNodes.length) {
          finish();
          pending.unshift(node);
        } else {
          body.append(node);
          finish();
        }
      }
      if (body.childNodes.length || !result.length) result.push(body.innerHTML);
      body.replaceChildren();
      if (!cancelled) setPages(result);
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
    };
  }, [html, fields.date]);
  const page = (content: string, index: number, measuring = false) => (
    <article className="letter-paper" key={measuring ? "measure" : index}>
      {index === 0 && <Letterhead />}
      {index === 0 && (
        <div className="letter-metadata">
          <span>Date: {dayjs(fields.date).format("DD MMM YYYY")}</span>
        </div>
      )}
      <div
        ref={measuring ? measurement : undefined}
        className="letter-body ql-editor"
        dangerouslySetInnerHTML={measuring ? undefined : { __html: content }}
      />
      <footer className="letter-closing">
        {(measuring || index === pages.length - 1) && <LetterSignoff />}
      </footer>
    </article>
  );
  return (
    <div className="letter-pages">
      <div className="letter-measurement" aria-hidden="true">
        {page("", 0, true)}
      </div>
      {pages.map((content, index) => page(content, index))}
    </div>
  );
}
