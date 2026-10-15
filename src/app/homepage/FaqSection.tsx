"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import "./FaqSection.css";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    id: "faq-1",
    question: "How do I choose the right university and study destination?",
    answer:
      "Our advisors evaluate your academic background, career ambitions, and budget to curate a personalized shortlist of universities and countries that offer the best return on investment and student experience.",
  },
  {
    id: "faq-2",
    question: "What are the visa requirements and how does Culture Flow assist?",
    answer:
      "We guide you through the entire visa application process — from financial documentation and statement preparation to mock interviews, ensuring a stress-free and compliant submission.",
  },
  {
    id: "faq-3",
    question: "Can I apply for international scholarships and financial aid?",
    answer:
      "Yes, absolutely. Over 75% of our students qualify for merit-based or destination-specific scholarships. We help you identify opportunities and craft compelling scholarship essays.",
  },
  {
    id: "faq-4",
    question: "What support do you provide after I arrive in my destination country?",
    answer:
      "Our support doesn't end when your flight lands. We assist with airport pickups, finding student housing, opening local bank accounts, and connecting you with active alumni networks.",
  },
  {
    id: "faq-5",
    question: "How early should I begin my university application process?",
    answer:
      "We recommend starting 8 to 12 months prior to your intended intake. This provides ample time for standardized testing, document verification, university deadlines, and visa processing.",
  },
];

export default function FaqSection() {
  // Card 3 (index 2) open by default to mirror the inspiration screenshot
  const [openIndex, setOpenIndex] = useState<number | null>(2);

  const toggleItem = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section id="faq" className="cf-faq-section" aria-labelledby="faq-heading">
      <div className="cf-faq-container">
        {/* Header without search bar (as requested) */}
        <div className="cf-faq-header">
          <h2 id="faq-heading" className="cf-faq-title">
            FAQ
          </h2>
          <span className="cf-faq-count">[ 05 Questions ]</span>
        </div>

        {/* Accordion Stack */}
        <div className="cf-faq-list" role="region" aria-label="Frequently Asked Questions">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;
            const contentId = `faq-content-${item.id}`;
            const headerId = `faq-header-${item.id}`;

            return (
              <div
                key={item.id}
                className={`cf-faq-card ${isOpen ? "is-open" : ""}`}
              >
                <button
                  id={headerId}
                  type="button"
                  className="cf-faq-trigger"
                  aria-expanded={isOpen}
                  aria-controls={contentId}
                  onClick={() => toggleItem(index)}
                >
                  <span className="cf-faq-question">{item.question}</span>
                  <span
                    className={`cf-faq-chevron ${isOpen ? "is-rotated" : ""}`}
                    aria-hidden="true"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={contentId}
                      role="region"
                      aria-labelledby={headerId}
                      className="cf-faq-answer-wrapper"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{
                        height: "auto",
                        opacity: 1,
                        transition: {
                          height: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
                          opacity: { duration: 0.25, delay: 0.08, ease: "easeOut" },
                        },
                      }}
                      exit={{
                        height: 0,
                        opacity: 0,
                        transition: {
                          height: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
                          opacity: { duration: 0.18, ease: "easeIn" },
                        },
                      }}
                    >
                      <div className="cf-faq-answer-inner">
                        <p className="cf-faq-answer-text">{item.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
