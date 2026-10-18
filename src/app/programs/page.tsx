"use client";

import React, { useRef, useLayoutEffect } from "react";
import Footer from "../homepage/Footer";
import RollingPolygon from "./RollingPolygon";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./programs.css";

gsap.registerPlugin(ScrollTrigger);

const TRACKS = [
  { num: "01", title: "Tech & Innovation", desc: "AI, deep-tech, and venture labs across Silicon Valley, Munich, and Singapore." },
  { num: "02", title: "Sustainability", desc: "Climate policy, ESG frameworks, and green-economy research at leading European institutions." },
  { num: "03", title: "Cultural", desc: "Heritage studies, creative industries, and cross-cultural leadership in Oxford and beyond." },
];

export default function ProgramsPage() {
  const tracksContainerRef = useRef<HTMLDivElement>(null);
  const barsRef = useRef<HTMLDivElement>(null);

  // Cards rise y:400→0, no opacity — scrubbed to the shared scroll container
  useLayoutEffect(() => {
    const container = tracksContainerRef.current;
    const el = barsRef.current;
    if (!container || !el) return;
    const bars = el.querySelectorAll(".track-bar");
    if (!bars.length) return;

    gsap.set(bars, { y: 400 });

    gsap.to(bars, {
      y: 0,
      stagger: 0.12,
      ease: "none",
      scrollTrigger: {
        trigger: container,
        start: "top 30%",
        end: "bottom 90%",
        scrub: 0.5,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === container) t.kill();
      });
    };
  }, []);

  return (
    <div className="programs-page-wrapper">

      {/* ─── HERO SECTION: Editorial Text Grid ─── */}
      <section className="programs-hero-section">
        <div className="programs-hero-container">

          <div className="programs-hero-grid">
            <h1 className="programs-hero-heading">
              Programs built for people who see further.{" "}
              <em>One semester abroad changes everything.</em>
            </h1>
            <div className="programs-hero-image-block">
              <img
                src="/homepage_assets/world.svg"
                alt="Global campus network"
                className="programs-hero-map"
              />
            </div>
            <p className="programs-hero-text">
              Research, leadership, deep-tech — three tracks designed for
              three ambitions. <em>One platform, full circle.</em>
            </p>
            <p className="programs-hero-text">
              First, we understand where you are academically and
              professionally. <em>Then we map the clearest path to where
              you need to be.</em>
            </p>
          </div>
        </div>
      </section>

      {/* ─── COMBINED: Polygon Canvas + Track Bars (shared scroll container) ─── */}
      <div ref={tracksContainerRef} className="tracks-scroll-container">
        <div className="tracks-sticky">
          <RollingPolygon containerRef={tracksContainerRef} />
          <div className="tracks-header">
            <p className="tracks-tagline">
              The road can get <em>bumpy.</em> We keep you <em>rolling</em> regardless.
            </p>
            <span className="tracks-kicker">Our Tracks</span>
          </div>
          <div className="tracks-bars" ref={barsRef}>
            {TRACKS.map((track) => (
              <div
                key={track.num}
                className={`track-bar track-bar--${track.num}`}
              >
                <div className="track-bar-content">
                  <span className="track-num">{track.num}</span>
                  <h3 className="track-title">{track.title}</h3>
                  <p className="track-desc">{track.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── FOOTER ─── */}
      <Footer />

    </div>
  );
}
