"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Skiper49 from "@/components/ui/skiper49";
import BlurText from "@/components/ui/BlurText";
import "./ProgramScope.css";

const SCOPE_STEPS = [
  {
    stepNumber: "01",
    tag: "02 — PROGRAMME SCOPE",
    heading: "Academic pathways designed for global impact.",
    description:
      "From high-table collegiate tutorials to frontier artificial intelligence laboratories, each pathway unites institutional prestige with comprehensive relocation care—giving ambitious scholars the clarity and infrastructure to excel worldwide.",
  },
  {
    stepNumber: "02",
    tag: "02 — PROGRAMME SCOPE",
    heading: "Frontier research mapped to individual ambitions.",
    description:
      "We architect bespoke transitions into the world's most distinguished faculties. Scholars gain direct access to proprietary research labs, faculty mentorship, and international academic credit frameworks.",
  },
  {
    stepNumber: "03",
    tag: "02 — PROGRAMME SCOPE",
    heading: "Seamless mobility from application to arrival.",
    description:
      "Relocation without friction. From expedited visa processing and guaranteed collegiate housing to 24/7 on-ground concierge support, scholars focus purely on their intellectual frontiers.",
  },
];

export default function ProgramScope() {
  const sectionRef = useRef<HTMLElement>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [hasEntered, setHasEntered] = useState(false);

  // Detect when the section enters the viewport to trigger initial BlurText
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasEntered(true);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Scroll listener to smoothly map scroll progress across the 3 steps
  useEffect(() => {
    const onScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowH = window.innerHeight;
      const totalDist = rect.height - windowH;
      if (totalDist <= 0) return;

      const scrolled = -rect.top;
      const progress = Math.min(Math.max(scrolled / totalDist, 0), 1);

      let step = 0;
      if (progress < 0.35) {
        step = 0;
      } else if (progress < 0.70) {
        step = 1;
      } else {
        step = 2;
      }

      setCurrentStep((prev) => (prev !== step ? step : prev));
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // User click on pagination bullet / step button
  const handleStepSelect = useCallback((index: number) => {
    setCurrentStep(index);
    if (sectionRef.current) {
      const rect = sectionRef.current.getBoundingClientRect();
      const totalDist = rect.height - window.innerHeight;
      if (totalDist > 0) {
        const targetProgress = index === 0 ? 0.12 : index === 1 ? 0.52 : 0.88;
        const targetScrollY = window.scrollY + rect.top + targetProgress * totalDist;
        window.scrollTo({ top: targetScrollY, behavior: "smooth" });
      }
    }
  }, []);

  const step = SCOPE_STEPS[currentStep];

  return (
    <section ref={sectionRef} className="cf-scope-section" id="program-scope">
      <div className="cf-scope-sticky">
        <div className="cf-scope-container">
          
          {/* ─── LEFT: Exact Same Image Component (3 Cards, Controlled Step) ─── */}
          <div className="cf-scope-left">
            <Skiper49
              activeStep={currentStep}
              onStepChange={handleStepSelect}
            />
          </div>

          {/* ─── RIGHT: Content Changing on Scroll with BlurText & Fade Out ─── */}
          <div className="cf-scope-right">
            {/* Kicker with Fade Animation */}
            <div className="cf-scope-kicker-wrapper">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="cf-scope-kicker"
                >
                  <span className="cf-scope-kicker-dot" aria-hidden="true" />
                  <span>{step.tag}</span>
                  <span className="cf-scope-kicker-step">
                    [{step.stepNumber}/03]
                  </span>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Heading animated with React Bits <BlurText /> */}
            <div className="cf-scope-heading-wrapper">
              <BlurText
                key={currentStep}
                text={step.heading}
                effect="blur"
                animateBy="words"
                direction="top"
                staggerFrom="start"
                trigger={hasEntered ? "load" : "view"}
                delay={60}
                stepDuration={0.32}
                blur={10}
                distance={32}
                className="cf-scope-heading"
              />
            </div>

            {/* Description animated with Fade Out / Fade In */}
            <div className="cf-scope-desc-wrapper">
              <AnimatePresence mode="wait">
                <motion.p
                  key={currentStep}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="cf-scope-description"
                >
                  {step.description}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Swiss Step Selector */}
            <div className="cf-scope-stepper">
              {SCOPE_STEPS.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleStepSelect(idx)}
                  className={`cf-scope-step-btn ${
                    idx === currentStep ? "cf-scope-step-btn--active" : ""
                  }`}
                  aria-label={`Switch to step ${idx + 1}`}
                >
                  <span className="cf-scope-step-line" />
                  <span>0{idx + 1}</span>
                </button>
              ))}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}

