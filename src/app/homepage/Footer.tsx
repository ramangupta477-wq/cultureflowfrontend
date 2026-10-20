"use client";

import React from "react";
import Link from "next/link";
import "./Footer.css";

/* ─── Reusable Arrow Circle ─── */
function ArrowIcon() {
  return (
    <span className="cf-footer-arrow-circle">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="7" y1="17" x2="17" y2="7" />
        <polyline points="7 7 17 7 17 17" />
      </svg>
    </span>
  );
}

export default function Footer() {
  return (
    <footer id="waitlist" className="cf-footer">
      <div id="contact" style={{ position: "absolute", top: "-80px" }} />
      {/* Full background image */}
      <div className="cf-footer-bg">
        <img
          src="/homepage_assets/footer-bg.jpg"
          alt=""
          className="cf-footer-bg-img"
        />
      </div>

      {/* ═══ MAIN CONTENT ═══ */}
      <div className="cf-footer-main">

        {/* ─── LEFT SIDE ─── */}
        <div className="cf-footer-left">

          {/* Address columns */}
          <div className="cf-footer-addresses">
            <div className="cf-footer-address-block">
              <span className="cf-footer-label">HEAD OFFICE</span>
              <p className="cf-footer-address-text">
                H No. B-71/B, G/F, Block-B,<br />
                New Ashok Nagar,<br />
                East Delhi, 110096
              </p>
              <a href="https://www.google.com/maps/search/?api=1&query=Block-B+New+Ashok+Nagar+East+Delhi+110096" target="_blank" rel="noreferrer" className="cf-footer-arrow-link">
                New Delhi Office
                <ArrowIcon />
              </a>
            </div>

            <div className="cf-footer-address-block">
              <span className="cf-footer-label">MUMBAI OFFICE</span>
              <p className="cf-footer-address-text">
                14 Linking Road,<br />
                Bandra West,<br />
                Mumbai, 400050
              </p>
              <a href="https://www.google.com/maps/search/?api=1&query=14+Linking+Road+Bandra+West+Mumbai+400050" target="_blank" rel="noreferrer" className="cf-footer-arrow-link">
                Mumbai Office
                <ArrowIcon />
              </a>
            </div>
          </div>

          {/* Contact + Connect row */}
          <div className="cf-footer-contact-row">
            <div className="cf-footer-contact-block">
              <span className="cf-footer-label">CONTACT</span>
              <a href="mailto:info@cultureflow.in" className="cf-footer-contact-link">
                info@cultureflow.in
              </a>
              <a href="https://wa.me/917123445690" target="_blank" rel="noreferrer" className="cf-footer-contact-link">
                +91 71234 45690
              </a>
              <Link href="/waitlist" className="cf-footer-arrow-link" style={{ marginTop: 12 }}>
                Join the Waitlist
                <ArrowIcon />
              </Link>
            </div>

            <div className="cf-footer-contact-block">
              <span className="cf-footer-label">CONNECT</span>
              <div className="cf-footer-social-list">
                <a href="#" className="cf-footer-social-link">LinkedIn</a>
                <a href="#" className="cf-footer-social-link">Instagram</a>
                <a href="#" className="cf-footer-social-link">Twitter</a>
                <a href="#" className="cf-footer-social-link">YouTube</a>
                <a href="#" className="cf-footer-social-link">Facebook</a>
              </div>
            </div>
          </div>
        </div>

        {/* ─── RIGHT SIDE: Contact Form ─── */}
        <div className="cf-footer-right">
          <span className="cf-footer-form-label">GET IN TOUCH</span>

          <form className="cf-footer-form" onSubmit={(e) => e.preventDefault()}>
            <div className="cf-footer-form-row">
              <input
                type="text"
                className="cf-footer-input"
                placeholder="Your Name*"
                required
              />
              <input
                type="email"
                className="cf-footer-input"
                placeholder="Your Email*"
                required
              />
            </div>
            <div className="cf-footer-form-row">
              <input
                type="tel"
                className="cf-footer-input"
                placeholder="Phone Number"
              />
              <input
                type="text"
                className="cf-footer-input"
                placeholder="Institution / School"
              />
            </div>
            <textarea
              className="cf-footer-textarea"
              placeholder="Message*"
              rows={2}
              required
            />

            <div className="cf-footer-form-bottom">
              <button type="submit" className="cf-footer-send-btn">
                Send Message
                <ArrowIcon />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ═══ BOTTOM BAR ═══ */}
      <div className="cf-footer-bottom">
        <div className="cf-footer-bottom-left">
          <Link href="/privacy-policy">PRIVACY</Link> / <a href="#">COOKIES POLICY</a>
        </div>

        <nav className="cf-footer-bottom-nav">
          <Link href="/programs">PROGRAMS</Link>
          <Link href="/about-us">ABOUT</Link>
          <Link href="/safety">SAFETY</Link>
          <Link href="/institutions">ONBOARD</Link>
          <Link href="/waitlist">CONTACT</Link>
        </nav>

        <div className="cf-footer-bottom-brand">
          One Step. <em>New Future.</em>
        </div>
      </div>

      {/* ═══ LEGAL BAR ═══ */}
      <div className="cf-footer-legal">
        <span className="cf-footer-legal-text">
          Culture Flow Private Limited | CIN: U85500DL2026PTC471392 | Registered Office: H No. B-71/B, G/F, Block-B, New Ashok Nagar, East Delhi, 110096, India
        </span>
        <span className="cf-footer-credit">
          Crafted with precision by <strong>Shrish</strong>
        </span>
        <span className="cf-footer-copyright">
          © 2026 Culture Flow Private Limited
        </span>
      </div>
    </footer>
  );
}
