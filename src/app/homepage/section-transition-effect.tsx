/**
 * ═══════════════════════════════════════════════════════════════
 *effect 
 * ═══════════════════════════════════════════════════════════════
 *
 *  This file documents the reusable scroll-driven transition
 *  effect used between every section on the ShubhSafar homepage.
 *
 *  EFFECT:  As you scroll down, the next section "swells up"
 *           from the bottom in a smooth elliptical reveal,
 *           covering the previous section like a curtain.
 *
 *  TECH:    GSAP ScrollTrigger + CSS clip-path: ellipse()
 *
 *  HOW IT WORKS:
 *  ─────────────
 *  1. The section has an outer wrapper (<section>) and an
 *     inner wrapper (<div>) that receives the clip-path.
 *
 *  2. On mount, the inner wrapper's clip-path is set to a
 *     CLOSED state — an ellipse pushed far below the viewport:
 *       clip-path: ellipse(220% 200% at 50% 300%)
 *
 *  3. As the user scrolls and the section enters the viewport,
 *     GSAP scrubs the clip-path to an OPEN state:
 *       clip-path: ellipse(220% 200% at 50% 175%)
 *
 *     This makes the ellipse slide upward, gradually revealing
 *     the section content from bottom to top.
 *
 *  4. Optionally, a scale-down EXIT animation can be added so
 *     the current section shrinks/fades as the NEXT section
 *     swells over it.
 *
 * 
 *
 * ═══════════════════════════════════════════════════════════════
 */

"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// ─────────────────────────────────────────────────────
//  EXAMPLE: Minimal section with the ellipse transition
// ─────────────────────────────────────────────────────

export default function ExampleSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    const wrapper = wrapperRef.current;
    if (!section || !wrapper) return;

    // ══════════════════════════════════════════════
    //  STEP 1 — Set initial CLOSED clip-path
    // ══════════════════════════════════════════════
    //  The ellipse center is at 300% vertically,
    //  meaning it starts way below the viewport,
    //  hiding the section entirely.
    gsap.set(wrapper, {
      clipPath: "ellipse(220% 200% at 50% 300%)",
    });

    // ══════════════════════════════════════════════
    //  STEP 2 — Animate to OPEN clip-path on scroll
    // ══════════════════════════════════════════════
    //  As the section scrolls from the bottom of the
    //  viewport ("top bottom") to the top ("top top"),
    //  the ellipse center slides from 300% → 175%,
    //  revealing the section with a smooth swell.
    const entranceAnim = gsap.to(wrapper, {
      clipPath: "ellipse(220% 200% at 50% 175%)",
      scrollTrigger: {
        trigger: section,
        start: "top bottom",   // animation starts when section top hits viewport bottom
        end: "top top",        // animation ends when section top hits viewport top
        scrub: 1,              // ties animation progress to scroll position
      },
    });

    // ══════════════════════════════════════════════
    //  STEP 3 (OPTIONAL) — Exit animation
    // ══════════════════════════════════════════════
    //  As the NEXT section scrolls over this one,
    //  scale this section down and fade it slightly,
    //  creating a "pushed back" parallax feel.
    //
    //  Replace "#next-section-id" with the actual
    //  ID of the section that comes AFTER this one.
    const exitAnim = gsap.to(wrapper, {
      scale: 0.85,
      yPercent: -5,
      opacity: 0.5,
      scrollTrigger: {
        trigger: "#next-section-id",   // ← change this
        start: "top bottom",
        end: "top top",
        scrub: 1,
      },
    });

    // ══════════════════════════════════════════════
    //  Cleanup — kill ScrollTriggers on unmount
    // ══════════════════════════════════════════════
    return () => {
      entranceAnim.scrollTrigger?.kill();
      entranceAnim.kill();
      exitAnim.scrollTrigger?.kill();
      exitAnim.kill();
    };
  }, []);

  return (
    <section ref={sectionRef} className="example-section">
      {/* 
        This wrapper div receives the clip-path.
        It MUST have:
          - will-change: clip-path  (performance)
          - overflow: hidden
          - 100% width and height
      */}
      <div ref={wrapperRef} className="example-wrapper">
        {/* Your section content goes here */}
        <h2>Your Section Content</h2>
      </div>
    </section>
  );
}

/**
 * ═══════════════════════════════════════════════════════════════
 *  REQUIRED CSS (paste into your section's CSS file)
 * ═══════════════════════════════════════════════════════════════
 */

/*

.example-section {
  position: relative;
  width: 100%;
  height: 100vh;
  z-index: 5;
}

.example-wrapper {
  position: relative;
  width: 100%;
  height: 100vh;
  will-change: clip-path;
  overflow: hidden;
}

*/

/**
 * ═══════════════════════════════════════════════════════════════
 *  CLIP-PATH VALUES CHEAT SHEET
 * ═══════════════════════════════════════════════════════════════
 *
 *  ellipse(radiusX radiusY at centerX centerY)
 *
 *  CLOSED (hidden):   ellipse(220% 200% at 50% 300%)
 *    → Ellipse center is at 300% Y, way below viewport
 *    → Section is fully hidden
 *
 *  OPEN (revealed):   ellipse(220% 200% at 50% 175%)
 *    → Ellipse center moves up to 175% Y
 *    → Section is fully visible
 *
 *  The 220% and 200% radii are intentionally oversized
 *  so the ellipse edges are never visible — it looks like
 *  a smooth, organic curtain sweep rather than an oval.
 *
 * ═══════════════════════════════════════════════════════════════
 *  Z-INDEX STACKING ORDER (for reference)
 * ═══════════════════════════════════════════════════════════════
 *
 *  Section that comes LATER in the page should have a
 *  HIGHER z-index so it visually covers the previous one.
 * 
 */
