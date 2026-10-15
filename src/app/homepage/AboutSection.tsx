"use client";

import React from "react";
import Image from "next/image";
import "./AboutSection.css";

export default function AboutSection() {
  return (
    <section id="about" className="about-section">
      <div className="about-grid">

        {/* ─── Left Sidebar ─── */}
        <aside className="about-sidebar-left">
          <nav className="about-sidebar-nav">
            <a href="#programs">Programs <span className="arrow">↗</span></a>
            <a href="#destinations">Destinations</a>
            <a href="#approach">Approach</a>
            <a href="#contact">Contact</a>
          </nav>

          <div className="about-sidebar-bottom">
            <span className="about-sidebar-handle">@CultureFlow</span>
            <span className="about-sidebar-subscribe">
              <span className="dot" /> Connect
            </span>
          </div>
        </aside>

        {/* ─── Center Main Content ─── */}
        <div className="about-main">

          {/* Masthead */}
          <h2 className="about-masthead" style={{ color: 'var(--color-yellow, #FFCD00)' }}>About Us</h2>

          {/* Pinned row */}
          <div className="about-pinned-row">
            <span className="about-pinned-label">
              <span className="dot" /> About Us
            </span>
            <span className="about-pinned-date">Est. 2024</span>
          </div>

          {/* Story content */}
          <div className="about-story">
            {/* Left: Image */}
            <div className="about-story-image">
              <Image
                src="/images/about/editorial.jpg"
                alt="University courtyard at golden hour"
                width={600}
                height={450}
                priority
              />
            </div>

            {/* Right: Text */}
            <div className="about-story-text">
              <h3 className="about-story-title">
                Bridging <em>Cultures,</em> Building Futures
              </h3>
              <div className="about-story-meta">
                <span>By Culture Flow</span>
                <span>5 Min Read</span>
              </div>
              <p className="about-story-excerpt">
                Culture Flow connects ambitious students with the world&apos;s leading
                universities, offering expert guidance through every stage of the
                international education journey — from the first conversation to
                arrival on campus and beyond.
              </p>
            </div>
          </div>

          {/* Bottom row */}
          <div className="about-bottom-row">
            <span className="about-issue-number">NO. 01</span>
            <a href="#approach" className="about-see-more">
              <span className="arrow-down">↓</span> See More
            </a>
          </div>

        </div>

        {/* ─── Right Sidebar ─── */}
        <aside className="about-sidebar-right">

          <div className="about-featured-header">
            <span className="about-featured-title">Featured Highlights</span>
            <a href="#values" className="about-featured-see-all">
              <span className="dot" /> See All
            </a>
          </div>

          {/* Article 1 */}
          <article className="about-article">
            <div className="about-article-top">
              <span className="about-article-number">1</span>
              <span className="about-article-date">Global Network</span>
            </div>
            <h4 className="about-article-title">
              200+ University Partnerships Worldwide
            </h4>
            <p className="about-article-excerpt">
              We work with a carefully curated network of universities across
              the UK, Australia, Canada, and Europe — ensuring the right fit
              for every student.
            </p>
          </article>

          {/* Article 2 */}
          <article className="about-article">
            <div className="about-article-top">
              <span className="about-article-number">2</span>
              <span className="about-article-date">Our Mission</span>
            </div>
            <h4 className="about-article-title">
              Student-First Guidance, Every Step
            </h4>
            <p className="about-article-excerpt">
              From visa applications to accommodation support, we handle the
              complexity so students can focus on what matters — their future.
            </p>
          </article>

        </aside>

      </div>
    </section>
  );
}
