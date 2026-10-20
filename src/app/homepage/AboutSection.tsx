"use client";

import React from "react";
import "./AboutSection.css";

const NAV_ITEMS = [
  { num: "01", label: "The 40/40/20 Curriculum Model" },
  { num: "02", label: "3 Academic Immersion Tracks" },
  { num: "03", label: "Global Partner Institution Network" },
  { num: "04", label: "Institutional-Grade Safety" },
  { num: "05", label: "End-to-End Programme Execution" },
  { num: "06", label: "Est. 2026, New Delhi" },
];

export default function AboutSection() {
  return (
    <section id="about" className="about-section">
      <div className="about-grid">

        {/* ─── Left Sidebar ─── */}
        <aside className="about-sidebar-left">
          <nav className="about-sidebar-nav">
            {NAV_ITEMS.map(({ num, label }) => (
              <div key={num} className="about-nav-item">
                <span className="about-nav-num">{num}</span>
                <span className="about-nav-label">{label}</span>
              </div>
            ))}
          </nav>

        </aside>

        {/* ─── Center Main Content ─── */}
        <div className="about-main">

          {/* Masthead */}
          <h2 className="about-masthead" style={{ color: 'var(--color-yellow, #FFCD00)' }}>About Us</h2>

          {/* Pinned row — single label only */}
          <div className="about-pinned-row">
            <span className="about-pinned-label">
              <span className="dot" /> Est. 2026
            </span>
          </div>

          {/* Story content */}
          <div className="about-story about-story--text-only">
            <div className="about-story-text">
              <h3 className="about-story-title">
                The Story Behind the <em>Mission</em>
              </h3>
              <p className="about-story-excerpt">
                We started with one belief: ambition alone shouldn&apos;t determine who
                gets global exposure — access should; not someday, not after years of
                saving, but now. That&apos;s why Culture Flow exists. To give scholars the
                structured international experience, genuine academic depth, and global
                perspective that transforms not just careers — but how they see the
                world and their place in it.
              </p>
            </div>
          </div>

          {/* Bottom row — pulled up */}
          <div className="about-bottom-row about-bottom-row--tight">
            <span className="about-issue-number">NO. 01</span>
            <a href="#values" className="about-see-more">
              <span className="arrow-down">↓</span> See More
            </a>
          </div>

        </div>

        {/* ─── Right Sidebar ─── */}
        <aside className="about-sidebar-right">

          {/* Article 1 */}
          <article className="about-article">
            <span className="about-article-number">NO. 02</span>
            <h4 className="about-article-title">Mission &amp; Vision</h4>
            <p className="about-article-subtitle">What We&apos;re Building.</p>
            <p className="about-article-excerpt">
              &ldquo;To give every ambitious scholar access to the global academic experience
              that shapes how they think, lead, and see the world — until that&apos;s no
              longer the exception, but the expectation.&rdquo;
            </p>
          </article>

          {/* Article 2 */}
          <article className="about-article">
            <span className="about-article-number">NO. 03</span>
            <h4 className="about-article-title">Why Culture Flow</h4>
            <p className="about-article-subtitle">What Sets Us Apart.</p>
            <p className="about-article-excerpt">
              &ldquo;Every detail is intentional. Culture Flow is built from the ground up —
              structured short-term academic immersions with institutional rigour at the
              core, a purpose-built curriculum driving every programme, and safety
              infrastructure that leaves nothing to assumption.&rdquo;
            </p>
          </article>

        </aside>

      </div>
    </section>
  );
}
