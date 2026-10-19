"use client";

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

export default function SafetyPage() {
  return (
    <div className="safety-page">
      {/* ═══ HERO ═══ */}
      <section className="sf-hero">
        <div className="sf-hero-inner">
          <p className="sf-eyebrow">
            <span className="sf-eyebrow-dot" aria-hidden />
            SAFETY &amp; TRUST
          </p>
          <h1 className="sf-hero-title">
            Safety is a <em>system,</em>
            <br />
            not a promise.
          </h1>
          <p className="sf-hero-sub">
            Anyone can say a program is safe. We would rather show you the
            machinery behind that claim — ratios, vetting, insurance, a
            written protocol and named people who answer for all of it.
            Every statement on this page has a fact or a document behind it.
          </p>
        </div>

        {/* Stat strip */}
        <div className="sf-stats">
          <div className="sf-stat">
            <span className="sf-stat-num">1:15</span>
            <span className="sf-stat-label">CHAPERONE RATIO</span>
          </div>
          <div className="sf-stat">
            <span className="sf-stat-num">24×7</span>
            <span className="sf-stat-label">EMERGENCY CONTACT</span>
          </div>
          <div className="sf-stat">
            <span className="sf-stat-num">100%</span>
            <span className="sf-stat-label">MEDICALLY INSURED</span>
          </div>
          <div className="sf-stat">
            <span className="sf-stat-num">04</span>
            <span className="sf-stat-label">VETTING STEPS</span>
          </div>
        </div>
      </section>

      {/* ═══ FOUR PILLARS ═══ */}
      <section className="sf-pillars">
        <h2 className="sf-section-title">
          Four pillars that <em>hold it up.</em>
        </h2>
        <div className="sf-pillar-grid">
          {PILLARS.map((p) => (
            <article key={p.num} className="sf-pillar">
              <span className="sf-pillar-num">{p.num}</span>
              <h3 className="sf-pillar-title">{p.title}</h3>
              <p className="sf-pillar-desc">{p.desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ═══ BEFORE / DURING ═══ */}
      <section className="sf-phases">
        <div className="sf-phase">
          <p className="sf-phase-eyebrow">BEFORE DEPARTURE</p>
          <h2 className="sf-phase-title">Nothing leaves to chance at the airport.</h2>
          <ul className="sf-checklist">
            <li>Parent briefing session — in person or on call, your choice</li>
            <li>Medical and emergency contact forms completed for every student</li>
            <li>Travel documents checklist signed off together, not assumed</li>
          </ul>
        </div>
        <div className="sf-phase">
          <p className="sf-phase-eyebrow">DURING THE PROGRAM</p>
          <h2 className="sf-phase-title">You hear from us before you have to ask.</h2>
          <ul className="sf-checklist">
            <li>24×7 emergency contact, answered by a person — never a bot</li>
            <li>Daily check-ins with every student group</li>
            <li>Parents receive scheduled updates, so silence never means worry</li>
          </ul>
        </div>
      </section>

      {/* ═══ EMERGENCY PROTOCOL ═══ */}
      <section className="sf-protocol">
        <h2 className="sf-section-title">
          If something goes wrong, <em>here is exactly what happens.</em>
        </h2>
        <div className="sf-protocol-list">
          {PROTOCOL.map((s) => (
            <div key={s.num} className="sf-protocol-row">
              <span className="sf-protocol-num">{s.num}</span>
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
        <h2 className="sf-section-title">
          Read the paperwork <em>before</em> we ask you to sign anything.
        </h2>
        <p className="sf-docs-note">
          No form, no email gate — these documents are free to read.
        </p>
        <div className="sf-doc-list">
          {DOCUMENTS.map((d) => (
            <a key={d.name} href="#" className="sf-doc-row" onClick={(e) => e.preventDefault()}>
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
            className="sf-account-img"
          />
          <div>
            <p className="sf-phase-eyebrow">WHO IS ACCOUNTABLE</p>
            <h2 className="sf-section-title sf-account-title">
              A named person, <em>not a support inbox.</em>
            </h2>
            <p className="sf-account-copy">
              Afjal Hussein — Founder &amp; Program Lead. The same person who
              designs the pathway answers your safety questions. Program
              operations run under Culture Flow Education Pvt. Ltd.,
              Connaught Place, New Delhi 110001.
            </p>
            <Link href="/about-us" className="sf-account-link">
              Meet the team →
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ ASK US ANYTHING ═══ */}
      <section className="sf-ask">
        <h2 className="sf-section-title">Ask us anything.</h2>
        <p className="sf-ask-sub">
          Direct questions from parents get direct answers — usually within
          the hour.
        </p>
        <div className="sf-ask-actions">
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
