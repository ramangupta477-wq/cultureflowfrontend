"use client";

import React, { useEffect, useState } from "react";
import "./InspoCard.css";

interface InspoCardProps {
  className?: string;
}

export default function InspoCard({ className = "" }: InspoCardProps) {
  const [animatedTopCount, setAnimatedTopCount] = useState(0);
  const [animatedLeftCount, setAnimatedLeftCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);

    // Smooth count-up for 52,000
    const topTarget = 52000;
    const topDuration = 1800;
    const topStart = performance.now();

    const animateTop = (time: number) => {
      const elapsed = time - topStart;
      const progress = Math.min(elapsed / topDuration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setAnimatedTopCount(Math.round(ease * topTarget));

      if (progress < 1) {
        requestAnimationFrame(animateTop);
      }
    };
    requestAnimationFrame(animateTop);

    // Smooth count-up for 5,095,938
    const leftTarget = 5095938;
    const leftDuration = 2000;
    const leftStart = performance.now();

    const animateLeft = (time: number) => {
      const elapsed = time - leftStart;
      const progress = Math.min(elapsed / leftDuration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setAnimatedLeftCount(Math.round(ease * leftTarget));

      if (progress < 1) {
        requestAnimationFrame(animateLeft);
      }
    };
    requestAnimationFrame(animateLeft);
  }, []);

  return (
    <div className={`inspo-glass-card ${isVisible ? "inspo-glass-card--visible" : ""} ${className}`}>
      
      {/* ─── TOP SECTION ─── */}
      <div className="inspo-card-section inspo-card-section--top">
        <div className="inspo-card-label-row">
          <span className="inspo-gold-square" aria-hidden="true" />
          <span className="inspo-card-label">COMPANIES COMMITTING TO CARBON REMOVAL PURCHASES</span>
        </div>
        <div className="inspo-card-hero-num">
          {animatedTopCount.toLocaleString()}
        </div>
      </div>

      {/* Hairline Divider */}
      <div className="inspo-card-divider" />

      {/* ─── MIDDLE SECTION: WORLD MAP USING PUBLIC SVG ─── */}
      <div className="inspo-card-section inspo-card-section--mid">
        <div className="inspo-card-label-row">
          <span className="inspo-gold-square" aria-hidden="true" />
          <span className="inspo-card-label">CARBON REMOVALS LOCATIONS</span>
        </div>

        {/* Real World Map SVG from public/homepage_assets/world.svg */}
        <div className="inspo-map-container">
          <div className="inspo-map-svg-wrapper">
            <img
              src="/homepage_assets/world.svg"
              alt="World Locations Map"
              className="inspo-world-svg-img"
            />
            {/* SVG overlay for theme gold pinpoint dots in 2000x857 coordinate space */}
            <svg
              className="inspo-dots-overlay"
              viewBox="0 0 2000 857"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* US West Coast / California */}
              <circle cx="360" cy="300" r="10" className="inspo-dot" />
              <circle cx="380" cy="335" r="9" className="inspo-dot" />
              <circle cx="400" cy="355" r="10" className="inspo-dot" />
              <circle cx="415" cy="320" r="9" className="inspo-dot" />

              {/* US Midwest & Texas */}
              <circle cx="470" cy="325" r="10" className="inspo-dot" />
              <circle cx="490" cy="355" r="9" className="inspo-dot" />
              <circle cx="510" cy="395" r="10" className="inspo-dot" />
              <circle cx="480" cy="385" r="9" className="inspo-dot" />

              {/* US East Coast Cluster (Boston / Harvard, NY, DC, Florida) */}
              <circle cx="560" cy="290" r="10" className="inspo-dot" />
              <circle cx="575" cy="305" r="11" className="inspo-dot inspo-dot--pulse" />
              <circle cx="590" cy="285" r="9" className="inspo-dot" />
              <circle cx="565" cy="325" r="9" className="inspo-dot" />
              <circle cx="585" cy="340" r="9" className="inspo-dot" />
              <circle cx="550" cy="275" r="9" className="inspo-dot" />

              {/* Central America & South America */}
              <circle cx="530" cy="450" r="9" className="inspo-dot" />
              <circle cx="565" cy="505" r="9" className="inspo-dot" />
              <circle cx="620" cy="570" r="9" className="inspo-dot" />
              <circle cx="600" cy="690" r="9" className="inspo-dot" />

              {/* Europe & UK Cluster (Oxford / London, Paris, Munich / TUM, Zurich) */}
              <circle cx="985" cy="210" r="11" className="inspo-dot inspo-dot--pulse" />
              <circle cx="1025" cy="225" r="10" className="inspo-dot" />
              <circle cx="1055" cy="235" r="11" className="inspo-dot inspo-dot--pulse" />
              <circle cx="1020" cy="250" r="9" className="inspo-dot" />
              <circle cx="1075" cy="220" r="9" className="inspo-dot" />
              <circle cx="1045" cy="205" r="9" className="inspo-dot" />
              <circle cx="1090" cy="260" r="9" className="inspo-dot" />

              {/* India & South Asia (New Delhi, Mumbai, Bengaluru) */}
              <circle cx="1395" cy="370" r="12" className="inspo-dot inspo-dot--pulse" />
              <circle cx="1380" cy="410" r="10" className="inspo-dot" />
              <circle cx="1405" cy="440" r="10" className="inspo-dot" />

              {/* East Asia & Singapore */}
              <circle cx="1535" cy="500" r="11" className="inspo-dot inspo-dot--pulse" />
              <circle cx="1580" cy="380" r="9" className="inspo-dot" />
              <circle cx="1690" cy="310" r="10" className="inspo-dot" />

              {/* Australia (Sydney, Melbourne) */}
              <circle cx="1740" cy="670" r="10" className="inspo-dot" />
              <circle cx="1710" cy="700" r="9" className="inspo-dot" />
              <circle cx="1660" cy="650" r="9" className="inspo-dot" />
            </svg>
          </div>
        </div>
      </div>

      {/* Hairline Divider */}
      <div className="inspo-card-divider" />

      {/* ─── BOTTOM SECTION: SPLIT 2 COLUMNS ─── */}
      <div className="inspo-card-section inspo-card-section--bottom">
        
        {/* Left Column */}
        <div className="inspo-card-col inspo-card-col--left">
          <div className="inspo-card-label-row">
            <span className="inspo-gold-square" aria-hidden="true" />
            <span className="inspo-card-label">TONS OF CO2 PURCHASED</span>
          </div>
          <div className="inspo-card-col-num">
            {animatedLeftCount.toLocaleString()}
          </div>
        </div>

        {/* Vertical Divider */}
        <div className="inspo-card-col-divider" />

        {/* Right Column */}
        <div className="inspo-card-col inspo-card-col--right">
          <div className="inspo-card-label-row">
            <span className="inspo-gold-square" aria-hidden="true" />
            <span className="inspo-card-label">PROGRESS TO 2050 10 GIGATON GOAL</span>
          </div>
          <div className="inspo-card-col-num">
            0.0510%
          </div>
        </div>

      </div>

    </div>
  );
}
