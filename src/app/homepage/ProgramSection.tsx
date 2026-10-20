"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { PROGRAMS_DATA } from "@/data/programsData";
import "./ProgramSection.css";

/*
  Unified Scroll Timeline:
  ─────────────────────────────────────────────────
  0.00 → 0.10  Phase A: Title slides UP, desc slides DOWN, map fades,
                         white card box EXPANDS and fades out
  0.10 → 0.22  Phase B: Image continues enlarging to its final column size
  0.22 → 0.32  Phase C: Left & right details slide in with delay
  0.32 → 1.00  Phase D: Horizontal scroll across 4 programs
  ─────────────────────────────────────────────────
*/

const PA = 0.10;   // Phase A end
const PB = 0.22;   // Phase B end
const PC = 0.32;   // Phase C end

export default function ProgramSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const targetP = useRef(0);
  const currentP = useRef(0);

  useEffect(() => {
    let animId: number;
    const onScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      if (total <= 0) return;
      targetP.current = Math.min(Math.max(-rect.top / total, 0), 1);
    };
    const loop = () => {
      const diff = targetP.current - currentP.current;
      if (Math.abs(diff) > 0.0001) {
        currentP.current += diff * 0.085;
        setScrollProgress(currentP.current);
      }
      animId = requestAnimationFrame(loop);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();
    currentP.current = targetP.current;
    setScrollProgress(currentP.current);
    loop();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(animId);
    };
  }, []);

  // ─── Phase calculations ───
  const clamp01 = (v: number) => Math.min(Math.max(v, 0), 1);
  const phaseA = clamp01(scrollProgress / PA);
  const phaseB = clamp01((scrollProgress - PA) / (PB - PA));
  const phaseC = clamp01((scrollProgress - PB) / (PC - PB));
  const phaseD = clamp01((scrollProgress - PC) / (1 - PC));

  // Eased values
  const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
  const easedA = easeOut(phaseA);
  const easedB = easeOut(phaseB);

  // Combined expand progress for the image (0→1 over phases A+B combined)
  const imageExpand = clamp01(scrollProgress / PB);
  const easedImageExpand = easeOut(imageExpand);

  // Map fades out during phase A
  const mapOpacity = Math.max(1 - easedA * 1.8, 0);

  // Card BG: expands during phase A, then fades during phase B
  const cardScale = 1 + easedA * 1.8; // grows from 1x to 2.8x
  const cardBgOpacity = phaseA < 1
    ? 1 // fully visible during phase A
    : Math.max(1 - phaseB * 2, 0); // fades out during phase B

  // Text animations (phase A only)
  const titleUp = easedA * 140; // px to slide up
  const titleOpacity = Math.max(1 - phaseA * 1.8, 0);
  const descDown = easedA * 120; // px to slide down
  const descOpacity = Math.max(1 - phaseA * 1.8, 0);
  const dividerOpacity = Math.max(1 - phaseA * 2.5, 0);

  // Image scale: starts small (card thumbnail), ends at 1.0 (full column)
  // In the card it's about ~240px wide, in expanded it's ~480px wide
  // So roughly 0.5 → 1.0, but we add some visual punch
  const imageScale = 0.42 + easedImageExpand * 0.58;
  const imageOpacity = 1;

  // Side content (phase C)
  const sideOpacity = phaseC;
  const leftSlide = (1 - easeOut(phaseC)) * -50;
  const rightSlide = (1 - easeOut(phaseC)) * 50;

  // Horizontal scroll
  const totalSlides = PROGRAMS_DATA.length;
  const activeIndex = Math.min(Math.floor(phaseD * totalSlides + 0.1), totalSlides - 1);
  const horizPct = phaseD * (totalSlides - 1) * 100;

  // Nav visibility
  const navOpacity = clamp01(phaseC * 1.5);

  const scrollToProgram = useCallback(
    (index: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const scrollY = window.scrollY || window.pageYOffset;
      const containerTop = rect.top + scrollY;
      const total = rect.height - window.innerHeight;
      const t = PC + (index / (totalSlides - 1)) * (1 - PC);
      window.scrollTo({ top: containerTop + t * total, behavior: "smooth" });
    },
    [totalSlides]
  );

  // Whether to show the intro overlay elements
  const showIntroText = scrollProgress < PB + 0.02;
  // Whether the expanded 3-col stage is needed
  const showExpanded = scrollProgress > PA * 0.3;

  return (
    <section ref={containerRef} className="cf-programs-section">
      <div className="cf-programs-sticky-viewport">

        {/* ─── World Map Background ─── */}
        <div className="cf-programs-bg" style={{ opacity: mapOpacity }}>
          <img src="/homepage_assets/world.svg" alt="" className="cf-programs-world-map" />
        </div>

        {/* ─── Soft Border Fades around Section ─── */}
        <div className="cf-programs-border-fade cf-programs-border-fade--top" />
        <div className="cf-programs-border-fade cf-programs-border-fade--bottom" />
        <div className="cf-programs-border-fade cf-programs-border-fade--left" />
        <div className="cf-programs-border-fade cf-programs-border-fade--right" />

        {/* ═══ INTRO CARD WHITE BOX (expands and fades) ═══ */}
        {showIntroText && (
          <div className="cf-intro-card-overlay">
            <div
              className="cf-intro-card"
              style={{
                transform: `scale(${cardScale})`,
                opacity: cardBgOpacity,
                pointerEvents: phaseA > 0.5 ? "none" : "auto",
              }}
            >
              {/* Title: slides UP */}
              <h2
                className="cf-intro-title"
                style={{
                  transform: `translateY(${-titleUp}px) scale(${1 / cardScale})`,
                  opacity: titleOpacity,
                }}
              >
                PROGRAMS
              </h2>

              {/* Gold divider */}
              <div
                className="cf-intro-divider"
                style={{
                  opacity: dividerOpacity,
                  transform: `scaleX(${Math.max(1 - phaseA * 2, 0)}) scale(${1 / cardScale})`,
                }}
              />

              {/* Placeholder space for the image (keeps layout but image is rendered outside) */}
              <div
                className="cf-intro-image-placeholder"
                style={{ opacity: Math.max(1 - phaseA * 3, 0) }}
              />

              {/* Description: slides DOWN */}
              <p
                className="cf-intro-desc"
                style={{
                  transform: `translateY(${descDown}px) scale(${1 / cardScale})`,
                  opacity: descOpacity,
                }}
              >
                How does an academic pathway earn the Culture Flow seal? We set our
                own rigorous benchmarks to make certain every journey is exceptional.
                We curate premier global programs that blend top-tier university
                credentials with end-to-end relocation infrastructure and verified peace
                of mind.
              </p>

              {/* Scroll hint */}
              <div
                className="cf-intro-hint"
                style={{
                  transform: `translateY(${descDown * 0.7}px) scale(${1 / cardScale})`,
                  opacity: Math.max(descOpacity - 0.2, 0),
                }}
              >
                <span>Scroll to expand &amp; explore pathways</span>
                <span className="cf-intro-arrow">↓</span>
              </div>
            </div>
          </div>
        )}

        {/* ═══ THE SINGLE EXPANDING IMAGE (lives outside the card, on top) ═══ */}
        {/* This is the one continuous image that starts small and grows to column size */}
        <div
          className="cf-expanding-image"
          style={{
            transform: `scale(${imageScale})`,
            opacity: imageOpacity,
            // Hide once horizontal scrolling starts and we're past first slide
            display: phaseD > 0.05 ? "none" : "flex",
          }}
        >
          <img
            src={PROGRAMS_DATA[0].image}
            alt={PROGRAMS_DATA[0].universityName}
            className="cf-expanding-img"
          />
        </div>

        {/* ═══ EXPANDED 3-COLUMN STAGE ═══ */}
        {showExpanded && (
          <div
            className="cf-expanded-stage"
            style={{
              opacity: clamp01(phaseB * 1.2),
              pointerEvents: phaseB > 0.5 ? "auto" : "none",
            }}
          >
            {/* Top bar */}
            <div
              className="cf-programs-topbar"
              style={{
                opacity: navOpacity,
                transform: `translateY(${(1 - easeOut(phaseC)) * -20}px)`,
              }}
            >
              <span className="cf-topbar-brand">CULTURE FLOW · CURATED PATHWAYS</span>
              <span className="cf-topbar-counter">
                0{activeIndex + 1} / 0{totalSlides}
              </span>
            </div>

            {/* Horizontal Slide Track */}
            <div
              className="cf-horizontal-track"
              style={{ transform: `translateX(-${horizPct}vw)` }}
            >
              {PROGRAMS_DATA.map((prog, index) => {
                const isFirst = index === 0;
                return (
                  <div key={prog.id} className="cf-program-slide">
                    <div className="cf-program-layout">
                      {/* Left */}
                      <div
                        className="cf-program-left"
                        style={isFirst ? { opacity: sideOpacity, transform: `translateX(${leftSlide}px)` } : undefined}
                      >
                        <span className="cf-script-tag">{prog.taglineScript}</span>
                        <h3 className="cf-serif-title">{prog.titleSerif}</h3>
                        <span className="cf-serif-subtitle">{prog.titleSub}</span>
                        <p className="cf-program-loc">
                          <svg className="cf-loc-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                            <circle cx="12" cy="9" r="2.5" />
                          </svg>
                          {prog.location}, {prog.country}
                        </p>
                      </div>

                      {/* Center — for first slide, the expanding image handles it; for others, show normally */}
                      <div className="cf-program-center">
                        <div
                          className="cf-image-frame"
                          style={isFirst ? { opacity: phaseD > 0.05 ? 1 : 0 } : undefined}
                        >
                          <img src={prog.image} alt={prog.universityName} className="cf-program-img" />
                        </div>
                      </div>

                      {/* Right */}
                      <div
                        className="cf-program-right"
                        style={isFirst ? { opacity: sideOpacity, transform: `translateX(${rightSlide}px)` } : undefined}
                      >
                        <p className="cf-program-subdesc">{prog.subDescription}</p>
                        <div className="cf-specs-grid">
                          <div className="cf-spec-item">
                            <span className="cf-spec-label">Duration</span>
                            <span className="cf-spec-val">{prog.duration}</span>
                          </div>
                          <div className="cf-spec-item">
                            <span className="cf-spec-label">Intake</span>
                            <span className="cf-spec-val">{prog.intake}</span>
                          </div>
                          <div className="cf-spec-item">
                            <span className="cf-spec-label">Housing</span>
                            <span className="cf-spec-val">{prog.housing}</span>
                          </div>
                          <div className="cf-spec-item">
                            <span className="cf-spec-label">Visa Support</span>
                            <span className="cf-spec-val">{prog.visaSupport}</span>
                          </div>
                        </div>
                        <ul className="cf-features-list">
                          {prog.features.slice(0, 3).map((f, fi) => (
                            <li key={fi} className="cf-feature-item">
                              <span className="cf-feature-bullet">✦</span>
                              {f}
                            </li>
                          ))}
                        </ul>
                        <div className="cf-cta-wrapper">
                          <a href={prog.ctaLink} className="cf-program-cta">
                            {prog.ctaText}
                            <span className="cf-cta-arrow">↗</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Nav */}
            <div
              className="cf-bottom-nav"
              style={{
                opacity: navOpacity,
                transform: `translateY(${(1 - easeOut(phaseC)) * 24}px)`,
              }}
            >
              <div className="cf-nav-pills">
                {PROGRAMS_DATA.map((prog, idx) => (
                  <button
                    key={prog.id}
                    onClick={() => scrollToProgram(idx)}
                    className={`cf-nav-pill ${activeIndex === idx ? "cf-nav-pill--active" : ""}`}
                  >
                    <span className="cf-pill-index">0{idx + 1}</span>
                    <span className="cf-pill-name">{prog.titleSerif}</span>
                  </button>
                ))}
              </div>
              <div className="cf-scroll-hint">
                <span>Scroll to view next program</span>
                <span className="cf-scroll-hint-arrow">→</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
