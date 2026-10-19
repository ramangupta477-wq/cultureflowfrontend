"use client";

import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import Footer from "../homepage/Footer";
import "./safety.css";

const PILLARS = [
  {
    num: "01",
    title: "1:15 chaperone ratio",
    desc: "One trained chaperone for every fifteen students — on every flight, at every site, in every residence. Small enough that no one is anonymous.",
  },
  {
    num: "02",
    title: "Vetted local partners",
    desc: "Every local partner is vetted before we work with them: licences checked, references taken, sites visited. Vetting repeats before each cohort.",
  },
  {
    num: "03",
    title: "Emergency medical insurance",
    desc: "Every participant carries emergency medical insurance for the full duration of the program — arranged by us, documented before departure.",
  },
  {
    num: "04",
    title: "Parental indemnity framework",
    desc: "A plain-language written agreement that sets out responsibilities, consent and emergency authority. Parents read and sign it before any payment.",
  },
];

const PROTOCOL = [
  { num: "01", title: "Student → Chaperone", desc: "Instant contact through the always-on program WhatsApp group. Every chaperone carries a working phone at all times." },
  { num: "02", title: "Chaperone → Program Lead", desc: "The chaperone informs the Program Lead within 15 minutes of any incident, however minor." },
  { num: "03", title: "Program Lead → Parents", desc: "Parents receive a direct call — not a message — within one hour for anything health or safety related." },
  { num: "04", title: "Escalation", desc: "Local partner and insurer hotline engaged where needed. A written incident log is shared with parents within 24 hours." },
];

const DOCUMENTS = [
  { name: "Safety Policy", note: "Full document · PDF" },
  { name: "Sample Parent Consent Form", note: "The exact form parents sign · PDF" },
  { name: "Insurance Summary", note: "Cover, insurer and claims process · PDF" },
];

/* Count-up hook: animates from 0 to `to` when `active` flips true */
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

function StatItem({
  display,
  countTo,
  countSuffix = "",
  active,
  label,
  pad,
}: {
  display?: string;
  countTo?: number;
  countSuffix?: string;
  active: boolean;
  label: string;
  pad?: number;
}) {
  const v = useCountUp(countTo ?? 0, active);
  const num = countTo === undefined ? display : String(v).padStart(pad ?? 0, "0") + countSuffix;
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

  /* IntersectionObserver: add .sf-reveal--in (with stagger delay) */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const els = root.querySelectorAll(".sf-reveal");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target as HTMLElement;
          const delay = el.style.getPropertyValue("--sf-d") || "0ms";
          el.style.transitionDelay = delay;
          el.classList.add("sf-reveal--in");
          io.unobserve(el);
        });
      },
      { threshold: 0.15 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  /* Stats trigger separately so the count-up runs once visible */
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

      {/* ═══ HERO — headline left, flight-path diagram right ═══ */}
      <section className="sf-hero">
        <div className="sf-hero-grid">
          <div>
            <p className="sf-eyebrow sf-reveal">
              <span className="sf-eyebrow-dot" aria-hidden />
              SAFETY &amp; TRUST
            </p>
            <h1 className="sf-hero-title sf-reveal" style={{ "--sf-d": "80ms" } as React.CSSProperties}>
              Safety is a <em>system,</em>
              <br />
              not a promise.
            </h1>
            <p className="sf-hero-sub sf-reveal" style={{ "--sf-d": "160ms" } as React.CSSProperties}>
              Anyone can say a program is safe. We would rather show you the
              machinery behind that claim — ratios, vetting, insurance, a
              written protocol and named people who answer for all of it.
              Every statement on this page has a fact or a document behind it.
            </p>
          </div>

          {/* Line-drawn route diagram: New Delhi → London / Munich / Singapore */}
          <div className="sf-hero-map sf-reveal" style={{ "--sf-d": "300ms" } as React.CSSProperties}>
            <svg viewBox="0 0 460 320" className="sf-route-svg" aria-hidden>
              {/* world-dot backdrop */}
              <circle cx="60" cy="60" r="1.5" className="sf-dot" />
              <circle cx="420" cy="40" r="1.5" className="sf-dot" />
              <circle cx="400" cy="290" r="1.5" className="sf-dot" />
              <circle cx="30" cy="260" r="1.5" className="sf-dot" />
              <circle cx="230" cy="20" r="1.5" className="sf-dot" />
              <circle cx="440" cy="180" r="1.5" className="sf-dot" />

              {/* routes out of New Delhi */}
              <path className="sf-route" d="M230 160 C 300 120, 360 70, 402 46" />
              <path className="sf-route" d="M230 160 C 300 150, 350 130, 398 106" style={{ animationDelay: "0.25s" }} />
              <path className="sf-route" d="M230 160 C 290 200, 340 240, 392 276" style={{ animationDelay: "0.5s" }} />

              {/* origin + destination nodes */}
              <circle className="sf-node sf-node--origin" cx="230" cy="160" r="7" />
              <circle className="sf-node" cx="402" cy="46" r="5" style={{ animationDelay: "1.1s" }} />
              <circle className="sf-node" cx="398" cy="106" r="5" style={{ animationDelay: "1.35s" }} />
              <circle className="sf-node" cx="392" cy="276" r="5" style={{ animationDelay: "1.6s" }} />

              {/* labels */}
              <text x="212" y="188" className="sf-map-label">NEW DELHI</text>
              <text x="356" y="38" className="sf-map-label">LONDON</text>
              <text x="340" y="98" className="sf-map-label">MUNICH</text>
              <text x="330" y="296" className="sf-map-label">SINGAPORE</text>

              {/* centre pulse ring */}
              <circle className="sf-pulse-ring" cx="230" cy="160" r="7" />
            </svg>
          </div>
        </div>

        {/* Stat strip */}
        <div className="sf-stats" ref={statsRef}>
          <StatItem display="1:15" active={statsActive} label="CHAPERONE RATIO" />
          <StatItem display="24×7" active={statsActive} label="EMERGENCY CONTACT" />
          <StatItem countTo={100} countSuffix="%" active={statsActive} label="MEDICALLY INSURED" />
          <StatItem countTo={4} pad={2} active={statsActive} label="VETTING STEPS" />
        </div>
      </section>

      {/* ═══ FOUR PILLARS — staggered, numbers ring-drawn ═══ */}
      <section className="sf-pillars">
        <h2 className="sf-section-title sf-reveal">
          Four pillars that <em>hold it up.</em>
        </h2>
        <div className="sf-pillar-grid">
          {PILLARS.map((p, i) => (
            <article
              key={p.num}
              className="sf-pillar sf-reveal"
              style={{ "--sf-d": `${i * 120}ms` } as React.CSSProperties}
            >
              <span className="sf-pillar-badge" aria-hidden>
                <svg viewBox="0 0 64 64">
                  <circle className="sf-badge-ring" cx="32" cy="32" r="30" />
                </svg>
                <span className="sf-pillar-num">{p.num}</span>
              </span>
              <h3 className="sf-pillar-title">{p.title}</h3>
              <p className="sf-pillar-desc">{p.desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ═══ BEFORE / DURING — rope timeline with nodes ═══ */}
      <section className="sf-phases">
        <span className="sf-rope" aria-hidden>
          <span className="sf-rope-line" />
        </span>
        <div className="sf-phase sf-reveal">
          <span className="sf-phase-node" aria-hidden />
          <p className="sf-phase-eyebrow">BEFORE DEPARTURE</p>
          <h2 className="sf-phase-title">Nothing leaves to chance at the airport.</h2>
          <ul className="sf-checklist">
            <li>Parent briefing session — in person or on call, your choice</li>
            <li>Medical and emergency contact forms completed for every student</li>
            <li>Travel documents checklist signed off together, not assumed</li>
          </ul>
        </div>
        <div className="sf-phase sf-reveal" style={{ "--sf-d": "150ms" } as React.CSSProperties}>
          <span className="sf-phase-node" aria-hidden />
          <p className="sf-phase-eyebrow">DURING THE PROGRAM</p>
          <h2 className="sf-phase-title">You hear from us before you have to ask.</h2>
          <ul className="sf-checklist">
            <li>24×7 emergency contact, answered by a person — never a bot</li>
            <li>Daily check-ins with every student group</li>
            <li>Parents receive scheduled updates, so silence never means worry</li>
          </ul>
        </div>
      </section>

      {/* ═══ EMERGENCY PROTOCOL — rows draw in ═══ */}
      <section className="sf-protocol">
        <h2 className="sf-section-title sf-reveal">
          If something goes wrong, <em>here is exactly what happens.</em>
        </h2>
        <div className="sf-protocol-list">
          {PROTOCOL.map((s, i) => (
            <div
              key={s.num}
              className="sf-protocol-row sf-reveal"
              style={{ "--sf-d": `${i * 130}ms` } as React.CSSProperties}
            >
              <span className="sf-protocol-badge" aria-hidden>
                <svg viewBox="0 0 56 56">
                  <circle className="sf-badge-ring" cx="28" cy="28" r="26" />
                </svg>
                <span className="sf-protocol-num">{s.num}</span>
              </span>
              <div>
                <h3 className="sf-protocol-title">{s.title}</h3>
                <p className="sf-protocol-desc">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ DOCUMENTS ═══ */}
      <section className="sf-docs">
        <h2 className="sf-section-title sf-reveal">
          Read the paperwork <em>before</em> we ask you to sign anything.
        </h2>
        <p className="sf-docs-note sf-reveal" style={{ "--sf-d": "90ms" } as React.CSSProperties}>
          No form, no email gate — these documents are free to read.
        </p>
        <div className="sf-doc-list">
          {DOCUMENTS.map((d, i) => (
            <a
              key={d.name}
              href="#"
              className="sf-doc-row sf-reveal"
              style={{ "--sf-d": `${i * 110}ms` } as React.CSSProperties}
              onClick={(e) => e.preventDefault()}
            >
              <span className="sf-doc-name">{d.name}</span>
              <span className="sf-doc-note">{d.note}</span>
              <span className="sf-doc-tag">AT LAUNCH</span>
            </a>
          ))}
        </div>
      </section>

      {/* ═══ ACCOUNTABILITY ═══ */}
      <section className="sf-account">
        <div className="sf-account-grid">
          <img
            src="/images/about/founder_vision.jpg"
            alt="Culture Flow founder"
            className="sf-account-img sf-reveal"
          />
          <div>
            <p className="sf-phase-eyebrow sf-reveal">WHO IS ACCOUNTABLE</p>
            <h2 className="sf-section-title sf-account-title sf-reveal" style={{ "--sf-d": "90ms" } as React.CSSProperties}>
              A named person, <em>not a support inbox.</em>
            </h2>
            <p className="sf-account-copy sf-reveal" style={{ "--sf-d": "180ms" } as React.CSSProperties}>
              Afjal Hussein — Founder &amp; Program Lead. The same person who
              designs the pathway answers your safety questions. Program
              operations run under Culture Flow Education Pvt. Ltd.,
              Connaught Place, New Delhi 110001.
            </p>
            <Link href="/about-us" className="sf-account-link sf-reveal" style={{ "--sf-d": "260ms" } as React.CSSProperties}>
              Meet the team →
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ ASK US ANYTHING ═══ */}
      <section className="sf-ask">
        <h2 className="sf-section-title sf-reveal">Ask us anything.</h2>
        <p className="sf-ask-sub sf-reveal" style={{ "--sf-d": "90ms" } as React.CSSProperties}>
          Direct questions from parents get direct answers — usually within
          the hour.
        </p>
        <div className="sf-ask-actions sf-reveal" style={{ "--sf-d": "180ms" } as React.CSSProperties}>
          <a href="https://wa.me/917123445690" className="sf-ask-pill sf-ask-pill--solid">
            WhatsApp us <span aria-hidden>→</span>
          </a>
          <a href="mailto:hello@cultureflow.co.in" className="sf-ask-pill">
            hello@cultureflow.co.in
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
