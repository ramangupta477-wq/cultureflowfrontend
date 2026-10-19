"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/app/homepage/Footer";
import "./AboutUs.css";

/* ─── Founding story (feeds the horizontal gold line) ─── */
const HISTORY = [
  {
    year: "EARLY '26",
    title: "The Question",
    desc: "Why should studying abroad be an anxiety-ridden maze of agents and hidden fees? Culture Flow starts with that one question.",
  },
  {
    year: "SPRING '26",
    title: "The Blueprint",
    desc: "The mobility framework takes shape — profiling, matching, housing, visa, orientation. One pipeline, end to end.",
  },
  {
    year: "SUMMER '26",
    title: "The Build",
    desc: "Every pathway curated with universities and advisors. Nothing hidden, nothing transactional.",
  },
  {
    year: "OCT '26",
    title: "The Launch",
    desc: "Culture Flow goes live from New Delhi — admissions bridge, credit transfer, relocation care.",
  },
  {
    year: "NEXT",
    title: "Your Chapter",
    desc: "First cohorts are forming now. The story continues with every scholar who takes one global step.",
  },
];

/* ─── Value pillars (cream chapter) ─── */
const PILLARS = [
  {
    num: "01",
    title: "Direct Institutional Access",
    desc: "We partner directly with leading university faculties — no opaque middlemen, verified credit transfers only.",
  },
  {
    num: "02",
    title: "Radical Transparency",
    desc: "No hidden markups or biased recommendations. Every pathway is curated around the scholar's real trajectory.",
  },
  {
    num: "03",
    title: "Lifelong Relocation Care",
    desc: "From counseling to campus arrival and beyond — we stay an active advocate through the whole journey.",
  },
];

/* ─── Big stat numeral device (bottom-left, per chapter) ─── */
function StatNumeral({ value, decimals = 0, suffix = "" }: { value: number; decimals?: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        const start = performance.now();
        const dur = 1600;
        const step = (now: number) => {
          const t = Math.min(1, (now - start) / dur);
          const eased = 1 - Math.pow(1 - t, 3);
          const v = value * eased;
          setDisplay(decimals > 0 ? v.toFixed(decimals) : Math.round(v).toLocaleString("en-US"));
          if (t < 1) raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
        io.disconnect();
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, decimals]);

  return (
    <span ref={ref} className="au-stat" suppressHydrationWarning>
      {display}
      {suffix}
    </span>
  );
}

/* ─── Reveal-on-scroll wrapper ─── */
function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add("au-reveal--in");
          io.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`au-reveal ${className}`}>
      {children}
    </div>
  );
}

export default function AboutUsPage() {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const timelineRef = useRef<HTMLDivElement>(null);

  /* Horizontal timeline: scroll progress picks the active milestone */
  useEffect(() => {
    const onScroll = () => {
      const el = timelineRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = r.height - vh * 0.4;
      const p = Math.max(0, Math.min(1, (vh * 0.7 - r.top) / total));
      setProgress(p);
      setActive(Math.min(HISTORY.length - 1, Math.floor(p * HISTORY.length)));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const milestone = HISTORY[active];

  return (
    <div className="au-page">
      <Navbar pageLabel="ABOUT US" logoTheme="yellow" />

      {/* ═══ DARK INTRO — vertical brand statement ═══ */}
      <section className="au-intro">
        <span className="au-intro-vertical" aria-hidden>
          CULTURE FLOW — GLOBAL PATHWAYS · EST. OCT 2026
        </span>
        <div className="au-intro-inner">
          <Reveal>
            <p className="au-eyebrow au-eyebrow--gold">FOUNDED OCT 2026 · NEW DELHI</p>
          </Reveal>
          <Reveal>
            <h1 className="au-intro-title">
              We move scholars,
              <br />
              <em>not files.</em>
            </h1>
          </Reveal>
          <Reveal>
            <p className="au-intro-sub">
              Culture Flow was built on a simple refusal — that studying abroad should
              never be an anxiety-ridden maze of agents and commissions. It should be a
              dignified, life-defining milestone.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ═══ CHAPTER I — THE WORK (full-bleed documentary photo) ═══ */}
      <section className="au-chapter1">
        <img src="/images/about/counseling.jpg" alt="Culture Flow counselors mentoring scholars" className="au-ch1-img" />
        <div className="au-ch1-overlay" />
        <div className="au-ch1-content">
          <Reveal>
            <p className="au-eyebrow au-eyebrow--yellow">CHAPTER I — THE WORK</p>
          </Reveal>
          <Reveal>
            <h2 className="au-ch1-title">
              The warmth in
              <br />
              <em>every departure.</em>
            </h2>
          </Reveal>
        </div>
        <div className="au-chapter-stat">
          <StatNumeral value={52000} />
          <span className="au-stat-label">SCHOLARS MOBILIZED</span>
        </div>
      </section>

      {/* ═══ CHAPTER II — HISTORY (horizontal gold timeline) ═══ */}
      <section className="au-chapter2">
        <div className="au-ch2-head">
          <Reveal>
            <p className="au-eyebrow au-eyebrow--gold">CHAPTER II — HISTORY</p>
          </Reveal>
          <Reveal>
            <h2 className="au-ch2-title">Born this October. One conviction.</h2>
          </Reveal>
          <Reveal>
            <p className="au-ch2-sub">
              Young enough to move fast, built to last. One conviction carried
              from day one into launch.
            </p>
          </Reveal>
        </div>

        <div ref={timelineRef} className="au-timeline">
          <div className="au-timeline-line">
            <div className="au-timeline-fill" style={{ transform: `scaleX(${progress})` }} />
          </div>
          <div className="au-timeline-nodes">
            {HISTORY.map((m, i) => (
              <div
                key={m.year}
                className={`au-node ${i <= active ? "au-node--passed" : ""} ${i === active ? "au-node--active" : ""}`}
              >
                <span className="au-node-dot" />
                <span className="au-node-year">{m.year}</span>
              </div>
            ))}
          </div>
          <div className="au-timeline-detail" key={milestone.year}>
            <h3>{milestone.title}</h3>
            <p>{milestone.desc}</p>
          </div>
        </div>

        <div className="au-chapter-stat au-chapter-stat--passive">
          <span className="au-stat">200+</span>
          <span className="au-stat-label">PARTNER INSTITUTIONS</span>
        </div>
      </section>

      {/* ═══ CHAPTER III — CRAFT (photo panels + stat) ═══ */}
      <section className="au-chapter3">
        <div className="au-ch3-head">
          <Reveal>
            <p className="au-eyebrow au-eyebrow--gold">CHAPTER III — CRAFT</p>
          </Reveal>
          <Reveal>
            <h2 className="au-ch3-title">
              Precision in <em>every transfer.</em>
            </h2>
          </Reveal>
        </div>
        <div className="au-ch3-panels">
          <Reveal className="au-panel-wrap">
            <div className="au-panel">
              <img src="/images/about/campus.jpg" alt="Culture Flow scholar on campus" loading="lazy" />
            </div>
            <p className="au-panel-cap">Campus integration — ETH Zürich</p>
          </Reveal>
          <Reveal className="au-panel-wrap">
            <div className="au-panel">
              <img src="/images/about/partnership.jpg" alt="Institutional agreement handshake" loading="lazy" />
            </div>
            <p className="au-panel-cap">Direct faculty agreements</p>
          </Reveal>
          <Reveal className="au-panel-wrap">
            <div className="au-panel">
              <img src="/images/about/editorial.jpg" alt="Collegiate cloisters" loading="lazy" />
            </div>
            <p className="au-panel-cap">Collegiate fellowships</p>
          </Reveal>
        </div>
        <div className="au-chapter-stat">
          <StatNumeral value={99.4} decimals={1} suffix="%" />
          <span className="au-stat-label">VISA &amp; ADMISSIONS SUCCESS</span>
        </div>
      </section>

      {/* ═══ CHAPTER IV — THE HAND (cream info chapter) ═══ */}
      <section className="au-chapter4">
        <div className="au-ch4-grid">
          <div className="au-ch4-left">
            <Reveal>
              <p className="au-eyebrow au-eyebrow--dark">CHAPTER IV — PEOPLE</p>
            </Reveal>
            <Reveal>
              <h2 className="au-ch4-title">
                Where to
                <br />
                <em>find us.</em>
              </h2>
            </Reveal>
            <Reveal>
              <ul className="au-offices">
                <li>
                  <span className="au-office-city">New Delhi</span>
                  <span className="au-office-role">Headquarters</span>
                </li>
                <li>
                  <span className="au-office-city">Mumbai</span>
                  <span className="au-office-role">Regional Advisory</span>
                </li>
                <li>
                  <span className="au-office-city">London</span>
                  <span className="au-office-role">Liaison Desk</span>
                </li>
                <li>
                  <span className="au-office-city">Berlin</span>
                  <span className="au-office-role">Liaison Desk</span>
                </li>
              </ul>
            </Reveal>
          </div>

          <div className="au-ch4-right">
            <Reveal>
              <div className="au-founder-frame">
                <img src="/images/about/founder_vision.jpg" alt="Culture Flow founder" loading="lazy" />
              </div>
            </Reveal>
            <Reveal>
              <div className="au-pillar-list">
                {PILLARS.map((p) => (
                  <div key={p.num} className="au-pillar">
                    <span className="au-pillar-num">{p.num}</span>
                    <div>
                      <h3>{p.title}</h3>
                      <p>{p.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>

        <Reveal>
          <div className="au-ch4-cta">
            <h3>Ready to take your global step?</h3>
            <div className="au-ch4-btns">
              <Link href="/waitlist" className="au-btn au-btn--solid">
                <span>Join Waitlist</span>
                <span>→</span>
              </Link>
              <Link href="/programs" className="au-btn au-btn--outline">
                <span>Explore Programs</span>
              </Link>
            </div>
          </div>
        </Reveal>

        <div className="au-chapter-stat au-chapter-stat--dark-on-cream">
          <span className="au-stat">1,400+</span>
          <span className="au-stat-label">SCHOLARS GLOBALLY PLACED</span>
        </div>
      </section>

      <Footer />
    </div>
  );
}
