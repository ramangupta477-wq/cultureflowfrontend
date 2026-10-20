"use client";

import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Clock,
  Phone,
  MapPin,
  FileDown,
  ArrowUpRight,
  Play,
} from "lucide-react";
import Footer from "../homepage/Footer";
import "./safety.css";

const PILLARS = [
  {
    num: "01",
    title: "1:15 chaperone ratio",
    desc: "One trained chaperone for every fifteen scholars — on every flight, at every site, in every residence.",
  },
  {
    num: "02",
    title: "Comprehensive insurance",
    desc: "Medical, hospitalisation, evacuation, and travel disruption coverage for the full programme duration — arranged by us.",
  },
  {
    num: "03",
    title: "Parent consent & indemnity",
    desc: "A plain-language written agreement covering consent, medical disclosures, and emergency authority. Signed before departure.",
  },
  {
    num: "04",
    title: "Mandatory code of conduct",
    desc: "Behavioural expectations, safety compliance, and consequences — signed by every scholar and parent before the programme begins.",
  },
];

const PROTOCOL = [
  { num: "01", title: "On-ground response", desc: "The on-site chaperone assesses, contains, and acts within the first 15 minutes. No incident waits for approvals." },
  { num: "02", title: "HQ escalation", desc: "Culture Flow's operations team in New Delhi is notified in real time. A named coordinator takes ownership." },
  { num: "03", title: "Parent communication", desc: "Parents are contacted directly — by phone, not email — with a clear situation update and next steps." },
  { num: "04", title: "Resolution & documentation", desc: "Every incident is resolved, logged, and reviewed. Guardians receive a written summary. Protocols are updated if needed." },
];

const DOCUMENTS = [
  { name: "Parent Consent & Indemnity Bond", note: "Consent, medical authority, and emergency protocols · PDF" },
  { name: "Mandatory Code of Conduct", note: "Signed by every scholar and guardian · PDF" },
  { name: "Programme Itinerary & Logistics", note: "Complete schedule, accommodation, transport · PDF" },
];

function useCountUp(to: number, active: boolean, duration = 1400) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(to * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, to, duration]);
  return val;
}

function Stat({ display, countTo, suffix = "", pad, label, active }: {
  display?: string; countTo?: number; suffix?: string; pad?: number; label: string; active: boolean;
}) {
  const v = useCountUp(countTo ?? 0, active);
  const num = countTo === undefined ? display : String(v).padStart(pad ?? 0, "0") + suffix;
  return (
    <div className={`sf-stat sf-reveal ${active ? "sf-reveal--in" : ""}`}>
      <span className="sf-stat-num">{num}</span>
      <span className="sf-stat-label">{label}</span>
    </div>
  );
}

export default function SafetyPage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsActive, setStatsActive] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const els = root.querySelectorAll(".sf-reveal");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target as HTMLElement;
          el.style.transitionDelay = el.style.getPropertyValue("--sf-d") || "0ms";
          el.classList.add("sf-reveal--in");
          io.unobserve(el);
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setStatsActive(true);
          io.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className="safety-page" ref={rootRef}>

      {/* ═══ HERO: tile-matrix (Bible/History reference, CF palette) ═══ */}
      <section className="sf-hero">
        <div className="sf-hero-grid">
          <div className="sf-hg sf-hg-word sf-hg-w1 sf-reveal">Safety</div>

          <div className="sf-hg sf-hg-chip sf-reveal" style={{ "--sf-d": "70ms" } as React.CSSProperties} aria-hidden>
            <ShieldCheck size={30} strokeWidth={1.6} />
          </div>

          <div className="sf-hg sf-hg-explain sf-reveal" style={{ "--sf-d": "140ms" } as React.CSSProperties}>
            <p>
              We will help you send your child abroad with a
              <strong> system, not promises.</strong>
            </p>
            <span className="sf-hg-micro">1:15 chaperone · 24×7 line · 100% insured</span>
          </div>

          <div className="sf-hg sf-hg-stat sf-reveal" style={{ "--sf-d": "210ms" } as React.CSSProperties}>
            <span className="sf-hg-stat-label">Chaperone ratio</span>
            <span className="sf-hg-stat-num">1 : 15</span>
          </div>

          <div className="sf-hg sf-hg-word sf-hg-w2 sf-reveal" style={{ "--sf-d": "280ms" } as React.CSSProperties}>
            Abroad<em>.</em>
          </div>

          <div className="sf-hg sf-hg-avatars sf-reveal" style={{ "--sf-d": "350ms" } as React.CSSProperties}>
            <div className="sf-avatars" aria-hidden>
              <span className="sf-avatar sf-avatar--1">AH</span>
              <span className="sf-avatar sf-avatar--2">RS</span>
              <span className="sf-avatar sf-avatar--3">MJ</span>
            </div>
            <span className="sf-hg-count">1,400+</span>
          </div>

          <div className="sf-hg sf-hg-circ sf-reveal" style={{ "--sf-d": "420ms" } as React.CSSProperties} aria-hidden>
            <svg viewBox="0 0 100 100" className="sf-hg-circ-svg">
              <defs>
                <path id="sf-circ-path" d="M 50,50 m -36,0 a 36,36 0 1,1 72,0 a 36,36 0 1,1 -72,0" />
              </defs>
              <text className="sf-hg-circ-text">
                <textPath href="#sf-circ-path">
                  SAFETY IS A SYSTEM · NOT A PROMISE ·
                </textPath>
              </text>
              <circle cx="50" cy="50" r="3.5" fill="#0B0B0B" />
            </svg>
          </div>

          <a href="#protocol" className="sf-hg sf-hg-stories sf-reveal" style={{ "--sf-d": "490ms" } as React.CSSProperties}>
            <span className="sf-hg-dots" aria-hidden><i /><i /></span>
            <span className="sf-hg-arrow" aria-hidden><ArrowUpRight size={18} strokeWidth={1.8} /></span>
            <span className="sf-hg-stories-label">SEE WHAT HAPPENS<br />IF THINGS GO WRONG</span>
          </a>

          <a href="#pillars" className="sf-hg sf-hg-dark sf-reveal" style={{ "--sf-d": "560ms" } as React.CSSProperties}>
            <span className="sf-hg-dark-label">HOW WE<br />KEEP THEM<br />SAFE</span>
            <span className="sf-hg-play" aria-hidden>
              <Play size={16} strokeWidth={2} fill="#0B0B0B" />
            </span>
          </a>
        </div>
      </section>

      {/* ═══ WHY PARENTS CHOOSE US — bento with map, stacked cards, tall photo ═══ */}
      <section className="sf-why" id="pillars">
        <div className="sf-why-head">
          <div className="sf-why-title-row">
            <h2 className="sf-why-title sf-reveal" style={{ "--sf-d": "80ms" } as React.CSSProperties}>
              Why us
            </h2>
            <p className="sf-why-sub sf-reveal" style={{ "--sf-d": "160ms" } as React.CSSProperties}>
              Safety infrastructure that earns trust before the first departure.
            </p>
          </div>
        </div>

        <div className="sf-why-grid">
          {/* dotted map card */}
          <div className="sf-cell sf-cell--map sf-reveal">
            <img src="/homepage_assets/world.svg" alt="" className="sf-world" aria-hidden />
            <div>
              <h3 className="sf-cell-title">Safety is a system</h3>
              <p className="sf-cell-text">
                Ratios, vetting, insurance, and written protocols — engineered
                into every programme, not added after.
              </p>
            </div>
          </div>

          {/* stacked cards */}
          <div className="sf-why-stack">
            <div className="sf-cell sf-cell--stack sf-reveal" style={{ "--sf-d": "100ms" } as React.CSSProperties}>
              <h3 className="sf-cell-title">Every partner is vetted</h3>
              <p className="sf-cell-text">
                Licensed, referenced, and site-assessed before any agreement is
                signed. Repeated before every cohort.
              </p>
            </div>
            <div className="sf-cell sf-cell--stack sf-reveal" style={{ "--sf-d": "180ms" } as React.CSSProperties}>
              <h3 className="sf-cell-title">Accountability is personal</h3>
              <div className="sf-avatars" aria-hidden>
                <span className="sf-avatar sf-avatar--1">AH</span>
                <span className="sf-avatar sf-avatar--2">RS</span>
                <span className="sf-avatar sf-avatar--3">MJ</span>
              </div>
              <p className="sf-cell-text">
                A named person who answers parent calls directly. Not a ticket.
                Not an inbox.
              </p>
            </div>
          </div>

          {/* tall photo card */}
          <div className="sf-cell sf-cell--tall sf-reveal" style={{ "--sf-d": "260ms" } as React.CSSProperties}>
            <img src="/images/about/campus.jpg" alt="Students on campus" className="sf-cell-img" />
            <div className="sf-tall-overlay">
              <p>See how a program day is supervised — from pickup to lights-out.</p>
              <span className="sf-btn-round sf-btn-round--light" aria-hidden>
                <ArrowUpRight size={16} strokeWidth={1.8} />
              </span>
            </div>
          </div>
        </div>

        {/* Four pillars — 2×2 mini bento */}
        <div className="sf-pillar-grid">
          {PILLARS.map((p, i) => (
            <article key={p.num} className="sf-pillar sf-reveal" style={{ "--sf-d": `${i * 100}ms` } as React.CSSProperties}>
              <div className="sf-pillar-top">
                <span className="sf-pillar-num">{p.num}</span>
                <MapPin size={14} strokeWidth={1.7} className="sf-pillar-ico" aria-hidden />
              </div>
              <h3 className="sf-cell-title">{p.title}</h3>
              <p className="sf-cell-text">{p.desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ═══ PROTOCOL — numbered cards ═══ */}
      <section className="sf-protocol" id="protocol">
        <div className="sf-why-head">
          <h2 className="sf-why-title sf-reveal" style={{ "--sf-d": "80ms" } as React.CSSProperties}>
            What happens when<br />something goes wrong.
          </h2>
          <p className="sf-why-sub sf-reveal" style={{ "--sf-d": "160ms" } as React.CSSProperties}>
            Every programme carries a response protocol — tested, documented, and
            shared with guardians before departure.
          </p>
        </div>
        <div className="sf-protocol-grid">
          {PROTOCOL.map((s, i) => (
            <div key={s.num} className="sf-protocol-card sf-reveal" style={{ "--sf-d": `${i * 110}ms` } as React.CSSProperties}>
              <span className="sf-protocol-num">{s.num}</span>
              <h3 className="sf-cell-title">{s.title}</h3>
              <p className="sf-cell-text">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ DOCUMENTS ═══ */}
      <section className="sf-docs">
        <div className="sf-why-head">
          <h2 className="sf-why-title sf-reveal" style={{ "--sf-d": "60ms" } as React.CSSProperties}>
            Every document.<br />Before departure.
          </h2>
          <p className="sf-docs-note sf-reveal" style={{ "--sf-d": "120ms" } as React.CSSProperties}>
            Nothing is signed without full visibility. Nothing is withheld —
            read the paperwork before we ask you to sign anything.
          </p>
        </div>
        <div className="sf-doc-grid">
          {DOCUMENTS.map((d, i) => (
            <a
              key={d.name}
              href="#"
              className="sf-doc-card sf-reveal"
              style={{ "--sf-d": `${i * 100}ms` } as React.CSSProperties}
              onClick={(e) => e.preventDefault()}
            >
              <span className="sf-doc-ico" aria-hidden><FileDown size={20} strokeWidth={1.6} /></span>
              <span className="sf-doc-name">{d.name}</span>
              <span className="sf-doc-note">{d.note}</span>
              <span className="sf-doc-tag">AT LAUNCH</span>
            </a>
          ))}
        </div>
      </section>

      {/* ═══ ACCOUNTABILITY ═══ */}
      <section className="sf-account">
        <div className="sf-account-card sf-reveal">
          <img src="/images/about/founder_vision.jpg" alt="Culture Flow founder" className="sf-account-img" />
          <div className="sf-account-body">
            <h2 className="sf-why-title sf-account-title">Who&rsquo;s accountable.</h2>
            <p className="sf-cell-text">
              Every programme has a named person responsible — not a
              department, not a helpdesk.
            </p>
            <div className="sf-account-list">
              <div className="sf-account-item">
                <span className="sf-account-num">01</span>
                <p><strong>On-Ground Chaperone.</strong> First responder. Present at every stage of the programme.</p>
              </div>
              <div className="sf-account-item">
                <span className="sf-account-num">02</span>
                <p><strong>Programme Coordinator.</strong> Named HQ contact. Reachable by guardians throughout.</p>
              </div>
              <div className="sf-account-item">
                <span className="sf-account-num">03</span>
                <p><strong>Founder-Led Oversight.</strong> Every programme is overseen at the leadership level.</p>
              </div>
            </div>
            <a href="https://wa.me/917123445690" className="sf-account-link">
              Ask a question <ArrowUpRight size={15} strokeWidth={1.8} />
            </a>
          </div>
        </div>
      </section>

      {/* ═══ CLOSING CTA ═══ */}
      <section className="sf-ask" id="ask">
        <h2 className="sf-why-title sf-reveal">Built to earn trust before the first departure.</h2>
        <p className="sf-ask-sub sf-reveal" style={{ "--sf-d": "90ms" } as React.CSSProperties}>
          Have questions about how we keep scholars safe? We&rsquo;re here to
          answer — directly.
        </p>
        <div className="sf-ask-actions sf-reveal" style={{ "--sf-d": "180ms" } as React.CSSProperties}>
          <a href="https://wa.me/917123445690" className="sf-btn-dark sf-btn-dark--lg">
            Ask a question
          </a>
          <Link href="/waitlist" className="sf-ask-mail">
            Join the waitlist
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
