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

  const getPageTitle = () => {
    if (pageLabel) return pageLabel.toUpperCase();
    if (!pathname || pathname === "/") return "HOME";
    if (pathname.includes("about")) return "ABOUT US";
    if (pathname.startsWith("/programs")) return "PROGRAMS";
    return pathname.replace(/^\//, "").toUpperCase();
  };

  const activeTitle = getPageTitle();
  const isYellowLogo = logoTheme === "yellow";

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
    { href: "/institutions", label: "Onboard with us", active: pathname.startsWith("/institutions") },
  ];

  return (
    <header className={`cf-navbar ${scrolled ? "cf-navbar--scrolled" : ""} ${hidden ? "cf-navbar--hidden" : ""}`}>
      {/* ── Floating white pill (media-harbour pattern) ── */}
      <div className="cf-navbar-bar">
        <div className="cf-navbar-bar-inner">

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
                className={`cf-nav-link ${l.active ? "cf-nav-link--active" : ""}`}
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

      {/* Scroll dot under the pill (HMH detail) */}
      <span className="cf-navbar-dot" aria-hidden />

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
