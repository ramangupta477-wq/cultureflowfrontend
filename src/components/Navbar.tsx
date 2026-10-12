"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import "./Navbar.css";

interface NavbarProps {
  /** Optional override for current page label */
  pageLabel?: string;
}

export default function Navbar({ pageLabel }: NavbarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Compute active page title for the left indicator
  const getPageTitle = () => {
    if (pageLabel) return pageLabel.toUpperCase();
    if (!pathname || pathname === "/") return "HOME";
    if (pathname.startsWith("/programs")) return "PROGRAMS";
    if (pathname.startsWith("/destination")) return "DESTINATION";
    if (pathname.startsWith("/team")) return "TEAM";
    // Default fallback: strip slashes and uppercase
    return pathname.replace(/^\//, "").toUpperCase();
  };

  const activeTitle = getPageTitle();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header className={`cf-navbar ${scrolled ? "cf-navbar--scrolled" : ""}`}>
      <div className="cf-navbar-container">
        
        {/* ─── LEFT: Current Page Name Only (as requested: "only display the name nothing else") ─── */}
        <div className="cf-navbar-col cf-navbar-col--left">
          <span className="cf-navbar-page-title">{activeTitle}</span>
        </div>

        {/* ─── MID: Centered Brand Logo (as requested) ─── */}
        <div className="cf-navbar-col cf-navbar-col--mid">
          <Link href="/" className="cf-navbar-logo-link" aria-label="Culture Flow Home">
            <img
              src="/homepage_assets/Culture Flow logo.svg"
              alt="Culture Flow"
              className="cf-navbar-logo-img"
            />
          </Link>
        </div>

        {/* ─── RIGHT: Navigation Links (Programs, Destination, Team, Home) + Pill CTA ─── */}
        <div className="cf-navbar-col cf-navbar-col--right">
          <nav className="cf-navbar-nav" aria-label="Main Navigation">
            <Link
              href="/"
              className={`cf-nav-link ${pathname === "/" ? "cf-nav-link--active" : ""}`}
            >
              HOME
            </Link>
            <Link
              href="/programs"
              className={`cf-nav-link ${pathname.startsWith("/programs") ? "cf-nav-link--active" : ""}`}
            >
              PROGRAMS
            </Link>
            <Link
              href="/programs#destinations"
              className={`cf-nav-link ${pathname.includes("#destinations") ? "cf-nav-link--active" : ""}`}
            >
              DESTINATION
            </Link>
            <Link
              href="/#team"
              className={`cf-nav-link ${pathname.includes("#team") ? "cf-nav-link--active" : ""}`}
            >
              TEAM
            </Link>
          </nav>

          {/* Pill Action Button matching inspiration */}
          <Link href="/programs#contact-advising" className="cf-nav-cta-pill">
            <span>Let&apos;s talk</span>
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
              href="/programs"
              onClick={() => setMobileMenuOpen(false)}
              className={`cf-mobile-link ${pathname.startsWith("/programs") ? "cf-mobile-link--active" : ""}`}
            >
              <span className="cf-mobile-link-num">02</span>
              <span>PROGRAMS</span>
            </Link>
            <Link
              href="/programs#destinations"
              onClick={() => setMobileMenuOpen(false)}
              className="cf-mobile-link"
            >
              <span className="cf-mobile-link-num">03</span>
              <span>DESTINATION</span>
            </Link>
            <Link
              href="/#team"
              onClick={() => setMobileMenuOpen(false)}
              className="cf-mobile-link"
            >
              <span className="cf-mobile-link-num">04</span>
              <span>TEAM</span>
            </Link>
          </div>

          <div className="cf-mobile-drawer-bottom">
            <Link
              href="/programs#contact-advising"
              onClick={() => setMobileMenuOpen(false)}
              className="cf-mobile-cta"
            >
              Schedule Consultation ↗
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
