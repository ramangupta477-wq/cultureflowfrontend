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
    question: "What is a Culture Flow immersion?",
    answer:
      "A structured short-term academic programme at our global partner institutions — built on the 40/40/20 curriculum model. 40% rigorous academics, 40% cultural and industry immersion, 20% structured reflection. Not a tour. Not a semester exchange. A focused academic experience designed to forge global leaders.",
  },
  {
    id: "faq-2",
    question: "Who can apply?",
    answer:
      "Ambitious school and university scholars across India. Whether through an institutional partnership or as an individual applicant, if you have the drive to learn beyond the classroom, there's a track for you.",
  },
  {
    id: "faq-3",
    question: "What does the programme include?",
    answer:
      "Everything. Flights, visa processing, accommodation, meals, local transport, insurance, academic programme fees, and 24/7 on-ground support. Scholars and families don't manage logistics — we do.",
  },
  {
    id: "faq-4",
    question: "How does Culture Flow ensure scholar safety?",
    answer:
      "Safety is non-negotiable. Every programme includes comprehensive medical and travel insurance, vetted partner institutions, structured chaperone support, a mandatory code of conduct, and 24/7 on-ground concierge. Parents receive full documentation including consent and indemnity frameworks before departure.",
  },
  {
    id: "faq-5",
    question: "What do scholars receive after the programme?",
    answer:
      "A certificate of completion, structured post-programme reflection, and the global perspective, academic depth, and career clarity that come from a genuine international immersion — not just a stamp on a passport.",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

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

        <p className="cf-faq-contact">
          Have a different question? Write to us at{" "}
          <a href="mailto:info@cultureflow.in">info@cultureflow.in</a> — we&apos;re happy to help.
        </p>
      </div>
    </section>
  );
}
