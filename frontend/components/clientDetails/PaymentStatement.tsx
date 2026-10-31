import dayjs from "dayjs";
import Letterhead from "@/components/letters/Letterhead";
import "@/app/(dashboard)/letters/letters.css";
import "./payment-statement.css";
import { toTitleCase } from "../helper/titlecase";

type PaymentStatementConfig = {
  totalAmount: number;
  notes?: string;
  payments: {
    id: string;
    date: string;
    amount: number;
    category: string;
    payment_method: string;
    reference: string;
  }[];
};

export type PaymentStatementParty = {
  name: string;
  phone?: string;
  clientType?: string;
};

const rupee = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);

export function paymentPartyLabel(clientType?: string) {
  return clientType?.toLowerCase() === "student" ? "Student" : "Client";
}

export default function PaymentStatement({
  client,
  config,
}: {
  client: PaymentStatementParty;
  config: PaymentStatementConfig;
}) {
  const paidTotal = config.payments.reduce((sum, item) => sum + item.amount, 0);
  const balanceAmount = Math.max(config.totalAmount - paidTotal, 0);
  const label = paymentPartyLabel(client.clientType);

  return (
    <article className="letter-paper payment-statement">
      <Letterhead />
      <div className="letter-metadata">
        <span>Date: {dayjs().format("DD MMM YYYY")}</span>
      </div>
      {/* <p className="payment-statement-kicker">Accounts</p> */}
      <h1 className="payment-statement-title">Payment Statement</h1>
      <div className="payment-statement-rule" />

      <div className="payment-party">
        <div>
          <span>{label}</span>
          <strong>{toTitleCase(client.name)}</strong>
          {client.phone ? <em>{client.phone}</em> : null}
        </div>
        <div>
          <span>Records</span>
          <strong>
            {config.payments.length} payment
            {config.payments.length === 1 ? "" : "s"}
          </strong>
        </div>
      </div>

      <div className="payment-summary">
        <article>
          <span>Total fee</span>
          <strong>{rupee(config.totalAmount)}</strong>
        </article>
        <article>
          <span>Paid amount</span>
          <strong>{rupee(paidTotal)}</strong>
        </article>
        <article>
          <span>Balance</span>
          <strong>{rupee(balanceAmount)}</strong>
          <span
            className={`payment-status ${balanceAmount === 0 ? "settled" : "pending"}`}
          >
            {balanceAmount === 0 ? "Settled" : "Pending"}
          </span>
        </article>
      </div>

      {config.notes ? (
        <p className="payment-notes">
          <strong>Note: </strong>
          {config.notes}
        </p>
      ) : null}

      <p className="payment-section-label">Payments received</p>
      {config.payments.length > 0 ? (
        <table className="payment-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Method</th>
              <th>Reference</th>
              <th className="amount">Paid amount</th>
            </tr>
          </thead>
          <tbody>
            {config.payments.map((item) => (
              <tr key={item.id}>
                <td>{dayjs(item.date).format("DD MMM YYYY")}</td>
                <td>{item.category}</td>
                <td>{item.payment_method}</td>
                <td>{item.reference || "—"}</td>
                <td className="amount">{rupee(item.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="payment-empty">No payments recorded yet</p>
      )}

      <footer className="letter-footer">
        Treasure Counselling Center
        <span>·</span>
        Payment statement
        <span>·</span>
        {dayjs().format("DD MMM YYYY")}
      </footer>
    </article>
  );
}

export async function printPaymentStatement(paper: HTMLElement, title: string) {
  const frame = document.createElement("iframe");
  frame.title = title;
  frame.style.cssText = "position:fixed;width:0;height:0;border:0;";
  document.body.append(frame);
  const doc = frame.contentDocument;
  if (!doc || !frame.contentWindow) {
    frame.remove();
    throw new Error("Print window unavailable");
  }

  doc.open();
  doc.write(
    '<!doctype html><html><head></head><body class="letter-print-document"></body></html>',
  );
  doc.close();
  doc.title = title;
  const base = doc.createElement("base");
  base.href = `${window.location.origin}/`;
  doc.head.append(base);
  document
    .querySelectorAll('style, link[rel="stylesheet"]')
    .forEach((style) => doc.head.append(style.cloneNode(true)));
  doc.body.append(paper.cloneNode(true));
  await Promise.all(
    [...doc.querySelectorAll("img")].map((image) =>
      image.decode().catch(() => undefined),
    ),
  );
  await doc.fonts.ready;
  await Promise.all(
    [...doc.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]')].map(
      (link) =>
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
}
