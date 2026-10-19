"use client";

import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  GraduationCap,
  Plane,
  HeartHandshake,
  ArrowUpRight,
  MapPin,
  FileCheck,
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
  { id: "q", label: "EARLY '26", title: "The Question", desc: "Why does studying abroad still run on guesswork, hidden fees and agents who sell files, not futures?" },
  { id: "bp", label: "SPRING '26", title: "The Blueprint", desc: "A model drawn on one page: 40% academics, 40% industry immersion, 20% reflection — and safety as a system, not a slogan." },
  { id: "build", label: "SUMMER '26", title: "The Build", desc: "Universities, vetted local partners and insurance frameworks locked in across London, Munich and Singapore." },
  { id: "launch", label: "OCT '26", title: "The Launch", desc: "Culture Flow goes live from Connaught Place, New Delhi — one step from application to arrival." },
  { id: "next", label: "NEXT", title: "Your Chapter", desc: "The first cohorts board soon. This timeline keeps writing itself — with scholars' names in it." },
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

  /* ─── Timeline progress ─── */
  const timelineRef = useRef<HTMLDivElement>(null);
  const [tlProgress, setTlProgress] = useState(0);
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
  const activeIdx = tlProgress <= 0 ? 0 : Math.min(HISTORY.length - 1, Math.floor(tlProgress * HISTORY.length));

  return (
    <div className="au-page" ref={rootRef}>

      {/* ═══ HERO — centered highlight headline + floating chips + bento row ═══ */}
      <section className="au-hero">
        <span className="au-chip au-chip--tl" aria-hidden><ShieldCheck size={17} strokeWidth={1.7} /></span>
        <span className="au-chip au-chip--tr" aria-hidden><Plane size={17} strokeWidth={1.7} /></span>
        <span className="au-chip au-chip--bl" aria-hidden><GraduationCap size={17} strokeWidth={1.7} /></span>
        <span className="au-chip au-chip--br" aria-hidden><HeartHandshake size={17} strokeWidth={1.7} /></span>

        <h1 className="au-hero-title au-reveal">
          The people behind{" "}
          <span className="au-mark">every</span> departure
        </h1>

        <div className="au-hero-row">
          <p className="au-hero-sub au-reveal">
            A study-abroad company founded in New Delhi in October 2026 —
            built to turn a semester away into the sharpest step of a career.
          </p>
          <Link href="/programs" className="au-btn-pillau au-reveal" style={{ "--au-d": "90ms" } as React.CSSProperties}>
            Explore programs <ArrowUpRight size={15} strokeWidth={1.9} />
          </Link>
        </div>

        {/* hero bento row */}
        <div className="au-hero-bento">
          <Reveal className="au-hcell au-hcell--photo" style={{ "--au-d": "60ms" } as React.CSSProperties}>
            <img src="/images/about/counseling.jpg" alt="Culture Flow counselor with a student" className="au-hcell-img" />
            <span className="au-hcell-label">Counseling, not selling</span>
          </Reveal>

          <Reveal className="au-hcell au-hcell--founded" style={{ "--au-d": "140ms" } as React.CSSProperties}>
            <span className="au-fcell-kicker">FOUNDED</span>
            <span className="au-fcell-big">Oct&nbsp;2026</span>
            <span className="au-fcell-sub">Connaught Place, New Delhi</span>
            <MapPin size={18} strokeWidth={1.7} className="au-fcell-ico" aria-hidden />
          </Reveal>

          <Reveal className="au-hcell au-hcell--mission" style={{ "--au-d": "220ms" } as React.CSSProperties}>
            <p>
              We move <em>scholars</em>, not files — one platform for programs,
              credit transfer, visas and a safe landing, run by people who
              answer the phone themselves.
            </p>
            <Link href="/waitlist" className="au-mini-cta">
              Join the waitlist <ArrowUpRight size={14} strokeWidth={1.9} />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ═══ MARQUEE TICKER ═══ */}
      <div className="au-ticker" aria-hidden>
        <div className="au-ticker-track">
          {Array.from({ length: 2 }).map((_, dup) => (
            <span className="au-ticker-run" key={dup}>
              {["CULTURE FLOW", "ONE STEP. NEW FUTURE.", "EST. OCT 2026", "NEW DELHI — LONDON — MUNICH — SINGAPORE"].map((t) => (
                <span key={`${dup}-${t}`} className="au-ticker-item">{t} <i>✦</i></span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* ═══ STORY SPLIT ═══ */}
      <section className="au-story">
        <p className="au-story-note au-reveal">
          The Culture Flow story is short and still being written — but the
          conviction behind it was settled on day one: studying abroad should
          be a dignified, life-defining milestone, never an anxiety-ridden
          maze of agents.
        </p>
        <div>
          <h2 className="au-story-title au-reveal" style={{ "--au-d": "80ms" } as React.CSSProperties}>
            We move scholars, <em>not files.</em>
          </h2>
          <div className="au-story-ctas au-reveal" style={{ "--au-d": "160ms" } as React.CSSProperties}>
            <a href="#timeline" className="au-story-cta au-story-cta--solid">Read our timeline</a>
            <Link href="/safety" className="au-story-cta">How we keep you safe</Link>
          </div>
        </div>
      </section>

      {/* ═══ TIMELINE ═══ */}
      <section className="au-sect" id="timeline" ref={timelineRef}>
        <span className="au-sect-pill au-reveal" style={{ "--au-d": "0ms" } as React.CSSProperties}>Our story</span>
        <h2 className="au-sect-title au-reveal" style={{ "--au-d": "80ms" } as React.CSSProperties}>
          Five phases. <em>One conviction.</em>
        </h2>
        <div className="au-tl-line">
          <span className="au-tl-fill" style={{ transform: `scaleX(${tlProgress})` }} />
        </div>
        <div className="au-tl-nodes">
          {HISTORY.map((n, i) => (
            <div key={n.id} className={`au-tl-node ${i <= activeIdx ? "au-tl-node--on" : ""}`}>
              <span className="au-tl-dot" />
              <span className="au-tl-year">{n.label}</span>
            </div>
          ))}
        </div>
        <div className="au-tl-detail au-reveal">
          <h3>{HISTORY[activeIdx].title}</h3>
          <p>{HISTORY[activeIdx].desc}</p>
        </div>
      </section>

      {/* ═══ MOSAIC BENTO ═══ */}
      <section className="au-sect">
        <span className="au-sect-pill au-reveal">By the numbers</span>
        <h2 className="au-sect-title au-reveal" style={{ "--au-d": "80ms" } as React.CSSProperties}>
          What we&rsquo;ve built. <em>What&rsquo;s coming.</em>
        </h2>

        <div className="au-mosaic">
          {/* yellow pathways cell */}
          <Reveal className="au-mcell au-mcell--yellow" style={{ "--au-d": "0ms" } as React.CSSProperties}>
            <div className="au-tags">
              <span className="au-tag au-tag--dark">Tech &amp; Innovation</span>
              <span className="au-tag">Sustainability</span>
              <span className="au-tag">Cultural</span>
            </div>
            <div className="au-mcell-foot">
              <span className="au-mbig">Pathways</span>
              <span className="au-arrow-sq" aria-hidden><ArrowUpRight size={26} strokeWidth={2} /></span>
            </div>
          </Reveal>

          {/* dotted pattern cell */}
          <Reveal className="au-mcell au-mcell--dots" style={{ "--au-d": "80ms" } as React.CSSProperties}>
            <p>A global classroom, one semester at a time.</p>
          </Reveal>

          {/* stats stacked */}
          <Reveal className="au-mcell au-mcell--stat" style={{ "--au-d": "160ms" } as React.CSSProperties}>
            <span className="au-stat-num"><CountUp to={52000} />+</span>
            <span className="au-stat-cap">scholars mobilized</span>
          </Reveal>
          <Reveal className="au-mcell au-mcell--stat au-mcell--stat-b" style={{ "--au-d": "240ms" } as React.CSSProperties}>
            <span className="au-stat-num"><CountUp to={200} />+</span>
            <span className="au-stat-cap">partner institutions</span>
          </Reveal>

          {/* founder photo */}
          <Reveal className="au-mcell au-mcell--photo" style={{ "--au-d": "120ms" } as React.CSSProperties}>
            <img src="/images/about/founder_vision.jpg" alt="Culture Flow founder" className="au-mcell-img" />
            <span className="au-hcell-label">Founder-led, always</span>
          </Reveal>

          {/* beliefs cell */}
          <Reveal className="au-mcell au-mcell--belief" style={{ "--au-d": "200ms" } as React.CSSProperties}>
            <h3>What we believe</h3>
            <ul>
              <li><FileCheck size={15} strokeWidth={1.7} /> 40% academic rigor, 40% immersion, 20% reflection</li>
              <li><ShieldCheck size={15} strokeWidth={1.7} /> Safety is a system — ratios, vetting, insurance</li>
              <li><HeartHandshake size={15} strokeWidth={1.7} /> Reflection turns experience into outcomes</li>
            </ul>
          </Reveal>

          {/* wide stat */}
          <Reveal className="au-mcell au-mcell--wide au-mcell--cream" style={{ "--au-d": "280ms" } as React.CSSProperties}>
            <span className="au-stat-num"><CountUp to={99.4} decimals={1} suffix="%" /></span>
            <span className="au-stat-cap">visa &amp; admissions success</span>
            <Link href="/safety" className="au-mini-cta">
              Safety &amp; Trust <ArrowUpRight size={14} strokeWidth={1.9} />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ═══ OFFICES + CTA ═══ */}
      <section className="au-sect au-sect--last">
        <span className="au-sect-pill au-reveal">Where to find us</span>
        <div className="au-offices-grid">
          <div className="au-mcell au-mcell--cream au-offices au-reveal">
            {["New Delhi — Head Office", "Mumbai — Regional Delivery", "London — Liaison Desk", "Berlin — Liaison Desk"].map((o) => (
              <div key={o} className="au-office-row">
                <span>{o}</span>
                <ArrowUpRight size={15} strokeWidth={1.8} aria-hidden />
              </div>
            ))}
          </div>
          <div className="au-offices-copy au-reveal" style={{ "--au-d": "100ms" } as React.CSSProperties}>
            <h2 className="au-sect-title">Ready to take <em>your global step?</em></h2>
            <p className="au-story-note" style={{ margin: 0 }}>
              Join the waitlist to hear about the first cohorts before anyone
              else — or just ask us anything, a human answers.
            </p>
            <div className="au-story-ctas">
              <Link href="/waitlist" className="au-story-cta au-story-cta--solid">Join Waitlist</Link>
              <Link href="/programs" className="au-story-cta">Explore Programs</Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
