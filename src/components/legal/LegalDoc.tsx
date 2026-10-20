import React from "react";
import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import "./legal.css";

export type LegalSlug = "privacy-policy" | "terms" | "refund-policy" | "disclaimer";

const META: Record<LegalSlug, { title: string; sub: string }> = {
  "privacy-policy": {
    title: "Privacy Policy",
    sub: "What we collect, why we collect it, and what you can ask us to do about it.",
  },
  terms: {
    title: "Terms & Conditions",
    sub: "The agreement between you and Culture Flow when you use this website or enrol in a programme.",
  },
  "refund-policy": {
    title: "Refund & Cancellation Policy",
    sub: "How cancellations, refunds, transfers and deferrals work — in plain numbers.",
  },
  disclaimer: {
    title: "Disclaimer",
    sub: "What our website and programmes can and cannot promise.",
  },
};

type Block =
  | { kind: "h"; num: string; text: string }
  | { kind: "p"; text: string }
  | { kind: "table"; rows: string[][] };

function parse(raw: string): { updated: string; blocks: Block[] } {
  const lines = raw.replace(/\r\n/g, "\n").split("\n");
  let updated = "19 October 2026";
  const blocks: Block[] = [];

  for (const line of lines) {
    const t = line.trim();
    if (!t) continue;
    const mUp = t.match(/Last Updated:\s*([0-9]+\s+\w+\s+\d{4})/i);
    if (mUp) { updated = mUp[1]; continue; }
    const h = t.match(/^(\d+(?:\.\d+)*\.?)\s+([A-Z].*)$/);
    if (h && t.length < 90) {
      blocks.push({ kind: "h", num: h[1].replace(/\.$/, ""), text: h[2] });
      continue;
    }
    if (t.startsWith("|")) {
      blocks.push({ kind: "table", rows: [t.split("|").map((c) => c.trim()).filter((c) => c !== "")] });
      continue;
    }
    if (/^- End of/.test(t)) continue;
    if (/^(Culture Flow Private Limited|CIN:|Website:|Effective Date:|TERMS|PRIVACY|REFUND|DISCLAIMER)/.test(t) && blocks.length === 0) {
      continue; // document header meta — rendered by the component chrome
    }
    // Word exports each source paragraph as its own line — same-to-same
    blocks.push({ kind: "p", text: t });
  }
  return { updated, blocks };
}

/** Convert raw text into internal links / mailtos and return React nodes. */
function linkify(text: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  const re = /(www\.cultureflow\.in\/[a-z-]+|info@cultureflow\.in)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const tok = m[0];
    if (tok.endsWith("@cultureflow.in")) {
      out.push(<a key={k++} href={`mailto:${tok}`}>{tok}</a>);
    } else {
      const slug = "/" + tok.replace("www.cultureflow.in/", "");
      out.push(<Link key={k++} href={slug}>{tok}</Link>);
    }
    last = m.index + tok.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export default function LegalDoc({ slug }: { slug: LegalSlug }) {
  const meta = META[slug];
  const raw = fs.readFileSync(path.join(process.cwd(), "src/content/legal", `${slug}.txt`), "utf8");
  const { updated, blocks } = parse(raw);

  // render, merging consecutive table rows into one <table>
  const out: React.ReactNode[] = [];
  let openTable: string[][] | null = null;
  const closeTable = () => {
    if (!openTable) return;
    const [head, ...rows] = openTable;
    out.push(
      <table key={`t${out.length}`} className="ld-table">
        <thead>
          <tr>{head.map((c, j) => <th key={j}>{c}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((r, j) => (
            <tr key={j}>{r.map((c, k2) => <td key={k2}>{c}</td>)}</tr>
          ))}
        </tbody>
      </table>
    );
    openTable = null;
  };

  blocks.forEach((b, i) => {
    if (b.kind === "table") {
      if (!openTable) openTable = [];
      openTable.push(b.rows[0]);
      return;
    }
    closeTable();
    if (b.kind === "h") {
      out.push(
        <h2 key={i} className="ld-h">
          <span className="ld-h-num">{b.num}</span> {b.text}
        </h2>
      );
    } else {
      out.push(<p key={i} className="ld-p">{linkify(b.text)}</p>);
    }
  });
  closeTable();
  const rendered = out;

  return (
    <main className="ld-page">
      <header className="ld-head">
        <h1 className="ld-title">{meta.title}</h1>
        <p className="ld-sub">{meta.sub}</p>
        <div className="ld-meta">
          <span>LAST UPDATED {updated.toUpperCase()}</span>
          <span>CULTURE FLOW PRIVATE LIMITED · CIN U85500DL2026PTC471392</span>
        </div>
      </header>
      <div className="ld-band">
        <article className="ld-body">{rendered}</article>
      </div>
    </main>
  );
}
