"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import { useLenis } from "lenis/react";
import "./HeroSection.css";

// Dynamically import WebGL component to avoid SSR issues
const GlobeLineDrawing = dynamic(() => import("./GlobeLineDrawing"), {
  ssr: false,
  loading: () => null,
});

/**
 * Phase sequence:
 * 1. "loading"   — Logo + progress bar (0→100%)
 * 2. "revealing" — Loader fades out, globe lines start drawing
 * 3. "hero"      — Drawing done, content fades in, scroll unlocked
 */
type Phase = "loading" | "revealing" | "hero";

export default function HeroSection() {
  const [phase, setPhase] = useState<Phase>("loading");
  const [loadPercent, setLoadPercent] = useState(0);
  const [globeSize, setGlobeSize] = useState(600);
  const [loaderMounted, setLoaderMounted] = useState(true);

  const loadIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lenis = useLenis();

  // ─── Scroll Lock ───
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    }
  }, [lenis]);

  useEffect(() => {
    if (phase !== "hero") {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      if (lenis) lenis.stop();
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      if (lenis) lenis.start();
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      if (lenis) lenis.start();
    };
  }, [phase, lenis]);

  // ─── Globe Sizing (+35% larger) ───
  useEffect(() => {
    const update = () => {
      const vh = window.innerHeight;
      const vw = window.innerWidth;
      // 20% bigger again — fills center dramatically
      const base = Math.min(vh * 0.68, vw * 0.58);
      const size = Math.min(1400, Math.max(550, base * 1.62));
      setGlobeSize(Math.round(size));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // ─── Phase 1: Loading 0→100% ───
  useEffect(() => {
    let current = 0;
    loadIntervalRef.current = setInterval(() => {
      const speed =
        current < 25 ? 0.75 :
          current < 55 ? 1.4 :
            current < 80 ? 0.9 :
              current < 95 ? 0.5 : 0.3;
      current = Math.min(current + speed, 100);
      setLoadPercent(Math.round(current));

      if (current >= 100) {
        if (loadIntervalRef.current) clearInterval(loadIntervalRef.current);
        // Brief pause at 100%, then start revealing
        setTimeout(() => {
          setPhase("revealing");
          // Unmount loader after fade-out completes
          setTimeout(() => setLoaderMounted(false), 1000);
        }, 400);
      }
    }, 40);

    return () => {
      if (loadIntervalRef.current) clearInterval(loadIntervalRef.current);
    };
  }, []);

  // ─── Globe line drawing complete → show content ───
  const handleDrawComplete = useCallback(() => {
    // Small delay then reveal content
    setTimeout(() => {
      setPhase("hero");
    }, 500);
  }, []);

  // Phase-derived visibility flags
  const isExiting = phase === "revealing";
  const showContent = phase === "hero";

  return (
    <section className="hero-section">
      {/* ═══ LOADER OVERLAY ═══ */}
      {loaderMounted && (
        <div className={`hero-loader ${isExiting ? "hero-loader--exiting" : ""}`}>
          {/* Logo centered */}
          <div className={`hero-loader__logo ${isExiting ? "hero-loader__logo--out" : ""}`}>
            <img
              src="/homepage_assets/Culture Flow logo.svg"
              alt="Culture Flow"
            />
          </div>

          {/* Bottom: percent + progress bar */}
          <div className="hero-loader__bottom">
            <div className="hero-loader__percent">{loadPercent}%</div>
            <div className="hero-loader__bar">
              <div
                className="hero-loader__bar-fill"
                style={{ transform: `scaleX(${loadPercent / 100})` }}
              />
            </div>
          </div>
        </div>
      )}


      {/* ═══ GLOBE AREA ═══ */}
      <div
        className="hero-globe-wrapper"
        style={{ width: globeSize, height: globeSize }}
      >
        {/* The single globe — line drawing that stays as the final globe */}
        <div className="hero-globe-drawing">
          <GlobeLineDrawing
            active={phase === "revealing" || phase === "hero"}
            onComplete={handleDrawComplete}
            size={globeSize}
          />
          <div className="hero-globe-shadow" />
        </div>
      </div>

      {/* ═══ BOTTOM CONTENT ═══ */}
      <div className={`hero-content ${showContent ? "hero-content--visible" : ""}`}>
        {/* Left: Heading + Subtitle + CTA */}
        <div className="hero-left">
          <h1 className="hero-heading">
            <span className="hero-heading__line1">One Step.</span>
            <span className="hero-heading__line2">New Future.</span>
          </h1>
          <p className="hero-subtitle">
            Transforming Indian student mobility through structured educational
            programs, partnering with top universities worldwide.
          </p>
          <a href="/contact" className="hero-cta">
            GET STARTED
            <span className="hero-cta__arrow">↗</span>
          </a>
        </div>

        {/* Right: Description + Tags */}
        <div className="hero-right">
          <p className="hero-right__text">
            Whether through <strong>international affairs, university
              partnerships,</strong> or <strong>cultural exchange
                programs,</strong>{" "}
            we create pathways that students don&apos;t just follow — they
            embrace.
          </p>
          <div className="hero-tags">
            <span className="hero-tag">STUDY ABROAD</span>
            <span className="hero-tag">UNIVERSITY PROGRAMS</span>
            <span className="hero-tag">INTERNATIONAL AFFAIRS</span>
            <span className="hero-tag hero-tag--more">+</span>
          </div>
        </div>
      </div>
    </section>
  );
}
