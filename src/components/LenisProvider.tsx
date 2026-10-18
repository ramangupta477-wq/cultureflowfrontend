"use client";

import React, { useEffect } from "react";
import { ReactLenis, useLenis } from "lenis/react";
import "lenis/dist/lenis.css";

/**
 * Intercepts internal anchor links (e.g. #waitlist, #faq, #safety)
 * to ensure Lenis handles the scroll trajectory with silky easing.
 */
function LenisAnchorHandler() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      // Handle in-page hash links (e.g. "#waitlist", "/#waitlist" if on home)
      const isHashLink = href.startsWith("#") && href.length > 1;
      const isCurrentPageHash =
        href.startsWith("/#") &&
        typeof window !== "undefined" &&
        (window.location.pathname === "/" || window.location.pathname === "");

      if (isHashLink || isCurrentPageHash) {
        const targetId = href.replace(/^\/?#/, "");
        const targetElement = document.getElementById(targetId) || document.querySelector(`[name="${targetId}"]`);
        if (targetElement) {
          e.preventDefault();
          lenis.scrollTo(targetElement as HTMLElement, {
            offset: -60,
            duration: 1.2,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          });
        }
      }
    };

    document.addEventListener("click", handleAnchorClick, { capture: true });
    return () => document.removeEventListener("click", handleAnchorClick, { capture: true });
  }, [lenis]);

  return null;
}

export default function LenisProvider({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.08,
        duration: 1.2,
        smoothWheel: true,
        wheelMultiplier: 1.0,
        touchMultiplier: 1.2,
        infinite: false,
      }}
    >
      <LenisAnchorHandler />
      {children}
    </ReactLenis>
  );
}
