"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import "./HeroSection.css";

// Dynamically import WebGL component to avoid SSR issues
const GlobeLineDrawing = dynamic(() => import("./GlobeLineDrawing"), {
  ssr: false,
  loading: () => null,
});

export default function HeroSection() {
  const [globeSize, setGlobeSize] = useState(600);

  // ─── Globe Sizing (+35% larger) ───
  useEffect(() => {
    const update = () => {
      const vh = window.innerHeight;
      const vw = window.innerWidth;
      const base = Math.min(vh * 0.68, vw * 0.58);
      const size = Math.min(1400, Math.max(550, base * 1.62));
      setGlobeSize(Math.round(size));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <section className="hero-section">
      {/* ═══ GLOBE AREA ═══ */}
      <div
        className="hero-globe-wrapper"
        style={{ width: globeSize, height: globeSize }}
      >
        <div className="hero-globe-drawing">
          <GlobeLineDrawing
            active={true}
            size={globeSize}
          />
          <div className="hero-globe-shadow" />
        </div>
      </div>

      {/* ═══ BOTTOM CONTENT ═══ */}
      <div className="hero-content hero-content--visible">
        {/* Left: Heading + Subtitle + CTA */}
        <div className="hero-left">
          <h1 className="hero-heading">
            <span className="hero-heading__line1">One Step.</span>
            <span className="hero-heading__line2">
              New <span className="hero-heading__yellow">Future.</span>
            </span>
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
