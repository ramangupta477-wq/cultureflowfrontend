"use client";
//  nice

import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  ArrowRight,
  ArrowDown,
  MapPin,
  FileCheck,
  ShieldCheck,
  HeartHandshake,
} from "lucide-react";
import Footer from "../homepage/Footer";
import "./AboutUs.css";

interface HistoryNode {
  id: string;
  label: string;
  title: string;
  desc: string;
}

const HISTORY: HistoryNode[] = [
  { id: "early-26", label: "EARLY '26", title: "The Idea", desc: "Curriculum-first. Structured. Accessible." },
  { id: "spring-26", label: "SPRING '26", title: "The Model", desc: "40/40/20. Three tracks. One framework." },
  { id: "summer-26", label: "SUMMER '26", title: "The Team", desc: "Built the brand. Built the team. Built the systems." },
  { id: "oct-26", label: "OCT '26", title: "The Company", desc: "Incorporated. New Delhi. October 2026." },
  { id: "next", label: "NEXT", title: "You", desc: "January 2027. First cohort. Your move." },
];

function Reveal({ children, className = "", style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`au-reveal ${className}`} style={style}>
      {children}
    </div>
  );
}

function CountUp({ to, decimals = 0, suffix = "" }: { to: number; decimals?: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [started, setStarted] = useState(false);
  const [val, setVal] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => entries.some((e) => e.isIntersecting) && (setStarted(true), io.disconnect()),
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    let raf = 0;
    const t0 = performance.now();
    const dur = 1600;
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(to * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
      else setVal(to);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [started, to]);

  const text = decimals > 0 ? val.toFixed(decimals) : Math.round(val).toLocaleString("en-US");
  return <span ref={ref} suppressHydrationWarning>{text}{suffix}</span>;
}

export default function AboutUsPage() {
  /* ─── Reveal on scroll ─── */
  const rootRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const els = root.querySelectorAll(".au-reveal");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target as HTMLElement;
          el.style.transitionDelay = el.style.getPropertyValue("--au-d") || "0ms";
          el.classList.add("au-reveal--in");
          io.unobserve(el);
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  /* ─── Timeline progress & hover ─── */
  const timelineRef = useRef<HTMLDivElement>(null);
  const [tlProgress, setTlProgress] = useState(0);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  useEffect(() => {
    const el = timelineRef.current;
    if (!el) return;
    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = (vh * 0.7 - rect.top) / (rect.height - vh * 0.4);
      setTlProgress(Math.min(1, Math.max(0, p)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const scrollIdx = tlProgress <= 0 ? 0 : Math.min(HISTORY.length - 1, Math.floor(tlProgress * HISTORY.length));
  const activeIdx = hoveredIdx !== null ? hoveredIdx : scrollIdx;
  const lineProgress = hoveredIdx !== null ? hoveredIdx / (HISTORY.length - 1) : tlProgress;

  return (
    <div className="au-page" ref={rootRef}>

      {/* ═══ HERO — centered highlight headline + floating chips + bento row ═══ */}
      <section className="au-hero">

        <h1 className="au-hero-title au-reveal">
          The Story Behind the <br />
          <em>Mission</em>
        </h1>

        <div className="au-hero-sub au-reveal">
          <p>
            We started with one conviction: every ambitious scholar in India deserves access to genuine international academic exposure — structured, rigorous, and within reach. Not someday. Not after years of saving.
          </p>
          <p className="au-hero-sub-now">Now.</p>
          <p>
            That conviction became Culture Flow — a platform built from the ground up to design, deliver, and manage structured short-term academic immersions at global partner institutions. Every programme is engineered around the 40/40/20 curriculum framework, executed end-to-end, and built to transform how scholars think, lead, and see the world.
          </p>
        </div>

        {/* hero bento row */}
        <div className="au-hero-bento">
          <Reveal className="au-hcell au-hcell--building" style={{ "--au-d": "60ms" } as React.CSSProperties}>
            <span className="au-fcell-kicker">WHAT WE&rsquo;RE BUILDING</span>
            <p>
              A future where every ambitious scholar in India has access to the global academic experience that shapes how they think, lead, and see the world. Where structured international immersion is the expectation, not the exception — and where the quality of that experience is never compromised by the logistics of making it happen.
            </p>
            <a href="#timeline" className="au-mini-cta">
              Read Our Timeline <ArrowDown size={14} strokeWidth={2} />
            </a>
          </Reveal>

          <Reveal className="au-hcell au-hcell--founded" style={{ "--au-d": "140ms" } as React.CSSProperties}>
            <span className="au-fcell-kicker">FOUNDED</span>
            <span className="au-fcell-big">Oct&nbsp;2026</span>
            <span className="au-fcell-sub">East Delhi, New Delhi</span>
            <MapPin size={18} strokeWidth={1.7} className="au-fcell-ico" aria-hidden />
          </Reveal>

          <Reveal className="au-hcell au-hcell--mission" style={{ "--au-d": "220ms" } as React.CSSProperties}>
            <span className="au-fcell-kicker">WHAT SETS US APART</span>
            <p>
              Every detail is intentional. Culture Flow is built from the ground up — a purpose-built curriculum framework driving every programme, structured short-term academic immersions with institutional rigour at the core, partner institutions selected for academic depth rather than convenience, and safety infrastructure that treats scholar wellbeing as architecture, not afterthought.
            </p>
            <Link href="/waitlist" className="au-mini-cta">
              Join the Waitlist <ArrowRight size={14} strokeWidth={2} />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ═══ MARQUEE TICKER ═══ */}
      <div className="au-ticker" aria-hidden>
        <div className="au-ticker-track">
          {Array.from({ length: 2 }).map((_, dup) => (
            <span className="au-ticker-run" key={dup}>
              {Array.from({ length: 4 })
                .flatMap(() => ["ONE STEP. NEW FUTURE.", "NEW DELHI", "CULTURE FLOW"])
                .map((t, idx) => (
                  <span key={`${dup}-${idx}`} className="au-ticker-item">
                    {t} <i>✦</i>
                  </span>
                ))}
            </span>
          ))}
        </div>
      </div>

      {/* ═══ STORY SPLIT ═══ */}
      <section className="au-story">
        <p className="au-story-note au-reveal">
          Culture Flow was built around one principle: the scholar comes first. One platform for structured academic immersions, institutional-grade safety, and end-to-end programme execution — designed, managed, and delivered by people who answer the phone themselves.
        </p>
        <div>
          <h2 className="au-story-title au-reveal" style={{ "--au-d": "80ms" } as React.CSSProperties}>
            We move scholars, <br />
            <em>not files.</em>
          </h2>
        </div>
      </section>

      {/* ═══ TIMELINE ═══ */}
      <section className="au-sect" id="timeline" ref={timelineRef}>
        <h2 className="au-sect-title au-reveal" style={{ "--au-d": "80ms" } as React.CSSProperties}>
          How we <em>got here.</em>
        </h2>
        <div className="au-tl-line">
          <span className="au-tl-fill" style={{ transform: `scaleX(${lineProgress})` }} />
        </div>
        <div className="au-tl-nodes">
          {HISTORY.map((n, i) => (
            <div
              key={n.id}
              className={`au-tl-node ${i <= activeIdx ? "au-tl-node--on" : ""} ${i === activeIdx ? "au-tl-node--active" : ""}`}
              onMouseEnter={() => setHoveredIdx(i)}
              onClick={() => setHoveredIdx(i)}
              role="button"
              tabIndex={0}
              aria-label={`${n.label} — ${n.title}`}
            >
              <span className="au-tl-dot" />
              <span className="au-tl-year">{n.label}</span>
              <span className="au-tl-node-title">{n.title}</span>
            </div>
          ))}
        </div>
        <div className="au-tl-detail">
          <h3>
            <span className="au-tl-detail-prefix">{HISTORY[activeIdx].label} — </span>
            {HISTORY[activeIdx].title}
          </h3>
          <p>&ldquo;{HISTORY[activeIdx].desc}&rdquo;</p>
        </div>
      </section>

      {/* ═══ MOSAIC BENTO ═══ */}
      <section className="au-sect">
        <h2 className="au-sect-title au-reveal" style={{ "--au-d": "80ms" } as React.CSSProperties}>
          What we&rsquo;ve built. <em>What&rsquo;s coming.</em>
        </h2>

        <div className="au-mosaic">
          {/* Top-Left: Yellow Tracks Card (Span 2 rows) */}
          <Reveal className="au-mcell au-mcell--yellow" style={{ "--au-d": "0ms" } as React.CSSProperties}>
            <div className="au-tags">
              <span className="au-tag au-tag--dark">Tech &amp; Innovation</span>
              <span className="au-tag">Sustainability &amp; Impact</span>
              <span className="au-tag">Heritage &amp; Culture</span>
            </div>
            <Link href="/programs" className="au-mcell-foot">
              <span className="au-mbig">3 Immersion Tracks</span>
              <span className="au-arrow-sq" aria-hidden><ArrowRight size={22} strokeWidth={2} /></span>
            </Link>
          </Reveal>

          {/* Top-Center: Dotted Pattern Card */}
          <Reveal className="au-mcell au-mcell--dots" style={{ "--au-d": "60ms" } as React.CSSProperties}>
            <p>Structured international academic exposure — rigorous, safe, and within reach.</p>
          </Reveal>

          {/* Top-Right: Stat Card (40 / 40 / 20) */}
          <Reveal className="au-mcell au-mcell--stat au-mcell--top-right" style={{ "--au-d": "100ms" } as React.CSSProperties}>
            <span className="au-stat-num au-stat-num--compact">40 / 40 / 20</span>
            <span className="au-stat-cap">the curriculum framework</span>
          </Reveal>

          {/* Mid-Center: Stat Card (Jan 2027) */}
          <Reveal className="au-mcell au-mcell--stat au-mcell--stat-b au-mcell--mid-center" style={{ "--au-d": "140ms" } as React.CSSProperties}>
            <span className="au-stat-num">Jan 2027</span>
            <span className="au-stat-cap">inaugural cohort</span>
          </Reveal>

          {/* Mid-Right: Text Card (Founder-led, always — Span 2 rows) */}
          <Reveal className="au-mcell au-mcell--founder" style={{ "--au-d": "120ms" } as React.CSSProperties}>
            <div className="au-founder-badge-wrap">
              <span className="au-tag au-tag--dark">Founder-led, always</span>
            </div>
            <p className="au-founder-quote">
              Every programme is designed, managed, and delivered in-house. No outsourced operations. No middlemen. One team, end-to-end.
            </p>
          </Reveal>

          {/* Bottom-Left: Beliefs Card */}
          <Reveal className="au-mcell au-mcell--belief" style={{ "--au-d": "180ms" } as React.CSSProperties}>
            <h3>What we believe</h3>
            <ul>
              <li>
                <FileCheck size={16} strokeWidth={1.8} className="au-bicon" aria-hidden />
                <span>40% academic rigour, 40% immersion, 20% reflection</span>
              </li>
              <li>
                <ShieldCheck size={16} strokeWidth={1.8} className="au-bicon" aria-hidden />
                <span>Safety is a system — ratios, vetting, insurance</span>
              </li>
              <li>
                <HeartHandshake size={16} strokeWidth={1.8} className="au-bicon" aria-hidden />
                <span>Reflection turns experience into outcomes</span>
              </li>
            </ul>
          </Reveal>

          {/* Bottom-Center: 24/7 Stat Card */}
          <Reveal className="au-mcell au-mcell--wide au-mcell--cream" style={{ "--au-d": "220ms" } as React.CSSProperties}>
            <span className="au-stat-num">24/7</span>
            <span className="au-stat-cap">on-ground support</span>
            <Link href="/safety" className="au-mini-cta">
              Safety &amp; Trust <ArrowRight size={14} strokeWidth={2.2} />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ═══ CONTACT + FINAL CTA ═══ */}
      <section className="au-sect au-sect--last">
        <div className="au-offices-grid">
          {/* Left: Contact Card */}
          <div className="au-mcell au-mcell--cream au-contact-card au-reveal">
            <div className="au-contact-top">
              <span className="au-tag au-tag--dark">Reach us</span>
            </div>
            <div className="au-contact-details">
              <a href="mailto:info@cultureflow.in" className="au-contact-email">
                info@cultureflow.in
              </a>
              <div className="au-contact-loc">
                <MapPin size={17} strokeWidth={1.8} aria-hidden />
                <span>East Delhi, New Delhi</span>
              </div>
            </div>
          </div>

          {/* Right: Final CTA copy */}
          <div className="au-offices-copy au-reveal" style={{ "--au-d": "100ms" } as React.CSSProperties}>
            <h2 className="au-sect-title">
              The first cohort <br />
              <em>is almost here.</em>
            </h2>
            <p className="au-story-note">
              Join the waitlist for priority access to the inaugural January 2027 cohort &mdash; or explore our programmes to find your track.
            </p>
            <div className="au-story-ctas">
              <Link href="/waitlist" className="au-story-cta au-story-cta--solid">Join the Waitlist</Link>
              <Link href="/programs" className="au-story-cta">Explore Programmes</Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
