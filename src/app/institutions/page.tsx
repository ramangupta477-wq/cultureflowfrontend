"use client";

import React, { useMemo, useState } from "react";
import { z } from "zod/v4";
import { saveInstitutionInquiry, type InstitutionInquiry } from "@/lib/appwrite";
import { fieldErrors, showError, PHONE_RE } from "@/lib/formValidation";
import { useBlurReveal } from "@/lib/reveals";
import "../waitlist/waitlist.css";
import "./institutions.css";

const EMPTY: InstitutionInquiry = {
  institutionType: "",
  institutionName: "",
  city: "",
  state: "",
  country: "",
  contactName: "",
  designation: "",
  email: "",
  mobile: "",
  lookingFor: "",
  message: "",
};

/* ─── Zod schema (messages = live field errors) ─── */
const institutionsSchema = z.object({
  institutionType: z.string().trim().min(1, "Select an institution type"),
  institutionName: z.string().trim().min(1, "Please enter the institution name"),
  city: z.string().trim().min(1, "Please enter your city"),
  state: z.string().trim().optional(),
  country: z.string().trim().min(1, "Please enter your country"),
  contactName: z.string().trim().min(1, "Please enter your name"),
  designation: z.string().trim().min(1, "Please enter your designation"),
  email: z.email("Enter a valid email address"),
  mobile: z
    .string()
    .trim()
    .optional()
    .refine((v) => !v || PHONE_RE.test(v), "Enter a valid mobile number (digits, optional +)"),
  lookingFor: z.string().trim().min(1, "Select what you're looking for"),
  message: z.string().trim().max(2000, "Keep it under 2000 characters").optional(),
});

export default function InstitutionsPage() {
  useBlurReveal();
  const [form, setForm] = useState<InstitutionInquiry>(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [attempted, setAttempted] = useState(false);

  const errors = useMemo(() => fieldErrors(institutionsSchema, form), [form]);
  const valid = Object.keys(errors).length === 0;
  const err = (k: string) => showError(errors, k, touched, attempted);

  const set = (key: keyof InstitutionInquiry, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));
  const mark = (k: string) => () => setTouched((t) => ({ ...t, [k]: true }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAttempted(true);
    if (!valid || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      await saveInstitutionInquiry({
        ...form,
        institutionName: form.institutionName.trim(),
        contactName: form.contactName.trim(),
        email: form.email.trim().toLowerCase(),
      });
      setDone(true);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <main className="wl-page">
        <div className="inst-card">
          <h1 className="inst-title">
            Request received. <em>Our team will reach out.</em>
          </h1>
          <p className="inst-sub">
            Thank you — we&rsquo;ve logged {form.institutionName}&rsquo;s
            onboarding request. Someone from Culture Flow will contact you
            within two working days.
          </p>
          <a className="wl-btn wl-btn--next inst-submit" href="/">
            Back to Home
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="wl-page">
      <div className="wl-container inst-container">
        <header className="inst-head">
          <p className="inst-kicker" data-pr>INSTITUTION ONBOARDING</p>
          <h1 className="inst-title" data-pr style={{ "--pr-d": "0.08s" } as React.CSSProperties}>
            Partner with <em>Culture Flow.</em>
          </h1>
          <p className="inst-sub" data-pr style={{ "--pr-d": "0.16s" } as React.CSSProperties}>
            Bring global mobility to your campus — tell us who you are and
            we&rsquo;ll design the onboarding together.
          </p>
        </header>

        <form className="wl-form inst-bento" onSubmit={handleSubmit}>
          {/* ── Row 1 ── */}
          <div className="inst-cell inst-cell--wide" data-pr style={{ "--pr-d": "0.26s" } as React.CSSProperties}>
            <p className="inst-cell-label">The institution</p>
            <div className="inst-pair">
              <label className={`wl-field${err("institutionType") ? " wl-field--invalid" : ""}`}>
                <span>Institution type *</span>
                <select
                  value={form.institutionType}
                  onChange={(e) => set("institutionType", e.target.value)}
                  onBlur={mark("institutionType")}
                  aria-invalid={!!err("institutionType")}
                  required
                >
                  <option value="">Select type…</option>
                  {["University", "College", "School", "EdTech / Organisation", "Other"].map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                {err("institutionType") && <em className="wl-err">{errors.institutionType}</em>}
              </label>
              <label className={`wl-field${err("institutionName") ? " wl-field--invalid" : ""}`}>
                <span>Institution name *</span>
                <input
                  type="text"
                  required
                  value={form.institutionName}
                  onChange={(e) => set("institutionName", e.target.value)}
                  onBlur={mark("institutionName")}
                  aria-invalid={!!err("institutionName")}
                  autoComplete="organization"
                  placeholder="e.g. Delhi University"
                />
                {err("institutionName") && <em className="wl-err">{errors.institutionName}</em>}
              </label>
            </div>
          </div>

          <div className="inst-cell" data-pr style={{ "--pr-d": "0.34s" } as React.CSSProperties}>
            <p className="inst-cell-label">You</p>
            <div className="inst-pair">
              <label className={`wl-field${err("contactName") ? " wl-field--invalid" : ""}`}>
                <span>Your name *</span>
                <input
                  type="text"
                  required
                  value={form.contactName}
                  onChange={(e) => set("contactName", e.target.value)}
                  onBlur={mark("contactName")}
                  aria-invalid={!!err("contactName")}
                  autoComplete="name"
                  placeholder="e.g. Dr. Priya Menon"
                />
                {err("contactName") && <em className="wl-err">{errors.contactName}</em>}
              </label>
              <label className={`wl-field${err("designation") ? " wl-field--invalid" : ""}`}>
                <span>Designation *</span>
                <input
                  type="text"
                  required
                  value={form.designation}
                  onChange={(e) => set("designation", e.target.value)}
                  onBlur={mark("designation")}
                  aria-invalid={!!err("designation")}
                  autoComplete="organization-title"
                  placeholder="e.g. Dean of Intl."
                />
                {err("designation") && <em className="wl-err">{errors.designation}</em>}
              </label>
            </div>
          </div>

          {/* ── Row 2 ── */}
          <div className="inst-cell" data-pr style={{ "--pr-d": "0.42s" } as React.CSSProperties}>
            <p className="inst-cell-label">Where</p>
            <label className={`wl-field${err("city") ? " wl-field--invalid" : ""}`}>
              <span>City *</span>
              <input
                type="text"
                required
                value={form.city}
                onChange={(e) => set("city", e.target.value)}
                onBlur={mark("city")}
                aria-invalid={!!err("city")}
                autoComplete="address-level2"
                placeholder="e.g. New Delhi"
              />
              {err("city") && <em className="wl-err">{errors.city}</em>}
            </label>
            <div className="inst-pair">
              <label className="wl-field">
                <span>State</span>
                <input
                  type="text"
                  value={form.state}
                  onChange={(e) => set("state", e.target.value)}
                  autoComplete="address-level1"
                  placeholder="Delhi"
                />
              </label>
              <label className={`wl-field${err("country") ? " wl-field--invalid" : ""}`}>
                <span>Country *</span>
                <input
                  type="text"
                  required
                  value={form.country}
                  onChange={(e) => set("country", e.target.value)}
                  onBlur={mark("country")}
                  aria-invalid={!!err("country")}
                  autoComplete="country-name"
                  placeholder="e.g. India"
                />
                {err("country") && <em className="wl-err">{errors.country}</em>}
              </label>
            </div>
          </div>

          <div className="inst-cell" data-pr style={{ "--pr-d": "0.5s" } as React.CSSProperties}>
            <p className="inst-cell-label">Direct lines</p>
            <label className={`wl-field${err("email") ? " wl-field--invalid" : ""}`}>
              <span>Email *</span>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                onBlur={mark("email")}
                aria-invalid={!!err("email")}
                autoComplete="email"
                placeholder="you@institution.edu"
              />
              {err("email") && <em className="wl-err">{errors.email}</em>}
            </label>
            <label className={`wl-field${err("mobile") ? " wl-field--invalid" : ""}`}>
              <span>Mobile no.</span>
              <input
                type="tel"
                value={form.mobile}
                onChange={(e) => set("mobile", e.target.value)}
                onBlur={mark("mobile")}
                aria-invalid={!!err("mobile")}
                autoComplete="tel"
                placeholder="+91 98765 43210"
              />
              {err("mobile") && <em className="wl-err">{errors.mobile}</em>}
            </label>
          </div>

          <div className="inst-cell inst-cell--accent" data-pr style={{ "--pr-d": "0.58s" } as React.CSSProperties}>
            <p className="inst-cell-label">What are you looking for? *</p>
            <select
              className="inst-select"
              value={form.lookingFor}
              onChange={(e) => set("lookingFor", e.target.value)}
              onBlur={mark("lookingFor")}
              aria-invalid={!!err("lookingFor")}
              required
            >
              <option value="">Select…</option>
              {[
                "Study abroad pathway",
                "Credit transfer pipeline",
                "Faculty / staff mobility",
                "Recruitment collaboration",
                "Custom program",
                "Other",
              ].map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
            {err("lookingFor") && <em className="wl-err">{errors.lookingFor}</em>}
          </div>

          {/* ── Row 3 ── */}
          <div className="inst-cell inst-cell--full" data-pr style={{ "--pr-d": "0.66s" } as React.CSSProperties}>
            <label className={`wl-field${err("message") ? " wl-field--invalid" : ""}`}>
              <span>Your query / message</span>
              <textarea
                rows={2}
                value={form.message}
                onChange={(e) => set("message", e.target.value)}
                onBlur={mark("message")}
                aria-invalid={!!err("message")}
                placeholder="Goals, timelines, or anything else…"
              />
              {err("message") && <em className="wl-err">{errors.message}</em>}
            </label>
            {error && <p className="wl-error" role="alert">{error}</p>}
            <div className="inst-actions">
              <span className="inst-note">We reply within two working days.</span>
              <button
                type="submit"
                className="wl-btn wl-btn--next inst-submit"
                disabled={submitting}
                suppressHydrationWarning
              >
                {submitting ? "Sending…" : "Submit request →"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
