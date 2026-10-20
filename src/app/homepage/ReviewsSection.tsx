"use client";

import React, { useEffect, useRef, useState } from "react";
import { REVIEWS_DATA, type Review } from "@/data/reviewsData";
import "./ReviewsSection.css";

/* ────────────────────────────────────────────────────────────
   ReviewCard — single Facebook-style recommendation card
   ──────────────────────────────────────────────────────────── */
function ReviewCard({ review, delay }: { review: Review; delay: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delay);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={cardRef}
      className="cf-review-card"
      data-visible={visible ? "true" : "false"}
    >
      {/* Speech bubble tail */}
      <div className="cf-review-card-tail" />

      {/* Three-dot menu */}
      <span className="cf-review-dots" aria-hidden="true">⋯</span>

      {/* Header: avatar + name recommends + date */}
      <div className="cf-review-card-header">
        <div className="cf-review-avatar">
          <span className="cf-review-avatar-letter">
            {review.name.charAt(0)}
          </span>
        </div>
        <div className="cf-review-meta">
          <div className="cf-review-name-line">
            <strong className="cf-review-name">{review.name}</strong>
            {review.isRecommendation && (
              <>
                {" "}
                <svg className="cf-review-rec-icon" width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <rect x="2" y="2" width="20" height="20" rx="4" fill="#C89C66" />
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="#fff" />
                </svg>
                {" recommends "}
                <strong className="cf-review-rec-brand">Culture Flow</strong>.
              </>
            )}
          </div>
          <span className="cf-review-date">
            {review.date} ·{" "}
            <svg className="cf-review-globe" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
            </svg>
          </span>
        </div>
      </div>

      {/* Review text */}
      <p className="cf-review-text">{review.text}</p>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   ReviewsSection — main export
   ──────────────────────────────────────────────────────────── */
export default function ReviewsSection() {
  // Split reviews into 3 columns
  const columns: Review[][] = [[], [], []];
  REVIEWS_DATA.forEach((review) => {
    columns[review.column].push(review);
  });

  return (
    <section className="cf-reviews-section">
      {/* Watermark behind cards */}
      <div className="cf-reviews-watermark" aria-hidden="true">
        <span>Kind Words From Our</span>
        <span>Successful Students</span>
      </div>

      {/* Section heading */}
      <div className="cf-reviews-header">
        <h2 className="cf-reviews-heading">
          Kind Words From Our{" "}
          <em>Successful Students</em>
        </h2>
        <p className="cf-reviews-subtitle">
          Real experiences from students who trusted Culture Flow with their future.
        </p>
      </div>

      {/* 3-Column Masonry */}
      <div className="cf-reviews-masonry">
        {columns.map((col, colIdx) => (
          <div className="cf-reviews-column" key={colIdx}>
            {col.map((review, cardIdx) => (
              <ReviewCard
                key={review.id}
                review={review}
                delay={colIdx * 100 + cardIdx * 150}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Bottom fade */}
      <div className="cf-reviews-bottom-fade" />
    </section>
  );
}
