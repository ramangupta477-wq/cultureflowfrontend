"use client";

import React, { useRef, useEffect, useLayoutEffect } from "react";
import Link from "next/link";
import Footer from "../homepage/Footer";
import RollingPolygon from "./RollingPolygon";
import ProgramsShowcase from "./ProgramsShowcase";
import { ArrowUpRight, Route as RouteIco } from "lucide-react";
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

      {/* ═══ HERO — bento ═══ */}
      <section className="programs-hero-section">
        <div className="programs-hero-container">

          <span className="pgb-pill">Programs</span>
          <h1 className="pgb-title">
            Built for people who <span className="pgb-mark">see&nbsp;further.</span>
          </h1>

          <div className="pgb-row">
            <p className="pgb-sub">
              Research, leadership, deep-tech — three tracks designed for
              three ambitions. <strong>One platform, full circle.</strong>
            </p>
            <Link href="/waitlist" className="pgb-cta">
              Join the waitlist <ArrowUpRight size={15} strokeWidth={1.9} />
            </Link>
          </div>

          <div className="pgb-grid">
            {/* yellow tracks cell */}
            <div className="pgb-cell pgb-cell--yellow">
              <span className="pgb-kicker">THREE TRACKS</span>
              <div className="pgb-tags">
                <span className="pgb-tag pgb-tag--dark">Tech &amp; Innovation</span>
                <span className="pgb-tag">Sustainability</span>
                <span className="pgb-tag">Cultural</span>
              </div>
              <div className="pgb-cell-foot">
                <span className="pgb-big">Any direction</span>
                <a href="#tracks" className="pgb-arrow" aria-label="See tracks">
                  <ArrowUpRight size={24} strokeWidth={2} />
                </a>
              </div>
            </div>

            {/* world map cell */}
            <div className="pgb-cell pgb-cell--map">
              <img
                src="/homepage_assets/world.svg"
                alt=""
                aria-hidden
                className="pgb-world"
              />
              <p className="pgb-map-cap">One semester, one platform — campuses across three continents.</p>
            </div>

            {/* path cell */}
            <div className="pgb-cell pgb-cell--info">
              <span className="pgb-ico" aria-hidden><RouteIco size={20} strokeWidth={1.7} /></span>
              <p className="pgb-cell-text">
                First, we understand where you are academically and
                professionally. <strong>Then we map the clearest path to
                where you need to be.</strong>
              </p>
              <a href="#tracks" className="pgb-mini-cta">
                How the tracks work <ArrowUpRight size={14} strokeWidth={1.9} />
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* ─── COMBINED: Polygon Canvas + Track Bars (shared scroll container) ─── */}
      <div ref={tracksContainerRef} className="tracks-scroll-container" id="tracks">
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
                <span className="track-num">{track.num}</span>
                <div className="track-bar-content">
                  <h3 className="track-title">{track.title}</h3>
                  <p className="track-desc">{track.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── PROGRAMS SHOWCASE: scroll-pinned photo fly-through ─── */}
      <ProgramsShowcase />

      {/* ─── FOOTER ─── */}
      <Footer />

    </div>
  );
}
