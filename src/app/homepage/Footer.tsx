"use client";

import React, { useState } from "react";
import Link from "next/link";
import { z } from "zod/v4";
import { saveFooterContact } from "@/lib/appwrite";
import { fieldErrors } from "@/lib/formValidation";
import "./Footer.css";

const footerSchema = z.object({
  name: z.string().trim().min(1, "Please tell us your name."),
  email: z.email("That email doesn't look right."),
  phone: z
    .string()
    .trim()
    .refine((v) => v === "" || /^\+?\d[\d\s()-]{5,18}$/.test(v), "Digits, spaces and + only — 6 to 19 chars."),
  institution: z.string().trim().max(256),
  message: z.string().trim().min(1, "A short message helps us reply faster."),
});

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
  const [form, setForm] = useState({ name: "", email: "", phone: "", institution: "", message: "" });
  const [attempted, setAttempted] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [serverError, setServerError] = useState("");

  const errors = fieldErrors(footerSchema, form);
  const err = (key: string) =>
    (touched[key] || attempted) && errors[key] ? (
      <em className="cf-footer-err">{errors[key]}</em>
    ) : null;
  const set = (key: string, v: string) => setForm((f) => ({ ...f, [key]: v }));
  const blur = (key: string) => setTouched((t) => ({ ...t, [key]: true }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (Object.keys(errors).length > 0 || status === "sending") {
      setAttempted(true);
      return;
    }
    setStatus("sending");
    try {
      await saveFooterContact({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        institution: form.institution.trim() || undefined,
        message: form.message.trim(),
      });
      setStatus("sent");
    } catch {
      setServerError("Could not send right now — try again or email info@cultureflow.in.");
      setStatus("error");
    }
  }

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
                New Ashok Nagar,<br />
                East Delhi, 110096
              </p>
              <span className="cf-footer-arrow-link">
                New Delhi Office
                <ArrowIcon />
              </span>
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
              </div>
            </div>
          </div>
        </div>

        {/* ─── RIGHT SIDE: Contact Form ─── */}
        <div className="cf-footer-right">
          <span className="cf-footer-form-label">GET IN TOUCH</span>

          <form className="cf-footer-form" onSubmit={handleSubmit} noValidate>
            <div className="cf-footer-form-row">
              <input
                type="text"
                className={`cf-footer-input ${err("name") ? "cf-footer-input--invalid" : ""}`}
                placeholder="Your Name*"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                onBlur={() => blur("name")}
              />
              <input
                type="email"
                className={`cf-footer-input ${err("email") ? "cf-footer-input--invalid" : ""}`}
                placeholder="Your Email*"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                onBlur={() => blur("email")}
              />
            </div>
            {err("name")}
            {err("email")}
            <div className="cf-footer-form-row">
              <input
                type="tel"
                className={`cf-footer-input ${err("phone") ? "cf-footer-input--invalid" : ""}`}
                placeholder="Phone Number"
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                onBlur={() => blur("phone")}
              />
              <input
                type="text"
                className={`cf-footer-input ${err("institution") ? "cf-footer-input--invalid" : ""}`}
                placeholder="Institution / School"
                value={form.institution}
                onChange={(e) => set("institution", e.target.value)}
                onBlur={() => blur("institution")}
              />
            </div>
            {err("phone")}
            <textarea
              className={`cf-footer-textarea ${err("message") ? "cf-footer-input--invalid" : ""}`}
              placeholder="Message*"
              rows={2}
              value={form.message}
              onChange={(e) => set("message", e.target.value)}
              onBlur={() => blur("message")}
            />
            {err("message")}

            <div className="cf-footer-form-bottom">
              <button type="submit" className="cf-footer-send-btn" disabled={status === "sending"}>
                {status === "sending" ? "Sending…" : status === "sent" ? "Message sent ✓" : "Send Message"}
                <ArrowIcon />
              </button>
              {status === "error" && <span className="cf-footer-err">{serverError}</span>}
              {status === "sent" && <span className="cf-footer-ok">Thanks — we&rsquo;ll reply at {form.email}.</span>}
            </div>
          </form>
        </div>
      </div>

      {/* ═══ BOTTOM BAR ═══ */}
      <div className="cf-footer-bottom">
        <div className="cf-footer-bottom-left">
          <Link href="/privacy-policy">PRIVACY</Link> / <Link href="/terms">TERMS</Link> / <Link href="/refund-policy">REFUND POLICY</Link> / <Link href="/disclaimer">DISCLAIMER</Link>
        </div>

        <nav className="cf-footer-bottom-nav">
          <Link href="/programs">PROGRAMS</Link>
          <Link href="/about-us">ABOUT</Link>
          <Link href="/safety">SAFETY</Link>
          <Link href="/institutions">ONBOARD</Link>
        </nav>

        <div className="cf-footer-bottom-brand">
          One Step. <em>New Future.</em>
        </div>
      </div>

      {/* ═══ LEGAL BAR ═══ */}
      <div className="cf-footer-legal">
        <span className="cf-footer-legal-text">
          Culture Flow Private Limited | CIN: U85500DL2026PTC471392 | Registered Office: New Ashok Nagar, East Delhi, 110096, India
        </span>
        <span className="cf-footer-copyright">
          © 2026 Culture Flow Private Limited
        </span>
      </div>
    </footer>
  );
}
