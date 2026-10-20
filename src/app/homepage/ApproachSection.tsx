"use client";

import React from "react";
import "./ApproachSection.css";

export default function ApproachSection() {
  return (
    <section id="approach" className="approach-section">
      <div className="approach-container">

        {/* Kicker */}
        <div className="approach-kicker">
          <span className="approach-kicker-dot" aria-hidden="true" />
          <span>Our Framework</span>
        </div>

        {/* Main Manifesto Headline */}
        <h2 className="approach-heading">
          Every programme is engineered around one model,
          <br />
          because real transformation requires{" "}
          <span className="approach-accent">precision</span><span className="approach-accent">.</span>
        </h2>

        {/* Editorial Subtitle */}
        <p className="approach-description">
          40% rigorous academics. 40% cultural and industry immersion. 20% structured reflection and synthesis.
          <br />
          A curriculum framework where lectures, exploration, and personal growth don’t compete for time —
          they’re built to compound into one transformative experience.
        </p>

      </div>
    </section>
  );
}
