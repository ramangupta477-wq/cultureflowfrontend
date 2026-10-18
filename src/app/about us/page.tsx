"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/app/homepage/Footer";
import "./AboutUs.css";

/* ─── Timeline Milestone Interface ─── */
interface Milestone {
  year: string;
  phase: string;
  title: string;
  tagline: string;
  description: string;
  metric: string;
  metricLabel: string;
  image?: string;
  imageAlt?: string;
  badge?: string;
}

const TIMELINE_DATA: Milestone[] = [
  {
    year: "2021",
    phase: "PHASE 01 · FOUNDATION",
    title: "The Genesis & Core Conviction",
    tagline: "Questioning the broken study-abroad agency paradigm.",
    description:
      "Culture Flow was conceived in New Delhi from a clear observation: international student mobility was dominated by transactional agents and opaque commission incentives. We set out to build direct, transparent academic bridges that treat students as future global scholars, not leads.",
    metric: "01",
    metricLabel: "Headquarters · New Delhi",
    badge: "Origin",
  },
  {
    year: "2022",
    phase: "PHASE 02 · DIRECT ALLIANCES",
    title: "First Tier-1 Articulation Agreements",
    tagline: "Direct institutional access without intermediary brokers.",
    description:
      "We bypassed commercial aggregators to sign bilateral articulation agreements directly with pioneering faculties across the United Kingdom and Europe. This established our signature pathway standard: verified curricular credit transfers and guaranteed academic review.",
    metric: "14",
    metricLabel: "Initial University Faculties",
    image: "/images/about/partnership.jpg",
    imageAlt: "Culture Flow institutional agreement handshake",
    badge: "Breakthrough",
  },
  {
    year: "2023",
    phase: "PHASE 03 · MOBILITY ARCHITECTURE",
    title: "The End-to-End Care Framework",
    tagline: "Relocation care that extends far beyond the offer letter.",
    description:
      "We launched the Culture Flow Pathway Architecture — integrating academic profiling, university matching, verified accommodation sourcing, visa compliance, and pre-departure cultural orientation. Every scholar received a dedicated mentor navigating their entire transition.",
    metric: "100%",
    metricLabel: "Visa Approval Standard",
    image: "/images/about/counseling.jpg",
    imageAlt: "Culture Flow counselors mentoring students",
    badge: "Infrastructure",
  },
  {
    year: "2024",
    phase: "PHASE 04 · CONTINENTAL EXPANSION",
    title: "200+ Institution Global Network",
    tagline: "Bridging Indian scholars to premier institutions worldwide.",
    description:
      "Our institutional partnerships expanded across leading universities in the UK, Switzerland (ETH Zürich), Germany, Canada, and Australia. We inaugurated our Mumbai regional advisory office and established direct liaison desks in London and Berlin.",
    metric: "200+",
    metricLabel: "Partner Institutions Worldwide",
    image: "/images/about/campus.jpg",
    imageAlt: "Culture Flow scholar at ETH Zürich campus",
    badge: "Scale",
  },
  {
    year: "2025",
    phase: "PHASE 05 · COLLEGIATE FELLOWSHIPS",
    title: "Oxbridge & Russell Group Cohorts",
    tagline: "Prestigious tutorial placements with dedicated scholarships.",
    description:
      "Our scholars gained direct admission into elite collegiate tutorials, high-table research groups, and frontier technology laboratories. Culture Flow mentors facilitated over £2.4M in institutional scholarships, grants, and merit bursaries.",
    metric: "£2.4M+",
    metricLabel: "Merit Bursaries Secured",
    image: "/images/about/editorial.jpg",
    imageAlt: "Collegiate cloisters historic university setting",
    badge: "Excellence",
  },
  {
    year: "2026",
    phase: "PHASE 06 · ONE GLOBAL STEP",
    title: "The Next-Gen Mobility Platform",
    tagline: "Building the global education platform students don't just follow — they embrace.",
    description:
      "Today, Culture Flow is evolving from an admissions bridge into a comprehensive mobility ecosystem. Uniting predictive program discovery, verified institutional pathways, on-campus peer networks, and lifelong alumni advisory across three continents.",
    metric: "1,400+",
    metricLabel: "Scholars Globally Placed",
    badge: "Present Day",
  },
];

/* ─── Core Values Interface ─── */
const VISION_PILLARS = [
  {
    num: "01",
    title: "Direct Institutional Access",
    desc: "We partner directly with leading university faculties, removing opaque third-party middlemen to guarantee transparent admissions and verified credit transfers.",
  },
  {
    num: "02",
    title: "Radical Transparency",
    desc: "No hidden commercial markups or biased recommendations. Every academic pathway is curated around the scholar's genuine intellectual and career trajectory.",
  },
  {
    num: "03",
    title: "Lifelong Relocation Care",
    desc: "From initial counseling to campus accommodation, visa compliance, and cultural integration — we remain an active advocate throughout the student's journey.",
  },
];

export default function AboutUsPage() {
  const [activeMilestone, setActiveMilestone] = useState<number>(0);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const timelineRef = useRef<HTMLDivElement>(null);
  const milestoneRefs = useRef<(HTMLDivElement | null)[]>([]);

  // ─── Scroll-driven Timeline Progress & Active Node Observer ───
  useEffect(() => {
    const handleScroll = () => {
      if (!timelineRef.current) return;
      const rect = timelineRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculate scroll progress through the timeline section (0 to 1)
      const totalDist = rect.height - windowHeight * 0.5;
      const currentScroll = windowHeight * 0.5 - rect.top;
      const progress = Math.max(0, Math.min(1, currentScroll / totalDist));
      setScrollProgress(progress);

      // Determine active milestone based on viewport center
      milestoneRefs.current.forEach((el, index) => {
        if (!el) return;
        const elRect = el.getBoundingClientRect();
        if (elRect.top <= windowHeight * 0.6 && elRect.bottom >= windowHeight * 0.25) {
          setActiveMilestone(index);
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial computation
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="cf-about-page">
      {/* ═══ GLOBAL NAVBAR (Always Active with ABOUT US Indicator & Brand Yellow Logo) ═══ */}
      <Navbar pageLabel="ABOUT US" logoTheme="yellow" />

      {/* ═════════════════════════════════════════════════════════════
          SECTION 1: OUR VISION HERO (Inspired by the Reference Layout)
          ═════════════════════════════════════════════════════════════ */}
      <section className="cf-vision-hero">
        <div className="cf-vision-container">
          
          {/* Left Column: Eyebrow, Large Editorial Title, Bottom 2-Col Split */}
          <div className="cf-vision-left">
            
            {/* Top: Eyebrow + Headline */}
            <div className="cf-vision-top">
              <div className="cf-vision-eyebrow">
                <span className="cf-vision-eyebrow-line" />
                <span className="cf-vision-eyebrow-text">
                  CULTURE FLOW · VISION & ARCHITECTURE
                </span>
              </div>

              <h1 className="cf-vision-title">
                The vision behind <br />
                Culture Flow
              </h1>
            </div>

            {/* Bottom 2-Column Split: Button on left, Narrative on right (Matches Reference) */}
            <div className="cf-vision-bottom-row">
              <div className="cf-vision-cta-col">
                <Link href="/#waitlist" className="cf-vision-cta-btn">
                  <span>SCHEDULE A DIALOGUE</span>
                  <span className="cf-vision-arrow">→</span>
                </Link>
              </div>

              <div className="cf-vision-narrative-col">
                <p className="cf-vision-narrative-p">
                  My journey with global education began with a personal realization:
                  navigating international pathways shouldn&apos;t be an anxiety-ridden
                  maze of unvetted commercial agents, opaque commissions, and transactional
                  promises. It should be a dignified, life-defining milestone.
                </p>
                <p className="cf-vision-narrative-p">
                  Having experienced international academic mobility firsthand, I saw how
                  the traditional consultancy model treated students as commercial inventory
                  rather than ambitious scholars. Culture Flow was created to reverse that —
                  partnering directly with world-class universities to architect genuine,
                  transparent pathways where students don&apos;t just follow — they embrace.
                </p>
              </div>
            </div>

          </div>

          {/* Right Column: Cinematic Tall Portrait Image (0px radius, straight crop) */}
          <div className="cf-vision-right">
            <div className="cf-vision-img-frame">
              <img
                src="/images/about/founder_vision.jpg"
                alt="Culture Flow Vision"
                className="cf-vision-img"
              />
            </div>
          </div>

        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════
          SECTION 2: CORE VISION PILLARS (Minimalist Manifesto)
          ═════════════════════════════════════════════════════════════ */}
      <section className="cf-pillars-section">
        <div className="cf-pillars-container">
          <div className="cf-pillars-header">
            <span className="cf-pillars-tag">OUR CONVICTIONS</span>
            <h2 className="cf-pillars-heading">How we redefine international student mobility.</h2>
          </div>

          <div className="cf-pillars-grid">
            {VISION_PILLARS.map((pillar) => (
              <div key={pillar.num} className="cf-pillar-card">
                <span className="cf-pillar-num">{pillar.num}</span>
                <h3 className="cf-pillar-title">{pillar.title}</h3>
                <p className="cf-pillar-desc">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════
          SECTION 3: OUR JOURNEY (Aesthetic Minimal Scroll Timeline)
          ═════════════════════════════════════════════════════════════ */}
      <section ref={timelineRef} id="journey" className="cf-journey-section">
        <div className="cf-journey-container">

          {/* Section Heading */}
          <div className="cf-journey-header">
            <div className="cf-journey-tag">
              <span className="cf-journey-tag-dot" />
              <span>CHRONOLOGY OF IMPACT · 2021 — PRESENT</span>
            </div>
            <h2 className="cf-journey-title">Our Journey</h2>
            <p className="cf-journey-subtitle">
              From a small advisory room in New Delhi to a premier global mobility
              ecosystem connecting ambitious scholars with 200+ world-class institutions.
            </p>
          </div>

          {/* ─── Scroll-Driven Interactive Timeline ─── */}
          <div className="cf-timeline-wrapper">
            
            {/* Central Vertical Spine & Glowing Progress Beam */}
            <div className="cf-timeline-spine">
              <div
                className="cf-timeline-progress-bar"
                style={{ transform: `scaleY(${scrollProgress})` }}
              />
            </div>

            {/* Milestone Items */}
            <div className="cf-timeline-list">
              {TIMELINE_DATA.map((milestone, idx) => {
                const isActive = activeMilestone === idx;
                const isPassed = activeMilestone > idx;
                const isEven = idx % 2 === 0;

                return (
                  <div
                    key={milestone.year}
                    ref={(el) => {
                      milestoneRefs.current[idx] = el;
                    }}
                    className={`cf-timeline-item ${isEven ? "cf-timeline-item--left" : "cf-timeline-item--right"} ${
                      isActive ? "cf-timeline-item--active" : ""
                    } ${isPassed ? "cf-timeline-item--passed" : ""}`}
                  >
                    {/* Glowing Node on Spine */}
                    <div className="cf-timeline-node">
                      <div className="cf-timeline-node-inner" />
                    </div>

                    {/* Milestone Card */}
                    <div className="cf-timeline-card">
                      
                      {/* Top Meta: Phase + Badge */}
                      <div className="cf-timeline-meta">
                        <span className="cf-timeline-phase">{milestone.phase}</span>
                        {milestone.badge && (
                          <span className="cf-timeline-badge">{milestone.badge}</span>
                        )}
                      </div>

                      {/* Big Year Marker */}
                      <div className="cf-timeline-year-row">
                        <span className="cf-timeline-year">{milestone.year}</span>
                        <div className="cf-timeline-stat-pill">
                          <span className="cf-timeline-stat-val">{milestone.metric}</span>
                          <span className="cf-timeline-stat-lbl">{milestone.metricLabel}</span>
                        </div>
                      </div>

                      {/* Title & Tagline */}
                      <h3 className="cf-timeline-heading">{milestone.title}</h3>
                      <p className="cf-timeline-tagline">{milestone.tagline}</p>

                      {/* Editorial Narrative */}
                      <p className="cf-timeline-desc">{milestone.description}</p>

                      {/* Accompanying Photo Card (if milestone has image) */}
                      {milestone.image && (
                        <div className="cf-timeline-photo-box">
                          <img
                            src={milestone.image}
                            alt={milestone.imageAlt || milestone.title}
                            className="cf-timeline-photo"
                            loading="lazy"
                          />
                          <div className="cf-timeline-photo-caption">
                            <span>{milestone.imageAlt}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════
          SECTION 4: INVITATION BANNER
          ═════════════════════════════════════════════════════════════ */}
      <section className="cf-about-cta-section">
        <div className="cf-about-cta-card">
          <div className="cf-about-cta-content">
            <span className="cf-about-cta-tag">THE INVITATION</span>
            <h2 className="cf-about-cta-heading">
              Ready to take your global step?
            </h2>
            <p className="cf-about-cta-body">
              Whether you are an ambitious student seeking tier-1 pathway guidance or an
              institution exploring international articulation partnerships, our doors are open.
            </p>
            <div className="cf-about-cta-buttons">
              <Link href="/waitlist" className="cf-about-btn-solid">
                <span>Join Waitlist</span>
                <span className="cf-btn-arrow">→</span>
              </Link>
              <Link href="/programs" className="cf-about-btn-outline">
                <span>Explore Programs</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <Footer />
    </div>
  );
}
