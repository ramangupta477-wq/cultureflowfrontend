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

  // Compute active page title for the left indicator
  const getPageTitle = () => {
    if (pageLabel) return pageLabel.toUpperCase();
    if (!pathname || pathname === "/") return "HOME";
    if (pathname.includes("about")) return "ABOUT US";
    if (pathname.startsWith("/programs")) return "PROGRAMS";
    if (pathname.startsWith("/destination")) return "DESTINATION";
    // Default fallback: strip slashes and uppercase
    return pathname.replace(/^\//, "").toUpperCase();
  };

  const activeTitle = getPageTitle();

  // Determine if logo should be yellow (on About Us page or explicitly requested)
  const isAbout = pathname?.includes("about") || pageLabel?.toLowerCase().includes("about");
  const isYellowLogo = logoTheme === "yellow" || (logoTheme === "auto" && isAbout);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 20);
      // Hide on scroll down past 100px, show on scroll up
      const dy = y - lastYRef.current;
      lastYRef.current = y;
      if (mobileMenuOpen) {
        setHidden(false);
      } else if (y < 100 || dy < -2) {
        setHidden(false);
      } else if (dy > 2) {
        setHidden(true);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [mobileMenuOpen]);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header className={`cf-navbar ${scrolled ? "cf-navbar--scrolled" : ""} ${hidden ? "cf-navbar--hidden" : ""}`}>
      <div className="cf-navbar-container">
        
        {/* ─── LEFT: Culture Flow Logo at Top Left Corner ─── */}
        <div className="cf-navbar-col cf-navbar-col--left">
          <Link href="/" className="cf-navbar-logo-link" aria-label="Culture Flow Home">
            <img
              src="/homepage_assets/Culture Flow logo.svg"
              alt="Culture Flow"
              className={`cf-navbar-logo-img ${isYellowLogo ? "cf-navbar-logo-img--yellow" : ""}`}
            />
          </Link>
        </div>

        {/* ─── RIGHT: Navigation Links + Pill CTA ─── */}
        <div className="cf-navbar-col cf-navbar-col--right">
          <nav className="cf-navbar-nav" aria-label="Main Navigation">
            <Link
              href="/"
              className={`cf-nav-link ${pathname === "/" ? "cf-nav-link--active" : ""}`}
            >
              HOME
            </Link>
            <Link
              href="/about-us"
              className={`cf-nav-link ${pathname.includes("about") ? "cf-nav-link--active" : ""}`}
            >
              ABOUT US
            </Link>
            <Link
              href="/programs"
              className={`cf-nav-link ${pathname.startsWith("/programs") ? "cf-nav-link--active" : ""}`}
            >
              PROGRAMS
            </Link>
            <Link
              href="/safety"
              className={`cf-nav-link ${pathname.startsWith("/safety") ? "cf-nav-link--active" : ""}`}
            >
              SAFETY & TRUST
            </Link>
          </nav>

          {/* Pill Action Button */}
          <Link href="/waitlist" className="cf-nav-cta-pill">
            <span>Join Waitlist</span>
          </Link>

          {/* Mobile Menu Toggle Button */}
          <button
            className={`cf-nav-hamburger ${mobileMenuOpen ? "cf-nav-hamburger--open" : ""}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            aria-expanded={mobileMenuOpen}
          >
            <span className="cf-hamburger-bar" />
            <span className="cf-hamburger-bar" />
          </button>
        </div>
      </div>

      {/* ─── MOBILE DRAWER MENU ─── */}
      <div className={`cf-mobile-drawer ${mobileMenuOpen ? "cf-mobile-drawer--open" : ""}`}>
        <div className="cf-mobile-drawer-inner">
          <div className="cf-mobile-current-page">
            <span className="cf-navbar-page-title">{activeTitle}</span>
          </div>

          <div className="cf-mobile-nav-links">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`cf-mobile-link ${pathname === "/" ? "cf-mobile-link--active" : ""}`}
            >
              <span className="cf-mobile-link-num">01</span>
              <span>HOME</span>
            </Link>
            <Link
              href="/about-us"
              onClick={() => setMobileMenuOpen(false)}
              className={`cf-mobile-link ${pathname.includes("about") ? "cf-mobile-link--active" : ""}`}
            >
              <span className="cf-mobile-link-num">02</span>
              <span>ABOUT US</span>
            </Link>
            <Link
              href="/programs"
              onClick={() => setMobileMenuOpen(false)}
              className={`cf-mobile-link ${pathname.startsWith("/programs") ? "cf-mobile-link--active" : ""}`}
            >
              <span className="cf-mobile-link-num">03</span>
              <span>PROGRAMS</span>
            </Link>
            <Link
              href="/safety"
              onClick={() => setMobileMenuOpen(false)}
              className="cf-mobile-link"
            >
              <span className="cf-mobile-link-num">04</span>
              <span>SAFETY & TRUST</span>
            </Link>
          </div>

          <div className="cf-mobile-drawer-bottom">
            <Link
              href="/waitlist"
              onClick={() => setMobileMenuOpen(false)}
              className="cf-mobile-cta"
            >
              Join Waitlist ↗
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
