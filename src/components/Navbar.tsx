"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import "./Navbar.css";

interface NavbarProps {
  /** Optional override for current page label */
  pageLabel?: string;
  /** Explicit logo color theme: 'yellow' | 'black' | 'auto' */
  logoTheme?: "yellow" | "black" | "auto";
}

export default function Navbar({ pageLabel, logoTheme = "auto" }: NavbarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastYRef = useRef(0);
  const barInnerRef = useRef<HTMLDivElement>(null);
  const [gooey, setGooey] = useState<{ left: number; width: number; ok: boolean }>({ left: 0, width: 0, ok: false });
  const [pillSquash, setPillSquash] = useState(false);

  // ── Gooey pill positioning: finds the yellow-pill link (Onboard / active page)
  useEffect(() => {
    const place = (animate: boolean) => {
      const inner = barInnerRef.current;
      if (!inner) return;
      const target =
        inner.querySelector<HTMLElement>(".cf-nav-link--onboard") ??
        inner.querySelector<HTMLElement>(".cf-nav-link--active");
      if (!target) { setGooey((g) => ({ ...g, ok: false })); return; }
      const ir = inner.getBoundingClientRect();
      const tr = target.getBoundingClientRect();
      if (tr.width === 0) { setGooey((g) => ({ ...g, ok: false })); return; } // links hidden (mobile nav)
      setGooey({ left: tr.left - ir.left, width: tr.width, ok: true });
      // first placement snaps; subsequent ones glide with a jelly squash
      const pill = inner.querySelector<HTMLElement>(".cf-nav-gooey-pill");
      if (pill && animate) pill.style.transition = "left 0.55s cubic-bezier(0.34, 1.4, 0.64, 1), width 0.55s cubic-bezier(0.34, 1.4, 0.64, 1)";
      if (animate) {
        setPillSquash(true);
        setTimeout(() => setPillSquash(false), 640);
      }
    };
    place(false);
    const t = setTimeout(() => place(true), 60); // re-place after fonts settle
    window.addEventListener("resize", () => place(false));
    if (document.fonts?.ready) document.fonts.ready.then(() => place(false));
    return () => clearTimeout(t);
  }, [pathname]);

  const getPageTitle = () => {
    if (pageLabel) return pageLabel.toUpperCase();
    if (!pathname || pathname === "/") return "HOME";
    if (pathname.includes("about")) return "ABOUT US";
    if (pathname.startsWith("/programs")) return "PROGRAMS";
    return pathname.replace(/^\//, "").toUpperCase();
  };

  const activeTitle = getPageTitle();
  const isYellowLogo = logoTheme === "yellow";
  const gooeyStyle: React.CSSProperties = {
    left: gooey.left,
    width: gooey.width,
    opacity: gooey.ok ? 1 : 0,
  };

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 20);
      const dy = y - lastYRef.current;
      lastYRef.current = y;
      if (mobileMenuOpen) setHidden(false);
      else if (y < 100 || dy < -2) setHidden(false);
      else if (dy > 2) setHidden(true);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [mobileMenuOpen]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const links = [
    { href: "/", label: "Home", active: pathname === "/" },
    { href: "/about-us", label: "About us", active: pathname.includes("about") },
    { href: "/programs", label: "Programs", active: pathname.startsWith("/programs") },
    { href: "/safety", label: "Safety & Trust", active: pathname.startsWith("/safety") },
    { href: "/institutions", label: "Onboard with us", active: pathname.startsWith("/institutions"), always: true },
  ];

  return (
    <header className={`cf-navbar ${scrolled ? "cf-navbar--scrolled" : ""} ${hidden ? "cf-navbar--hidden" : ""}`}>
      {/* ── Floating white pill (media-harbour pattern) ── */}
      <div className="cf-navbar-bar">
        <div className="cf-navbar-bar-inner" ref={barInnerRef}>
          <span
            className={`cf-nav-gooey-pill ${pillSquash ? "cf-nav-gooey-pill--squash" : ""}`}
            aria-hidden
            style={gooeyStyle}
          />

          {/* LEFT: logo */}
          <Link href="/" className="cf-navbar-logo-link" aria-label="Culture Flow Home">
            <img
              src="/homepage_assets/Culture Flow logo.svg"
              alt="Culture Flow"
              className={`cf-navbar-logo-img ${isYellowLogo ? "cf-navbar-logo-img--yellow" : ""}`}
            />
          </Link>

          {/* SPACER: pushes menu right-of-center, like .hmh-top-panel-spacer */}
          <div className="cf-navbar-spacer" aria-hidden />

          {/* RIGHT: links + CTA + burger */}
          <nav className="cf-navbar-nav" aria-label="Main Navigation">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`cf-nav-link ${l.active ? "cf-nav-link--active" : ""} ${"always" in l && l.always ? "cf-nav-link--onboard" : ""}`}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <Link href="/waitlist" className="cf-nav-cta-pill">
            <span>Join Waitlist</span>
          </Link>

          <button
            className={`cf-nav-hamburger ${mobileMenuOpen ? "cf-nav-hamburger--open" : ""}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            aria-expanded={mobileMenuOpen}
          >
            <span className="cf-hamburger-bar" />
            <span className="cf-hamburger-bar" />
            <span className="cf-hamburger-bar" />
          </button>
        </div>
      </div>

      {/* ── Dropdown menu panel ── */}
      <div className={`cf-mobile-drawer ${mobileMenuOpen ? "cf-mobile-drawer--open" : ""}`}>
        <div className="cf-mobile-drawer-inner">
          <div className="cf-mobile-current-page">
            <span className="cf-navbar-page-title">{activeTitle}</span>
          </div>

          <div className="cf-mobile-nav-links">
            {links.map((l, i) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`cf-mobile-link ${l.active ? "cf-mobile-link--active" : ""}`}
              >
                <span className="cf-mobile-link-num">0{i + 1}</span>
                <span>{l.label}</span>
              </Link>
            ))}
          </div>

          <div className="cf-mobile-drawer-bottom">
            <Link href="/waitlist" onClick={() => setMobileMenuOpen(false)} className="cf-mobile-cta">
              Join Waitlist ↗
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
