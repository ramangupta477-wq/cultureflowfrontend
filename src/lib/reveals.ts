"use client";

import { useEffect } from "react";

/**
 * Blur-up entrance reveals: elements tagged `data-pr` fade/blur in when they
 * enter the viewport, staggered by the inline CSS var `--pr-d`.
 * CSS lives wherever `[data-pr]` rules are imported (waitlist.css / programs.css).
 */
export function useBlurReveal() {
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
            // attribute, not class — React class re-renders must not wipe it
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
}
