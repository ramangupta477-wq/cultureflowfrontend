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
} from "lucide-react";
import Footer from "../homepage/Footer";
import "./safety.css";

const PILLARS = [
  {
    num: "01",
    title: "1:15 chaperone ratio",
    desc: "One trained chaperone for every fifteen students — on every flight, at every site, in every residence.",
  },
  {
    num: "02",
    title: "Vetted local partners",
    desc: "Licences checked, references taken, sites visited — and the vetting repeats before every cohort.",
  },
  {
    num: "03",
    title: "Emergency medical insurance",
    desc: "Every participant is insured for the full duration of the program, arranged and documented by us.",
  },
  {
    num: "04",
    title: "Parental indemnity framework",
    desc: "A plain-language written agreement covering responsibilities, consent and emergency authority.",
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

      {/* ═══ WHITE MEGA-CARD: about pill + headline + bento row + stats ═══ */}
      <section className="sf-card sf-card--hero">
        <div className="sf-card-head">
          <span className="sf-pill sf-reveal">Safety &amp; Trust</span>
          <h1 className="sf-hero-title sf-reveal" style={{ "--sf-d": "80ms" } as React.CSSProperties}>
            From day one, every program has run on one belief —
            <span className="sf-hero-strong"> safety is a system, </span>
            <span className="sf-hero-dim">not a promise whispered at the airport.</span>
          </h1>
        </div>

        {/* Bento row */}
        <div className="sf-bento">
          {/* A — system card */}
          <div className="sf-cell sf-cell--info sf-reveal" style={{ "--sf-d": "100ms" } as React.CSSProperties}>
            <span className="sf-cell-icon" aria-hidden><ShieldCheck size={22} strokeWidth={1.6} /></span>
            <p className="sf-cell-text">
              Ratios, vetting, insurance and a written protocol — every claim
              on this page has a fact or a document behind it.
            </p>
            <div className="sf-micro">
              <span className="sf-micro-item"><Clock size={14} strokeWidth={1.7} /> 1:15 chaperone</span>
              <span className="sf-micro-item"><Phone size={14} strokeWidth={1.7} /> 24×7 hotline</span>
              <span className="sf-micro-item"><ShieldCheck size={14} strokeWidth={1.7} /> 100% insured</span>
            </div>
            <div className="sf-cell-cta">
              <a href="#ask" className="sf-btn-dark">Ask a question</a>
              <a href="#ask" className="sf-btn-round" aria-label="Ask a question">
                <ArrowUpRight size={16} strokeWidth={1.8} />
              </a>
            </div>
          </div>

          {/* B — photo card */}
          <div className="sf-cell sf-cell--photo sf-reveal" style={{ "--sf-d": "200ms" } as React.CSSProperties}>
            <img src="/images/about/counseling.jpg" alt="Culture Flow counselor with a student" className="sf-cell-img" />
            <span className="sf-cell-photo-label">Program care, day one</span>
          </div>

          {/* C — collage card */}
          <div className="sf-cell sf-cell--collage sf-reveal" style={{ "--sf-d": "300ms" } as React.CSSProperties}>
            <div className="sf-collage" aria-hidden>
              <img src="/images/about/campus.jpg" alt="" className="sf-pola sf-pola--1" />
              <img src="/images/about/partnership.jpg" alt="" className="sf-pola sf-pola--2" />
              <img src="/images/about/editorial.jpg" alt="" className="sf-pola sf-pola--3" />
            </div>
            <p className="sf-cell-text">
              Moments from programs that ran under full supervision — every
              stop chaperoned, every evening accounted for.
            </p>
          </div>
        </div>

        {/* Stats strip */}
        <div className="sf-stats" ref={statsRef}>
          <Stat display="1:15" active={statsActive} label="chaperone ratio" />
          <Stat display="24×7" active={statsActive} label="emergency line" />
          <Stat countTo={100} suffix="%" active={statsActive} label="medically insured" />
          <Stat countTo={15} suffix=" min" active={statsActive} label="incident response start" />
        </div>
      </section>

      {/* ═══ WHY PARENTS CHOOSE US — bento with map, stacked cards, tall photo ═══ */}
      <section className="sf-why">
        <div className="sf-why-head">
          <span className="sf-pill sf-reveal">Why it&rsquo;s safe</span>
          <div className="sf-why-title-row">
            <h2 className="sf-why-title sf-reveal" style={{ "--sf-d": "80ms" } as React.CSSProperties}>
              Why parents<br />choose us
            </h2>
            <p className="sf-why-sub sf-reveal" style={{ "--sf-d": "160ms" } as React.CSSProperties}>
              Every departure is built on supervision you can verify and people
              you can name.
            </p>
          </div>
        </div>

        <div className="sf-why-grid">
          {/* dotted map card */}
          <div className="sf-cell sf-cell--map sf-reveal">
            <img src="/homepage_assets/world.svg" alt="" className="sf-world" aria-hidden />
            <div>
              <h3 className="sf-cell-title">Local expertise</h3>
              <p className="sf-cell-text">
                On-ground teams in New Delhi, London, Munich and Singapore —
                people who know the campuses, clinics and consulates.
              </p>
            </div>
          </div>

          {/* stacked cards */}
          <div className="sf-why-stack">
            <div className="sf-cell sf-cell--stack sf-reveal" style={{ "--sf-d": "100ms" } as React.CSSProperties}>
              <h3 className="sf-cell-title">Vetted local partners</h3>
              <p className="sf-cell-text">
                Licensed, referenced and site-visited before anyone signs with us.
              </p>
            </div>
            <div className="sf-cell sf-cell--stack sf-reveal" style={{ "--sf-d": "180ms" } as React.CSSProperties}>
              <h3 className="sf-cell-title">Named accountability</h3>
              <div className="sf-avatars" aria-hidden>
                <span className="sf-avatar sf-avatar--1">AH</span>
                <span className="sf-avatar sf-avatar--2">RS</span>
                <span className="sf-avatar sf-avatar--3">MJ</span>
              </div>
              <p className="sf-cell-text">
                A founder and program lead who answer parent calls themselves.
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
      <section className="sf-protocol">
        <div className="sf-why-head">
          <span className="sf-pill sf-reveal">If something goes wrong</span>
          <h2 className="sf-why-title sf-reveal" style={{ "--sf-d": "80ms" } as React.CSSProperties}>
            Here is exactly<br />what happens
          </h2>
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
          <span className="sf-pill sf-reveal">Documents</span>
          <p className="sf-docs-note sf-reveal" style={{ "--sf-d": "80ms" } as React.CSSProperties}>
            No form, no email gate — read the paperwork before we ask you to
            sign anything.
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
            <span className="sf-pill">Who is accountable</span>
            <h2 className="sf-why-title sf-account-title">A named person,<br />not a support inbox.</h2>
            <p className="sf-cell-text">
              Afjal Hussein — Founder &amp; Program Lead. The same person who
              designs the pathway answers your safety questions. Program
              operations run under Culture Flow Education Pvt. Ltd.,
              Connaught Place, New Delhi 110001.
            </p>
            <Link href="/about-us" className="sf-account-link">
              Meet the team <ArrowUpRight size={15} strokeWidth={1.8} />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ ASK US ANYTHING ═══ */}
      <section className="sf-ask" id="ask">
        <h2 className="sf-why-title sf-reveal">Ask us anything.</h2>
        <p className="sf-ask-sub sf-reveal" style={{ "--sf-d": "90ms" } as React.CSSProperties}>
          Direct questions from parents get direct answers — usually within the hour.
        </p>
        <div className="sf-ask-actions sf-reveal" style={{ "--sf-d": "180ms" } as React.CSSProperties}>
          <a href="https://wa.me/917123445690" className="sf-btn-dark sf-btn-dark--lg">
            WhatsApp us
          </a>
          <a href="mailto:hello@cultureflow.co.in" className="sf-ask-mail">
            hello@cultureflow.co.in
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
