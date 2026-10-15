"use client";

import React from "react";
import { ArrowDown } from "lucide-react";
import "./ApproachSection.css";

export default function ApproachSection() {
  const scrollToValues = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const valuesEl = document.getElementById("values");
    if (valuesEl) {
      valuesEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="approach" className="approach-section">
      <div className="approach-container">
        
        {/* Kicker */}
        <div className="approach-kicker">
          <span className="approach-kicker-dot" aria-hidden="true" />
          <span>03 — OUR APPROACH</span>
        </div>

        {/* Main Manifesto Headline */}
        <h2 className="approach-heading">
          At Culture Flow, we connect people to the world’s universities, with{" "}
          <span className="approach-accent">care</span> at the centre of every decision.
        </h2>

        {/* Editorial Subtitle */}
        <p className="approach-description">
          Because learning isn’t just about where you go. It’s the people you meet,
          the questions you ask, and the perspective you bring home.
        </p>

        {/* Action Button */}
        <div className="approach-actions">
          <a
            className="approach-button"
            href="#values"
            onClick={scrollToValues}
          >
            <span>What guides us</span>
            <span className="approach-button-icon" aria-hidden="true">
              <ArrowDown size={14} />
            </span>
          </a>
        </div>

      </div>
    </section>
  );
}
