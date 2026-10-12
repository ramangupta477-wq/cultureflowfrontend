"use client";

import React, { useEffect, useRef, useState } from "react";
import "./StatsSection.css";

interface StatItem {
  id: string;
  prefix?: string;
  value: number;
  suffix?: string;
  unit?: string;
  label: string;
}

const STATS_DATA: StatItem[] = [
  {
    id: "hours-saved",
    prefix: "+",
    value: 65,
    unit: "h",
    label: "Saved per student on visa & relocation paperwork",
  },
  {
    id: "adoption-rate",
    prefix: "+",
    value: 85,
    unit: "%",
    label: "Adoption & completion across global mobility cohorts",
  },
  {
    id: "global-partners",
    prefix: "+",
    value: 23,
    label: "Partner universities across 12+ international hubs",
  },
  {
    id: "roi-acceleration",
    prefix: "+",
    value: 4,
    suffix: "x",
    unit: "ROI",
    label: "In the first year of global campus transition",
  },
  {
    id: "seamless-transition",
    value: 90,
    unit: "%",
    label: "Report seamless cultural integration & zero relocation friction",
  },
];

interface StatCardProps {
  stat: StatItem;
  index: number;
  isVisible: boolean;
}

function StatCard({ stat, index, isVisible }: StatCardProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    // Slight staggered delay for counter start matching the bottom-to-top card arrival
    const delayTimer = setTimeout(() => {
      let startTime: number | null = null;
      let frameId: number;
      const duration = 1900; // Smooth 1.9s count up

      const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Smooth cubic ease-out for a snappy launch and graceful landing
        const ease = 1 - Math.pow(1 - progress, 3);
        const currentCount = Math.round(ease * stat.value);

        setDisplayValue(currentCount);

        if (progress < 1) {
          frameId = requestAnimationFrame(step);
        } else {
          setDisplayValue(stat.value);
        }
      };

      frameId = requestAnimationFrame(step);

      return () => cancelAnimationFrame(frameId);
    }, 120 + index * 90);

    return () => clearTimeout(delayTimer);
  }, [isVisible, stat.value, index]);

  return (
    <div
      className={`cf-stats-card ${isVisible ? "cf-stats-card--visible" : ""}`}
      style={{
        transitionDelay: `${0.12 + index * 0.09}s`,
      }}
    >
      <div className="cf-stats-card__top">
        <div className="cf-stats-card__number-wrap">
          {stat.prefix && (
            <span className="cf-stats-card__prefix">{stat.prefix}</span>
          )}
          <span className="cf-stats-card__value">{displayValue}</span>
          {stat.suffix && (
            <span className="cf-stats-card__suffix">{stat.suffix}</span>
          )}
          {stat.unit && (
            <span className="cf-stats-card__unit">{stat.unit}</span>
          )}
        </div>
      </div>
      <p className="cf-stats-card__label">{stat.label}</p>
    </div>
  );
}

export default function StatsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Once animated, keep visible
          observer.disconnect();
        }
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="cf-stats-section">
      <div className="cf-stats-container">
        {/* Section Heading */}
        <div
          className={`cf-stats-header ${
            isVisible ? "cf-stats-header--visible" : ""
          }`}
        >
          <h2 className="cf-stats-title">
            Trusted by exceptional students at the world&apos;s top universities
            and institutions
          </h2>
        </div>

        {/* 5 Stats Cards Grid */}
        <div className="cf-stats-grid">
          {STATS_DATA.map((stat, index) => (
            <StatCard
              key={stat.id}
              stat={stat}
              index={index}
              isVisible={isVisible}
            />
          ))}
        </div>

        {/* Bottom Trust Line */}
        <div
          className={`cf-stats-footer ${
            isVisible ? "cf-stats-footer--visible" : ""
          }`}
        >
          <p className="cf-stats-footer__text">
            Trusted by the world&apos;s top universities and global student cohorts
          </p>
        </div>
      </div>
    </section>
  );
}
