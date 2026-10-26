"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { z } from "zod/v4";
import { playShutterSound } from "@/components/ui/admit-one-ticket";
import { fieldErrors, showError, tenDigitPhone } from "@/lib/formValidation";
import { useBlurReveal } from "@/lib/reveals";
import Footer from "../homepage/Footer";
import {
  creditReferrer,
  findWaitlistEntry,
  joinWaitlist,
  type TrackId,
  type WaitlistEntry,
  type WaitlistRole,
} from "../../lib/appwrite";
import "./waitlist.css";

const AdmitOneTicket = dynamic(() => import("@/components/ui/admit-one-ticket"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        width: "100%",
        maxWidth: 540,
        height: 310,
        borderRadius: 20,
        background: "rgba(5, 10, 48, 0.6)",
        border: "1px dashed rgba(200, 156, 102, 0.4)",
        display: "grid",
        placeItems: "center",
        color: "rgba(253, 252, 244, 0.6)",
        fontSize: "0.85rem",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
      }}
    >
      Generating Your Priority Pass...
    </div>
  ),
});

const WAITLIST_TICKET_TEXTURE = {
  engine: "generative" as const,
  colorBack: "#1B1B1B",
  colorFront: "#C89C66",
  colorHighlight: "#F6EEDD",
  shape: "warp" as const,
  type: "4x4" as const,
  size: 1.2,
  colorSteps: 4,
  originalColors: false,
  scale: 1.45,
  rotation: 20,
  offsetX: 0,
  offsetY: 0,
  speed: 0.35,
};

const WAITLIST_TICKET_LAYOUT = {
  padding: 57 / 741,
  labelTop: 54 / 741,
  labelSize: 17 / 741,
  labelLead: 24 / 741,
  labelTracking: 0.05,
  nameTop: 180 / 741,
  nameSize: 56 / 741,
  nameLead: 58 / 741,
  nameTracking: -0.01,
  footerTop: 348 / 741,
  footerSize: 18 / 741,
  footerTracking: 0.04,
  stubSize: 60 / 741,
  stubTracking: 0.05,
  stubOpacity: 0.9,
  watermarkSize: 110 / 741,
  watermarkOpacity: 0.75,
  watermarkColor: "#C89C66",
  inkColor: "#F6EEDD",
};

/* ─── Zod schemas ─── */
const step1Schema = z.object({
  fullName: z.string().trim().min(1, "Please enter your full name"),
  email: z.email("Enter a valid email address"),
  city: z.string().trim().min(1, "Please enter your city"),
  phone: z
    .string()
    .trim()
    .refine((v) => !!tenDigitPhone(v), "Enter a 10-digit mobile number after +91"),
});

const step2Schema = z.object({
  consent: z.literal(true, {
    message: "Please accept the Terms and Conditions to continue",
  }),
});

const TRACKS: { id: TrackId; label: string }[] = [
  { id: "tech", label: "Tech & Innovation" },
  { id: "sustainability", label: "Sustainability & Social Impact" },
  { id: "cultural", label: "Cultural & Heritage" },
];

const YEAR_OPTIONS: { value: NonNullable<WaitlistEntry["yearOfStudy"]>; label: string }[] = [
  { value: "first", label: "First year" },
  { value: "second", label: "Second year" },
  { value: "third", label: "Third year" },
  { value: "fourth", label: "Fourth year" },
  { value: "postgrad", label: "Postgraduate" },
];

const SOURCE_OPTIONS = [
  { value: "instagram", label: "Instagram" },
  { value: "friend", label: "A friend" },
  { value: "college", label: "My college" },
  { value: "other", label: "Other" },
] as const;

export default function WaitlistPage() {
  // Step 1 fields (identity + role), step 2 fields (context + consent)
  const [step, setStep] = useState<0 | 1 | 2>(1);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "+91 ",
    role: "student" as WaitlistRole,
    city: "",
    college: "",
    yearOfStudy: "",
    tracks: [] as TrackId[],
    source: "",
    consent: false,
  });
  const [copied, setCopied] = useState(false);
  const [createdCode, setCreatedCode] = useState("");
  const [alreadyEnrolled, setAlreadyEnrolled] = useState(false);
  const [ticketWidth, setTicketWidth] = useState(540);

  // Re-scan blur-up targets whenever the step swaps the DOM (picker → 1 → 2)
  useBlurReveal([step, done, copied]);

  useEffect(() => {
    function handleResize() {
      if (typeof window === "undefined") return;
      const vw = window.innerWidth;
      if (vw < 480) {
        setTicketWidth(Math.max(280, vw - 48));
      } else if (vw < 768) {
        setTicketWidth(Math.min(480, vw - 64));
      } else if (vw < 1100) {
        setTicketWidth(540);
      } else {
        setTicketWidth(620);
      }
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // measure the actual centerpiece box — viewport math can't see card padding
  useEffect(() => {
    if (!done) return;
    const box = document.querySelector(".wl-ticket-centerpiece");
    if (!box) return;
    const fit = () => setTicketWidth(Math.max(260, Math.floor(box.clientWidth) - 6));
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(box);
    return () => ro.disconnect();
  }, [done]);

  useEffect(() => {
    if (done) {
      try {
        playShutterSound({ volume: 0.35 });
      } catch {}
    }
  }, [done]);

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const toggleTrack = (id: TrackId) =>
    setForm((f) => ({
      ...f,
      // Appwrite schema: tracks is a string array, max 3 items
      tracks: f.tracks.includes(id)
        ? f.tracks.filter((t) => t !== id)
        : f.tracks.length < 3
          ? [...f.tracks, id]
          : f.tracks,
    }));

  const [touched1, setTouched1] = useState<Record<string, boolean>>({});
  const [touched2, setTouched2] = useState<Record<string, boolean>>({});
  const [attempted1, setAttempted1] = useState(false);
  const [attempted2, setAttempted2] = useState(false);

  const mark1 = (k: string) => () => setTouched1((t) => ({ ...t, [k]: true }));
  const mark2 = (k: string) => () => setTouched2((t) => ({ ...t, [k]: true }));

  const step1Errors = useMemo(() => fieldErrors(step1Schema, form), [form]);
  const step2Errors = useMemo(() => fieldErrors(step2Schema, form), [form]);
  const step1Valid = Object.keys(step1Errors).length === 0;
  const step2Valid = Object.keys(step2Errors).length === 0;

  // Referral captured from the URL (?ref=CODE) — safely captured in useEffect
  // to prevent any SSR/hydration divergence.
  const [refCode, setRefCode] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const code = (new URLSearchParams(window.location.search).get("ref") || "")
      .toUpperCase()
      .replace(/[^A-Z0-9-]/g, "")
      .slice(0, 16);
    if (code) {
      setRefCode(code);
    }
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setAttempted2(true);
    if (!step1Valid || !step2Valid || submitting) return;
    setSubmitting(true);
    setError(null);
    const email = form.email.trim().toLowerCase();
    const phone = form.phone.trim() || undefined;

    // Already on the list? Show their existing pass instead of a duplicate row.
    const existing = await findWaitlistEntry(email, phone);
    if (existing) {
      setForm((f) => ({
        ...f,
        fullName: existing.fullName || f.fullName,
        email: existing.email || f.email,
        role: existing.role || f.role,
        city: existing.city || f.city,
        college: existing.college || f.college,
        yearOfStudy: existing.yearOfStudy || f.yearOfStudy,
        tracks: (existing.tracks as TrackId[]) ?? f.tracks,
      }));
      setCreatedCode(existing.referralCode);
      setAlreadyEnrolled(true);
      setDone(true);
      setSubmitting(false);
      return;
    }

    try {
      const res = await joinWaitlist({
        fullName: form.fullName.trim(),
        email,
        role: form.role,
        city: form.city.trim(),
        consent: true,
        phone,
        college: form.college.trim() || undefined,
        yearOfStudy:
          form.role === "student" && form.yearOfStudy
            ? (form.yearOfStudy as WaitlistEntry["yearOfStudy"])
            : undefined,
        tracks: form.tracks.length ? form.tracks : undefined,
        source: (form.source || undefined) as WaitlistEntry["source"],
        referredBy: refCode,
      });
      setCreatedCode((res as { referralCode?: string }).referralCode ?? "");
      setDone(true);
      // Fire-and-forget: credit the referrer after this signup is stored.
      // Failure here shouldn't block a successful join.
      if (refCode) {
        creditReferrer(refCode).catch(() => {});
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      // Unique index on email/phone — race with another submit. Show their pass.
      if (msg.includes("unique attribute constraint")) {
        const raced = await findWaitlistEntry(email, phone);
        if (raced) {
          setCreatedCode(raced.referralCode);
          setAlreadyEnrolled(true);
          setDone(true);
          return;
        }
        setError("You're already on the list! We'll be in touch soon.");
      } else {
        setError("Something went wrong. Please try again in a moment.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    const trackLabel = form.tracks.length > 0
      ? (TRACKS.find((t) => t.id === form.tracks[0])?.label.toUpperCase() + " TRACK")
      : "GLOBAL MOBILITY PASS";

    const venueInfo = `${form.city.toUpperCase()}${
      form.college ? ` · ${form.college.toUpperCase()}` : " · GLOBAL PATHWAY"
    }`;

    const referralLink = typeof window !== "undefined" && createdCode
      ? `${window.location.origin}/waitlist?ref=${createdCode}`
      : "";

    const copyReferralLink = async () => {
      if (!referralLink) return;
      try {
        await navigator.clipboard.writeText(referralLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // Fallback for blocked clipboard permissions
      }
    };

    return (
      <>
        <main className="wl-page">
        <div className="wl-success-hero">
          <span className="wl-success-kicker">
            {alreadyEnrolled ? "ALREADY ENROLLED · COHORT 2026/2027" : "APPLICATION CONFIRMED · COHORT 2026/2027"}
          </span>
          <h1 className="wl-success-heading">
            {alreadyEnrolled ? "You are already enrolled" : "Priority Admission Pass"}
          </h1>
          <p className="wl-success-subtext">
            {alreadyEnrolled
              ? `Welcome back, ${form.fullName.split(" ")[0]}. You're already on the list — here is your existing referral link.`
              : `Welcome, ${form.fullName.split(" ")[0]}. Your priority pass has been reserved. Share your referral link with peers to advance your admission review.`}
          </p>

          {/* Centered 3D Ticket */}
          <div className="wl-ticket-centerpiece">
            <AdmitOneTicket
              name={form.fullName.trim() || "SCHOLAR APPLICANT"}
              presenter="CULTURE FLOW · GLOBAL MOBILITY"
              event={trackLabel}
              venue={venueInfo}
              dates="COHORT 2026/2027"
              stubText="PRIORITY PASS"
              referralCode={createdCode}
              width={ticketWidth}
              texture={WAITLIST_TICKET_TEXTURE}
              layout={WAITLIST_TICKET_LAYOUT}
              tilt={{ maxTilt: 12, glare: 0.22, scale: 1.02 }}
            />
          </div>

          {/* Referral Code Bar + Copy Action + Go Back Button */}
          <div className="wl-referral-actions-bar">
            {createdCode && (
              <div className="wl-referral-pill-row">
                <span className="wl-referral-label">Referral Code</span>
                <span className="wl-referral-code-display">{createdCode}</span>
                <button
                  type="button"
                  className="wl-copy-btn-primary"
                  onClick={copyReferralLink}
                >
                  {copied ? "Link Copied" : "Copy Referral Link"}
                </button>
              </div>
            )}

            <div className="wl-success-nav-row">
              <Link href="/" className="wl-back-home-btn">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
    );
  }

  return (
    <>
      <main className="wl-page">
      <div className="wl-container">
        {/* Form panel */}
        <section className="wl-form-panel">
          <h1 className="wl-form-heading">Join the waitlist</h1>

          {step === 1 ? (
            <form
              className="wl-form"
              onSubmit={(e) => {
                e.preventDefault();
                setAttempted1(true);
                if (step1Valid) setStep(2);
              }}
            >
              {/* Role segmented control, like the Liebe/Lieber/Hallo radios */}
              <fieldset className="wl-role">
                <legend>I am a…</legend>
                <div className="wl-role-options">
                  {(
                    [
                      ["student", "Student"],
                      ["parent", "Parent"],
                      ["corporate", "Corporate Employee"],
                    ] as const
                  ).map(([value, label]) => (
                    <label key={value} className="wl-radio">
                      <input
                        type="radio"
                        name="role"
                        checked={form.role === value}
                        onChange={() => set("role", value)}
                      />
                      <span className="wl-radio-dot" aria-hidden />
                      {label}
                    </label>
                  ))}
                </div>
              </fieldset>

              <label
                className={`wl-field${showError(step1Errors, "fullName", touched1, attempted1) ? " wl-field--invalid" : ""}`}
              >
                <span>Full name *</span>
                <input
                  type="text"
                  required
                  value={form.fullName}
                  onChange={(e) => set("fullName", e.target.value)}
                  onBlur={mark1("fullName")}
                  aria-invalid={!!showError(step1Errors, "fullName", touched1, attempted1)}
                  autoComplete="name"
                  placeholder="e.g. Aarav Sharma"
                />
                {showError(step1Errors, "fullName", touched1, attempted1) && (
                  <em className="wl-err">{step1Errors.fullName}</em>
                )}
              </label>

              <label
                className={`wl-field${showError(step1Errors, "email", touched1, attempted1) ? " wl-field--invalid" : ""}`}
              >
                <span>Email *</span>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  onBlur={mark1("email")}
                  aria-invalid={!!showError(step1Errors, "email", touched1, attempted1)}
                  autoComplete="email"
                  placeholder="you@example.com"
                />
                {showError(step1Errors, "email", touched1, attempted1) && (
                  <em className="wl-err">{step1Errors.email}</em>
                )}
              </label>

              <div className="wl-row">
                <label
                  className={`wl-field${showError(step1Errors, "city", touched1, attempted1) ? " wl-field--invalid" : ""}`}
                >
                  <span>City *</span>
                  <input
                    type="text"
                    required
                    value={form.city}
                    onChange={(e) => set("city", e.target.value)}
                    onBlur={mark1("city")}
                    aria-invalid={!!showError(step1Errors, "city", touched1, attempted1)}
                    autoComplete="address-level2"
                    placeholder="e.g. New Delhi"
                  />
                  {showError(step1Errors, "city", touched1, attempted1) && (
                    <em className="wl-err">{step1Errors.city}</em>
                  )}
                </label>
                <label
                  className={`wl-field${showError(step1Errors, "phone", touched1, attempted1) ? " wl-field--invalid" : ""}`}
                >
                  <span>Mobile / WhatsApp *</span>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => set("phone", e.target.value)}
                    onBlur={mark1("phone")}
                    aria-invalid={!!showError(step1Errors, "phone", touched1, attempted1)}
                    autoComplete="tel"
                    placeholder="98765 43210"
                  />
                  {showError(step1Errors, "phone", touched1, attempted1) && (
                    <em className="wl-err">{step1Errors.phone}</em>
                  )}
                </label>
              </div>

              <button
                type="submit"
                className="wl-btn wl-btn--next"
                suppressHydrationWarning
              >
                Next &rarr;
              </button>
            </form>
          ) : (
            <form className="wl-form" onSubmit={handleSubmit}>
              {form.role === "student" && (
                <div className="wl-row">
                  <label className="wl-field">
                    <span>College or university</span>
                    <input
                      type="text"
                      value={form.college}
                      onChange={(e) => set("college", e.target.value)}
                      autoComplete="organization"
                      placeholder="e.g. Delhi University"
                    />
                  </label>
                  <label className="wl-field">
                    <span>Year of study</span>
                    <select
                      value={form.yearOfStudy}
                      onChange={(e) => set("yearOfStudy", e.target.value)}
                    >
                      <option value="">Select…</option>
                      {YEAR_OPTIONS.map((y) => (
                        <option key={y.value} value={y.value}>
                          {y.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              )}
              {form.role === "corporate" && (
                <label className="wl-field">
                  <span>Company / organisation name *</span>
                  <input
                    type="text"
                    value={form.college}
                    onChange={(e) => set("college", e.target.value)}
                    autoComplete="organization"
                    placeholder="e.g. Infosys"
                  />
                </label>
              )}

              <fieldset className="wl-field wl-tracks" data-pr>
                <span>Track interest (pick up to 3)</span>
                <div className="wl-track-options">
                  {TRACKS.map((t) => (
                    <label key={t.id} className="wl-track-chip">
                      <input
                        type="checkbox"
                        checked={form.tracks.includes(t.id)}
                        onChange={() => toggleTrack(t.id)}
                      />
                      {t.label}
                    </label>
                  ))}
                </div>
              </fieldset>

              <label className="wl-field">
                <span>How did you hear about us?</span>
                <select
                  value={form.source}
                  onChange={(e) => set("source", e.target.value)}
                >
                  <option value="">Select…</option>
                  {SOURCE_OPTIONS.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </label>

              <label
                className={`wl-consent${showError(step2Errors, "consent", touched2, attempted2) ? " wl-field--invalid" : ""}`}
                data-pr
                style={{ "--pr-d": "0.12s" } as React.CSSProperties}
              >
                <input
                  type="checkbox"
                  checked={form.consent}
                  onChange={(e) => {
                    set("consent", e.target.checked);
                    mark2("consent")();
                  }}
                  required
                />
                <span>
                  I accept the{" "}
                  <Link href="/terms">Terms and Conditions</Link> *{" "}
                  <em>(required)</em>
                </span>
                {showError(step2Errors, "consent", touched2, attempted2) && (
                  <em className="wl-err">{step2Errors.consent}</em>
                )}
              </label>

              {error && <p className="wl-error" role="alert">{error}</p>}

              <div className="wl-step-actions">
                <button
                  type="button"
                  className="wl-link-plain"
                  onClick={() => setStep(1)}
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  className="wl-btn"
                  disabled={submitting}
                  suppressHydrationWarning
                >
                  {submitting ? "Sending…" : "Join the waitlist!"}
                </button>
              </div>
            </form>
          )}

          <p className="wl-required-note">* required fields</p>
        </section>
      </div>

      {/* Floating CTA */}
      <Link
        href="mailto:info@cultureflow.in"
        className="wl-float-cta"
        aria-label="Let's talk — email us"
      >
        Let&apos;s talk
      </Link>
    </main>
    <Footer />
  </>
  );
}
