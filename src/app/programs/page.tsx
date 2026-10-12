"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { PROGRAMS_DATA, type UniversityProgram } from "@/data/programsData";
import Footer from "../homepage/Footer";
import "./programs.css";

export default function ProgramsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeModalProgram, setActiveModalProgram] = useState<UniversityProgram | null>(null);

  // Animated counters for the dashboard metrics
  const [animatedTopCount, setAnimatedTopCount] = useState(0);
  const [animatedLeftCount, setAnimatedLeftCount] = useState(0);

  useEffect(() => {
    // 52,000 counter
    const topTarget = 52000;
    const topDuration = 1800;
    const topStart = performance.now();
    const animateTop = (time: number) => {
      const elapsed = time - topStart;
      const progress = Math.min(elapsed / topDuration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setAnimatedTopCount(Math.round(ease * topTarget));
      if (progress < 1) requestAnimationFrame(animateTop);
    };
    requestAnimationFrame(animateTop);

    // 5,095,938 counter
    const leftTarget = 5095938;
    const leftDuration = 2000;
    const leftStart = performance.now();
    const animateLeft = (time: number) => {
      const elapsed = time - leftStart;
      const progress = Math.min(elapsed / leftDuration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setAnimatedLeftCount(Math.round(ease * leftTarget));
      if (progress < 1) requestAnimationFrame(animateLeft);
    };
    requestAnimationFrame(animateLeft);
  }, []);

  // Filter programs based on category and search query
  const filteredPrograms = useMemo(() => {
    return PROGRAMS_DATA.filter((prog) => {
      const matchesCategory =
        selectedCategory === "all" ||
        prog.disciplines?.includes(selectedCategory) ||
        prog.country.toLowerCase().includes(selectedCategory.toLowerCase());

      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        query === "" ||
        prog.universityName.toLowerCase().includes(query) ||
        prog.titleSerif.toLowerCase().includes(query) ||
        prog.location.toLowerCase().includes(query) ||
        prog.country.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="programs-page-wrapper">
      
      {/* ─── HERO SECTION: Single Big Rectangular Glassmorphic Component on 75% Width ─── */}
      <section className="programs-hero-section">
        <div className="programs-hero-wrapper">
          
          {/* ═══ SINGLE BIG RECTANGULAR GLASSMORPHIC CARD (75% of Hero) ═══ */}
          <div className="single-glass-hero-card">
            
            {/* ─── LEFT HALF: Aesthetic Title + Direct Link ─── */}
            <div className="hero-card-col-left">
              
              {/* Top Micro Label */}
              <div className="hero-card-left-top">
                <div className="inspo-card-label-row">
                  <span className="inspo-gold-square" aria-hidden="true" />
                  <span className="inspo-card-label">CULTURE FLOW · GLOBAL PATHWAYS</span>
                </div>
              </div>

              {/* Middle: Grand Aesthetic Headline (Enlarged, no line below) */}
              <div className="hero-card-left-mid">
                <h1 className="hero-card-title">
                  Explore<br />
                  <span className="hero-card-title-serif">Programs.</span>
                </h1>
              </div>

              {/* Bottom: Minimal Link Row */}
              <div className="hero-card-left-bottom-wrap">
                <div className="hero-card-left-bottom">
                  <span className="hero-minimal-tag">04 PREMIER INSTITUTIONS</span>
                  <a href="#all-programs" className="hero-minimal-arrow-link">
                    <span>View Pathways</span>
                    <span className="hero-arrow">↓</span>
                  </a>
                </div>
              </div>

            </div>

            {/* ─── INTERNAL VERTICAL DIVIDER ─── */}
            <div className="hero-card-v-divider" />

            {/* ─── RIGHT HALF: Dashboard Metrics & Real SVG World Map ─── */}
            <div className="hero-card-col-right">
              
              {/* Top: 52,000 Metric */}
              <div className="inspo-card-section--top">
                <div className="inspo-card-label-row">
                  <span className="inspo-gold-square" aria-hidden="true" />
                  <span className="inspo-card-label">GLOBAL SCHOLARS MOBILIZED WORLDWIDE</span>
                </div>
                <div className="inspo-card-hero-num">
                  {animatedTopCount.toLocaleString()}
                </div>
              </div>

              {/* Hairline Divider */}
              <div className="inspo-card-divider" />

              {/* Middle: World Map with Gold Location Dots */}
              <div className="inspo-card-section--mid">
                <div className="inspo-card-label-row">
                  <span className="inspo-gold-square" aria-hidden="true" />
                  <span className="inspo-card-label">ACCREDITED GLOBAL CAMPUS LOCATIONS</span>
                </div>

                <div className="inspo-map-container">
                  <div className="inspo-map-svg-wrapper">
                    <img
                      src="/homepage_assets/world.svg"
                      alt="World Locations Map"
                      className="inspo-world-svg-img"
                    />
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

                      {/* US East Coast Cluster (Boston / Harvard, NY, DC) */}
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

                      {/* Europe & UK Cluster (Oxford / London, Paris, Munich / TUM) */}
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

                      {/* Australia */}
                      <circle cx="1740" cy="670" r="10" className="inspo-dot" />
                      <circle cx="1710" cy="700" r="9" className="inspo-dot" />
                      <circle cx="1660" cy="650" r="9" className="inspo-dot" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Hairline Divider */}
              <div className="inspo-card-divider" />

              {/* Bottom: 2 Columns */}
              <div className="inspo-card-section--bottom">
                <div className="inspo-card-col inspo-card-col--left">
                  <div className="inspo-card-label-row">
                    <span className="inspo-gold-square" aria-hidden="true" />
                    <span className="inspo-card-label">ACADEMIC TRANSFER CREDITS VALIDATED</span>
                  </div>
                  <div className="inspo-card-col-num">
                    {animatedLeftCount.toLocaleString()}
                  </div>
                </div>

                <div className="inspo-card-col-divider" />

                <div className="inspo-card-col inspo-card-col--right">
                  <div className="inspo-card-label-row">
                    <span className="inspo-gold-square" aria-hidden="true" />
                    <span className="inspo-card-label">VISA & ADMISSIONS SUCCESS RATE</span>
                  </div>
                  <div className="inspo-card-col-num">
                    99.4%
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ─── MINIMAL PROGRAMS SECTION (Below Hero) ─── */}
      <section id="all-programs" className="programs-grid-section">
        <div className="programs-grid-container">
          
          {/* Section Header */}
          <div className="programs-section-header">
            <span className="programs-section-script">Curated Global Excellence</span>
            <h2 className="programs-section-title">
              Accredited International Programs
            </h2>
            <p className="programs-section-subtitle">
              Every pathway guarantees institutional transfer credits, dedicated peer mentorship,
              and full relocation peace of mind.
            </p>
          </div>

          {/* Category Filter Pills & Search */}
          <div className="programs-toolbar">
            <div className="programs-filter-row">
              <button
                className={`programs-filter-pill ${selectedCategory === "all" ? "programs-filter-pill--active" : ""}`}
                onClick={() => setSelectedCategory("all")}
              >
                All Pathways ({PROGRAMS_DATA.length})
              </button>
              <button
                className={`programs-filter-pill ${selectedCategory === "stem-ai" ? "programs-filter-pill--active" : ""}`}
                onClick={() => setSelectedCategory("stem-ai")}
              >
                STEM &amp; AI
              </button>
              <button
                className={`programs-filter-pill ${selectedCategory === "business-leadership" ? "programs-filter-pill--active" : ""}`}
                onClick={() => setSelectedCategory("business-leadership")}
              >
                Business &amp; Leadership
              </button>
              <button
                className={`programs-filter-pill ${selectedCategory === "law-humanities" ? "programs-filter-pill--active" : ""}`}
                onClick={() => setSelectedCategory("law-humanities")}
              >
                Law &amp; Humanities
              </button>
              <button
                className={`programs-filter-pill ${selectedCategory === "venture-innovation" ? "programs-filter-pill--active" : ""}`}
                onClick={() => setSelectedCategory("venture-innovation")}
              >
                Venture &amp; Innovation
              </button>
              <button
                className={`programs-filter-pill ${selectedCategory === "ivy-russell" ? "programs-filter-pill--active" : ""}`}
                onClick={() => setSelectedCategory("ivy-russell")}
              >
                Ivy &amp; Russell Group
              </button>
            </div>

            <div className="programs-search-box">
              <svg className="programs-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search university or field..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="programs-search-input"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="programs-search-clear"
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Programs Cards Grid */}
          <div className="programs-cards-grid">
            {filteredPrograms.map((prog) => (
              <article key={prog.id} className="program-card">
                
                {/* Card Image Banner */}
                <div className="program-card-media">
                  <img
                    src={prog.image}
                    alt={prog.universityName}
                    className="program-card-img"
                  />
                  <div className="program-card-badge">
                    {prog.rankingBadge}
                  </div>
                  <span className="program-card-script-tag">
                    {prog.taglineScript}
                  </span>
                </div>

                {/* Card Content Body */}
                <div className="program-card-body">
                  
                  {/* Location Pin */}
                  <div className="program-card-location">
                    <svg className="program-pin-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                      <circle cx="12" cy="9" r="2.5" />
                    </svg>
                    <span>{prog.location}, {prog.country}</span>
                  </div>

                  {/* University & Title */}
                  <h3 className="program-card-title">
                    <span className="program-card-serif">{prog.titleSerif}</span>
                    <span className="program-card-sub">{prog.titleSub}</span>
                  </h3>
                  <div className="program-card-uni-name">{prog.universityName}</div>

                  {/* Precise Key Specs Chips */}
                  <div className="program-card-chips">
                    <span className="program-chip">
                      <span className="program-chip-label">DURATION:</span> {prog.duration}
                    </span>
                    <span className="program-chip">
                      <span className="program-chip-label">CREDITS:</span> {prog.credits}
                    </span>
                  </div>

                  {/* Card Bottom CTA Row */}
                  <div className="program-card-footer">
                    <button
                      onClick={() => setActiveModalProgram(prog)}
                      className="program-card-details-btn"
                    >
                      View Curriculum &amp; Specs
                    </button>
                    <button
                      onClick={() => setActiveModalProgram(prog)}
                      className="program-card-apply-btn"
                    >
                      Apply ↗
                    </button>
                  </div>

                </div>

              </article>
            ))}
          </div>

          {filteredPrograms.length === 0 && (
            <div className="programs-no-results">
              <p>No programs match your search or filter criteria.</p>
              <button
                onClick={() => {
                  setSelectedCategory("all");
                  setSearchQuery("");
                }}
                className="programs-reset-btn"
              >
                Reset Filters
              </button>
            </div>
          )}

        </div>
      </section>

      {/* ─── ADVISING / CONSULTATION BANNER (Deep Navy Blue Section #contact-advising) ─── */}
      <section id="contact-advising" className="programs-advising-banner">
        <div className="programs-grid-container">
          <div className="advising-card">
            <div className="advising-card-content">
              <span className="advising-kicker">1-ON-1 ADVISORY</span>
              <h2 className="advising-title">
                Not sure which pathway fits your career goals?
              </h2>
              <p className="advising-text">
                Speak directly with a Culture Flow academic mobility advisor. We will review your profile,
                map credit transfers with your home institution, and outline guaranteed accommodation timelines.
              </p>
              <div className="advising-actions">
                <a href="mailto:hello@cultureflow.in?subject=Program%20Advising%20Inquiry" className="advising-cta">
                  Schedule Free Advising Call ↗
                </a>
                <span className="advising-phone-hint">or call us at <strong>+91 123 456 7890</strong></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── MODAL: Program Details Drawer ─── */}
      {activeModalProgram && (
        <div className="program-modal-backdrop" onClick={() => setActiveModalProgram(null)}>
          <div className="program-modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="program-modal-close"
              onClick={() => setActiveModalProgram(null)}
              aria-label="Close modal"
            >
              ✕
            </button>

            <div className="program-modal-header">
              <span className="program-modal-script">{activeModalProgram.taglineScript}</span>
              <h3 className="program-modal-title">
                {activeModalProgram.titleSerif} {activeModalProgram.titleSub}
              </h3>
              <p className="program-modal-uni">
                {activeModalProgram.universityName} · {activeModalProgram.location}, {activeModalProgram.country}
              </p>
              <div className="program-modal-badge">{activeModalProgram.rankingBadge}</div>
            </div>

            <div className="program-modal-body">
              <div className="program-modal-image-wrap">
                <img
                  src={activeModalProgram.image}
                  alt={activeModalProgram.universityName}
                  className="program-modal-img"
                />
              </div>

              <div className="program-modal-section">
                <h4 className="program-modal-section-title">Academic Pathway Overview</h4>
                <p className="program-modal-text">{activeModalProgram.description}</p>
                <p className="program-modal-text">{activeModalProgram.subDescription}</p>
              </div>

              <div className="program-modal-section">
                <h4 className="program-modal-section-title">Logistical Infrastructure</h4>
                <div className="program-modal-specs">
                  <div className="program-modal-spec-item">
                    <span className="spec-label">Duration</span>
                    <span className="spec-value">{activeModalProgram.duration}</span>
                  </div>
                  <div className="program-modal-spec-item">
                    <span className="spec-label">Intake Term</span>
                    <span className="spec-value">{activeModalProgram.intake}</span>
                  </div>
                  <div className="program-modal-spec-item">
                    <span className="spec-label">Credits</span>
                    <span className="spec-value">{activeModalProgram.credits}</span>
                  </div>
                  <div className="program-modal-spec-item">
                    <span className="spec-label">Housing</span>
                    <span className="spec-value">{activeModalProgram.housing}</span>
                  </div>
                  <div className="program-modal-spec-item">
                    <span className="spec-label">Visa Support</span>
                    <span className="spec-value">{activeModalProgram.visaSupport}</span>
                  </div>
                </div>
              </div>

              <div className="program-modal-section">
                <h4 className="program-modal-section-title">Core Pathway Highlights</h4>
                <ul className="program-modal-highlights">
                  {activeModalProgram.features.map((feat, i) => (
                    <li key={i}>
                      <span className="feat-bullet">✦</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="program-modal-footer">
                <a
                  href={`mailto:hello@cultureflow.in?subject=Application%20for%20${encodeURIComponent(activeModalProgram.titleSerif)}`}
                  className="program-modal-apply-btn"
                >
                  Start Application for {activeModalProgram.titleSerif} ↗
                </a>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ─── FOOTER (Exact same as homepage code file) ─── */}
      <Footer />

    </div>
  );
}
