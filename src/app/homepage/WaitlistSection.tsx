"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import "./WaitlistSection.css";

// Dynamically import AdmitOneTicket to ensure WebGL loads strictly on client
const AdmitOneTicket = dynamic(() => import("@/components/ui/admit-one-ticket"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        width: "100%",
        maxWidth: 560,
        height: 320,
        background: "rgba(5, 10, 48, 0.6)",
        borderRadius: 20,
        border: "1px dashed rgba(200, 156, 102, 0.4)",
        display: "grid",
        placeItems: "center",
        color: "rgba(253, 252, 244, 0.5)",
        fontFamily: "var(--font-body)",
        fontSize: "0.85rem",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
      }}
    >
      Loading Priority Pass...
    </div>
  ),
});

const CULTURE_FLOW_TICKET_TEXTURE = {
  engine: "generative",
  colorBack: "#050A30",
  colorFront: "#C89C66",
  colorHighlight: "#F6EEDD",
  shape: "warp",
  type: "4x4",
  size: 1.2,
  colorSteps: 4,
  originalColors: false,
  scale: 1.45,
  rotation: 20,
  offsetX: 0,
  offsetY: 0,
  speed: 0.35,
};

const CULTURE_FLOW_TICKET_LAYOUT = {
  padding: 57 / 741,
  labelTop: 54 / 741,
  labelSize: 17 / 741,
  labelLead: 24 / 741,
  labelTracking: 0.05,
  nameTop: 180 / 741,
  nameSize: 56 / 741,
  nameLead: 58 / 741,
  nameTracking: -0.01,
  footerTop: 348 / 741,
  footerSize: 18 / 741,
  footerTracking: 0.04,
  stubSize: 60 / 741,
  stubTracking: 0.05,
  stubOpacity: 0.9,
  watermarkSize: 110 / 741,
  watermarkOpacity: 0.7,
  watermarkColor: "#C89C66",
  inkColor: "#F6EEDD",
};

export default function WaitlistSection() {
  const [ticketWidth, setTicketWidth] = useState(560);

  useEffect(() => {
    function handleResize() {
      if (typeof window === "undefined") return;
      const vw = window.innerWidth;
      if (vw < 480) {
        setTicketWidth(Math.max(300, vw - 48));
      } else if (vw < 768) {
        setTicketWidth(Math.min(480, vw - 64));
      } else if (vw < 1200) {
        setTicketWidth(500);
      } else {
        setTicketWidth(560);
      }
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section className="cf-waitlist-section" id="waitlist-card">
      <div className="cf-waitlist-bg-glow" aria-hidden="true" />

      <div className="cf-waitlist-container">
        {/* Left Column: Heading, Value Proposition & CTA */}
        <div className="cf-waitlist-content">

          <h2 className="cf-waitlist-heading">
            Claim Your <em>Priority Pass</em> to Global Academic Mobility
          </h2>

          <p className="cf-waitlist-desc">
            Direct institutional partnerships with Oxford, Harvard, TUM Munich, and NUS Singapore.
            Join the waitlist to unlock fast-track admissions, merit grant considerations, and an exclusive referral pass.
          </p>

          <div className="cf-waitlist-perks">
            <div className="cf-waitlist-perk">
              <span className="cf-waitlist-perk-icon">✓</span>
              <span>Guaranteed priority screening for international university cohorts</span>
            </div>
            <div className="cf-waitlist-perk">
              <span className="cf-waitlist-perk-icon">✓</span>
              <span>Personalized track matching (Tech & Innovation, Sustainability, Cultural)</span>
            </div>
            <div className="cf-waitlist-perk">
              <span className="cf-waitlist-perk-icon">✓</span>
              <span>Unique referral code to fast-track your cohort placement</span>
            </div>
          </div>

          <div className="cf-waitlist-actions">
            <Link href="/waitlist" className="cf-waitlist-btn">
              <span>Join the Waitlist</span>
              <span className="cf-waitlist-btn-arrow">→</span>
            </Link>
            <span className="cf-waitlist-note">Takes 60 seconds · No upfront fees</span>
          </div>
        </div>

        {/* Right Column: Live Interactive 3D Dithered Pass */}
        <div className="cf-waitlist-ticket-wrap">
          <div className="cf-ticket-scale-box">
            <AdmitOneTicket
              name="YOUR NAME HERE"
              presenter="CULTURE FLOW · GLOBAL MOBILITY"
              event="PRIORITY ADMIT PASS 2026/2027"
              venue="OXFORD · HARVARD · TUM · NUS"
              dates="GLOBAL COHORT"
              stubText="ADMIT ONE"
              watermark="CF-2026"
              width={ticketWidth}
              texture={CULTURE_FLOW_TICKET_TEXTURE}
              layout={CULTURE_FLOW_TICKET_LAYOUT}
              tilt={{ maxTilt: 14, glare: 0.22, scale: 1.03 }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
