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
  { num: "01", title: "Tech & Innovation", desc: "AI, robotics, and frontier technology - inside the labs, ecosystems, and institutions building what comes next. Silicon Valley. Munich. Singapore." },
  { num: "02", title: "Sustainability & Impact", desc: "Renewable energy, climate policy, and green infrastructure - at the institutions leading the transition. Scandinavia. Northern Europe." },
  { num: "03", title: "Heritage & Culture", desc: "Art, architecture, and living history - at the civilisations, traditions, and institutions that shaped how the world thinks. Europe. Asia. India." },
];

export default function ProgramsPage() {
  const tracksContainerRef = useRef<HTMLDivElement>(null);
  const barsRef = useRef<HTMLDivElement>(null);

  // ─── Blur-up entrance reveals (data-pr) ───
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-pr]"));
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.setAttribute("data-pr-done", ""));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            // attribute survives React className re-renders
            en.target.setAttribute("data-pr-done", "");
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

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

          <span className="pgb-pill" data-pr>Programs</span>
          <h1 className="pgb-title" data-pr style={{ "--pr-d": "0.07s" } as React.CSSProperties}>
            <span className="pgb-title-l1">Three tracks. One framework.</span>{" "}
            <span className="pgb-title-l2">
              Built for scholars who lead what comes <span className="pgb-mark">next.</span>
            </span>
          </h1>

          <div className="pgb-row" data-pr style={{ "--pr-d": "0.15s" } as React.CSSProperties}>
            <p className="pgb-sub">
              Every programme is built on the 40/40/20 curriculum — 40% rigorous
              academics, 40% cultural and industry immersion, 20% structured
              reflection. <strong>One framework. Three directions.</strong>
            </p>
            <Link href="/waitlist" className="pgb-cta">
              Join the waitlist <ArrowUpRight size={15} strokeWidth={1.9} />
            </Link>
          </div>

          <div className="pgb-grid">
            {/* yellow framework cell */}
            <div className="pgb-cell pgb-cell--yellow" data-pr style={{ "--pr-d": "0.28s" } as React.CSSProperties}>
              <span className="pgb-kicker">THE FRAMEWORK</span>
              <div className="pgb-big pgb-big--numeric">40 / 40 / 20</div>
              <div className="pgb-cell-foot">
                <span className="pgb-big-sub">Academics. Immersion. Reflection.</span>
                <a href="#tracks" className="pgb-arrow" aria-label="See tracks">
                  <ArrowUpRight size={24} strokeWidth={2} />
                </a>
              </div>
            </div>

            {/* world map cell */}
            <div className="pgb-cell pgb-cell--map" data-pr style={{ "--pr-d": "0.36s" } as React.CSSProperties}>
              <img
                src="/homepage_assets/world.svg"
                alt=""
                aria-hidden
                className="pgb-world"
              />
              <p className="pgb-map-cap">Global partner institutions — structured immersions, not campus tours.</p>
            </div>

            {/* path cell */}
            <div className="pgb-cell pgb-cell--info" data-pr style={{ "--pr-d": "0.44s" } as React.CSSProperties}>
              <span className="pgb-ico" aria-hidden><RouteIco size={20} strokeWidth={1.7} /></span>
              <p className="pgb-cell-text">
                We start with where you are academically and professionally.{" "}
                <strong>Then we build the programme around where you need
                to go.</strong>
              </p>
              <a href="/#values" className="pgb-mini-cta">
                How It Works <ArrowUpRight size={14} strokeWidth={1.9} />
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
            <p className="tracks-tagline" data-pr>
              Each track is a <em>complete</em> academic immersion — curriculum,
              logistics, <em>safety,</em> and <em>reflection</em> built in from day one.
            </p>
            <span className="tracks-kicker" data-pr style={{ "--pr-d": "0.1s" } as React.CSSProperties}>Our Tracks</span>
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
