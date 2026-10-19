"use client";

import React, { useState } from "react";
import { saveInstitutionInquiry, type InstitutionInquiry } from "@/lib/appwrite";
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

export default function InstitutionsPage() {
  const [form, setForm] = useState<InstitutionInquiry>(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const valid =
    form.institutionType &&
    form.institutionName.trim() &&
    form.city.trim() &&
    form.country.trim() &&
    form.contactName.trim() &&
    form.designation.trim() &&
    /.+@.+\..+/.test(form.email) &&
    form.lookingFor;

  const set = (key: keyof InstitutionInquiry, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
          <p className="inst-kicker">INSTITUTION ONBOARDING</p>
          <h1 className="inst-title">
            Partner with <em>Culture Flow.</em>
          </h1>
          <p className="inst-sub">
            Bring global mobility to your campus. Tell us about your
            institution and we&rsquo;ll design the onboarding together.
          </p>
        </header>

        <form className="wl-form" onSubmit={handleSubmit}>
          <label className="wl-field">
            <span>Institution type *</span>
            <select
              value={form.institutionType}
              onChange={(e) => set("institutionType", e.target.value)}
              required
            >
              <option value="">Select type…</option>
              {["University", "College", "School", "EdTech / Organisation", "Other"].map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </label>

          <div className="wl-row">
            <label className="wl-field">
              <span>Institution name *</span>
              <input
                type="text"
                required
                value={form.institutionName}
                onChange={(e) => set("institutionName", e.target.value)}
                autoComplete="organization"
                placeholder="e.g. Delhi University"
              />
            </label>
            <label className="wl-field">
              <span>City *</span>
              <input
                type="text"
                required
                value={form.city}
                onChange={(e) => set("city", e.target.value)}
                autoComplete="address-level2"
                placeholder="e.g. New Delhi"
              />
            </label>
          </div>

          <div className="wl-row">
            <label className="wl-field">
              <span>State</span>
              <input
                type="text"
                value={form.state}
                onChange={(e) => set("state", e.target.value)}
                autoComplete="address-level1"
                placeholder="e.g. Delhi"
              />
            </label>
            <label className="wl-field">
              <span>Country *</span>
              <input
                type="text"
                required
                value={form.country}
                onChange={(e) => set("country", e.target.value)}
                autoComplete="country-name"
                placeholder="e.g. India"
              />
            </label>
          </div>

          <div className="wl-row">
            <label className="wl-field">
              <span>Your name *</span>
              <input
                type="text"
                required
                value={form.contactName}
                onChange={(e) => set("contactName", e.target.value)}
                autoComplete="name"
                placeholder="e.g. Dr. Priya Menon"
              />
            </label>
            <label className="wl-field">
              <span>Designation *</span>
              <input
                type="text"
                required
                value={form.designation}
                onChange={(e) => set("designation", e.target.value)}
                autoComplete="organization-title"
                placeholder="e.g. Dean of International Affairs"
              />
            </label>
          </div>

          <div className="wl-row">
            <label className="wl-field">
              <span>Email *</span>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                autoComplete="email"
                placeholder="you@institution.edu"
              />
            </label>
            <label className="wl-field">
              <span>Mobile no.</span>
              <input
                type="tel"
                value={form.mobile}
                onChange={(e) => set("mobile", e.target.value)}
                autoComplete="tel"
                placeholder="+91 98765 43210"
              />
            </label>
          </div>

          <label className="wl-field">
            <span>What are you looking for? *</span>
            <select
              value={form.lookingFor}
              onChange={(e) => set("lookingFor", e.target.value)}
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
          </label>

          <label className="wl-field">
            <span>Your query / message</span>
            <textarea
              rows={5}
              value={form.message}
              onChange={(e) => set("message", e.target.value)}
              placeholder="Tell us about your goals, timelines, or anything else…"
            />
          </label>

          {error && <p className="wl-error" role="alert">{error}</p>}

          <button
            type="submit"
            className="wl-btn wl-btn--next inst-submit"
            disabled={!valid}
            suppressHydrationWarning
          >
            {submitting ? "Sending…" : "Submit request →"}
          </button>
        </form>
      </div>
    </main>
  );
}
