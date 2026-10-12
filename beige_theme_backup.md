# Beige Theme Backup

This file contains a backup of the beige theme components and styles.

## HeroSection.tsx

```tsx
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import { useLenis } from "lenis/react";
import "./HeroSection.css";

// Dynamically import WebGL component to avoid SSR issues
const GlobeLineDrawing = dynamic(() => import("./GlobeLineDrawing"), {
  ssr: false,
  loading: () => null,
});

/**
 * Phase sequence:
 * 1. "loading"   — Logo + progress bar (0→100%)
 * 2. "revealing" — Loader fades out, globe lines start drawing
 * 3. "hero"      — Drawing done, content fades in, scroll unlocked
 */
type Phase = "loading" | "revealing" | "hero";

export default function HeroSection() {
  const [phase, setPhase] = useState<Phase>("loading");
  const [loadPercent, setLoadPercent] = useState(0);
  const [globeSize, setGlobeSize] = useState(600);
  const [loaderMounted, setLoaderMounted] = useState(true);

  const loadIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lenis = useLenis();

  // ─── Scroll Lock ───
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    }
  }, [lenis]);

  useEffect(() => {
    if (phase !== "hero") {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      if (lenis) lenis.stop();
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      if (lenis) lenis.start();
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      if (lenis) lenis.start();
    };
  }, [phase, lenis]);

  // ─── Globe Sizing (+35% larger) ───
  useEffect(() => {
    const update = () => {
      const vh = window.innerHeight;
      const vw = window.innerWidth;
      // 20% bigger again — fills center dramatically
      const base = Math.min(vh * 0.68, vw * 0.58);
      const size = Math.min(1400, Math.max(550, base * 1.62));
      setGlobeSize(Math.round(size));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // ─── Phase 1: Loading 0→100% ───
  useEffect(() => {
    let current = 0;
    loadIntervalRef.current = setInterval(() => {
      const speed =
        current < 25 ? 0.75 :
        current < 55 ? 1.4 :
        current < 80 ? 0.9 :
        current < 95 ? 0.5 : 0.3;
      current = Math.min(current + speed, 100);
      setLoadPercent(Math.round(current));

      if (current >= 100) {
        if (loadIntervalRef.current) clearInterval(loadIntervalRef.current);
        // Brief pause at 100%, then start revealing
        setTimeout(() => {
          setPhase("revealing");
          // Unmount loader after fade-out completes
          setTimeout(() => setLoaderMounted(false), 1000);
        }, 400);
      }
    }, 40);

    return () => {
      if (loadIntervalRef.current) clearInterval(loadIntervalRef.current);
    };
  }, []);

  // ─── Globe line drawing complete → show content ───
  const handleDrawComplete = useCallback(() => {
    // Small delay then reveal content
    setTimeout(() => {
      setPhase("hero");
    }, 500);
  }, []);

  // Phase-derived visibility flags
  const isExiting = phase === "revealing";
  const showContent = phase === "hero";

  return (
    <section className="hero-section">
      {/* ═══ LOADER OVERLAY ═══ */}
      {loaderMounted && (
        <div className={`hero-loader ${isExiting ? "hero-loader--exiting" : ""}`}>
          {/* Logo centered */}
          <div className={`hero-loader__logo ${isExiting ? "hero-loader__logo--out" : ""}`}>
            <img
              src="/homepage_assets/Culture Flow logo.svg"
              alt="Culture Flow"
            />
          </div>

          {/* Bottom: percent + progress bar */}
          <div className="hero-loader__bottom">
            <div className="hero-loader__percent">{loadPercent}%</div>
            <div className="hero-loader__bar">
              <div
                className="hero-loader__bar-fill"
                style={{ transform: `scaleX(${loadPercent / 100})` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ═══ TOP NAVIGATION ═══ */}
      <nav className={`hero-nav ${showContent ? "hero-nav--visible" : ""}`}>
        <div className="hero-nav__logo">
          <a href="/">
            <img
              src="/homepage_assets/Culture Flow logo.svg"
              alt="Culture Flow"
            />
          </a>
        </div>

        <div className="hero-nav__right">
          <a href="/contact" className="hero-nav__cta">
            Get Started
            <span className="hero-nav__cta-arrow">↗</span>
          </a>
          <div className="hero-nav__divider" />
          <button className="hero-nav__menu" aria-label="Open menu">
            <span className="hero-nav__menu-bar" />
            <span className="hero-nav__menu-bar" />
          </button>
        </div>
      </nav>

      {/* ═══ GLOBE AREA ═══ */}
      <div
        className="hero-globe-wrapper"
        style={{ width: globeSize, height: globeSize }}
      >
        {/* The single globe — line drawing that stays as the final globe */}
        <div className="hero-globe-drawing">
          <GlobeLineDrawing
            active={phase === "revealing" || phase === "hero"}
            onComplete={handleDrawComplete}
            size={globeSize}
          />
          <div className="hero-globe-shadow" />
        </div>
      </div>

      {/* ═══ BOTTOM CONTENT ═══ */}
      <div className={`hero-content ${showContent ? "hero-content--visible" : ""}`}>
        {/* Left: Heading + Subtitle + CTA */}
        <div className="hero-left">
          <h1 className="hero-heading">
            <span className="hero-heading__line1">One Step.</span>
            <span className="hero-heading__line2">New Future.</span>
          </h1>
          <p className="hero-subtitle">
            Transforming Indian student mobility through structured educational
            programs, partnering with top universities worldwide.
          </p>
          <a href="/contact" className="hero-cta">
            GET STARTED
            <span className="hero-cta__arrow">↗</span>
          </a>
        </div>

        {/* Right: Description + Tags */}
        <div className="hero-right">
          <p className="hero-right__text">
            Whether through <strong>international affairs, university
            partnerships,</strong> or <strong>cultural exchange
            programs,</strong>{" "}
            we create pathways that students don&apos;t just follow — they
            embrace.
          </p>
          <div className="hero-tags">
            <span className="hero-tag">STUDY ABROAD</span>
            <span className="hero-tag">UNIVERSITY PROGRAMS</span>
            <span className="hero-tag">INTERNATIONAL AFFAIRS</span>
            <span className="hero-tag hero-tag--more">+</span>
          </div>
        </div>
      </div>
    </section>
  );
}

```

## HeroSection.css

```css
/* ═══════════════════════════════════════════════
   Hero Section — Loader + Globe Animation
   ═══════════════════════════════════════════════ */

.hero-section {
  position: relative;
  width: 100%;
  height: 100vh;
  min-height: 600px;
  background: transparent;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* ═══════════════════════════════════════════════
   LOADER OVERLAY
   ═══════════════════════════════════════════════ */

.hero-loader {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: #0D0A06;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.9s cubic-bezier(0.76, 0, 0.24, 1);
}

.hero-loader--exiting {
  opacity: 0;
  pointer-events: none;
}

/* Loader Logo */
.hero-loader__logo {
  opacity: 0;
  transform: scale(0.9);
  animation: loaderLogoIn 1s cubic-bezier(0.16, 1, 0.3, 1) 0.15s forwards;
}

.hero-loader__logo--out {
  animation: loaderLogoOut 0.5s cubic-bezier(0.55, 0, 1, 0.45) forwards !important;
}

.hero-loader__logo img {
  height: clamp(36px, 5vw, 56px);
  width: auto;
}

/* Loader Bottom Bar + Percentage */
.hero-loader__bottom {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
}

.hero-loader__percent {
  position: absolute;
  bottom: 24px;
  right: 40px;
  font-family: var(--font-body);
  font-size: clamp(1.6rem, 2.5vw, 2.4rem);
  font-weight: 300;
  letter-spacing: 0.1em;
  color: var(--color-navy);
  opacity: 0.55;
  font-variant-numeric: tabular-nums;
}

.hero-loader__bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: rgba(200, 156, 102, 0.18);
}

.hero-loader__bar-fill {
  height: 100%;
  width: 100%;
  transform-origin: left;
  background: linear-gradient(90deg, var(--color-gold), var(--color-navy));
  box-shadow: 0 0 12px rgba(200, 156, 102, 0.4);
  transition: transform 0.12s linear;
  will-change: transform;
}

/* ═══════════════════════════════════════════════
   TOP NAVIGATION BAR
   ═══════════════════════════════════════════════ */

.hero-nav {
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px clamp(24px, 4vw, 56px);
  flex-shrink: 0;
  opacity: 0;
  transform: translateY(-12px);
  transition: opacity 0.8s ease-out 0.15s, transform 0.8s ease-out 0.15s;
  pointer-events: none;
}

.hero-nav--visible {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}

.hero-nav__logo {
  display: flex;
  align-items: center;
}

.hero-nav__logo img {
  height: clamp(28px, 3vw, 40px);
  width: auto;
}

.hero-nav__right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.hero-nav__cta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-body);
  font-size: 0.875rem;
  font-weight: 500;
  letter-spacing: 0.04em;
  color: #FFFFFF;
  text-decoration: none;
  transition: color 0.3s ease;
}

.hero-nav__cta:hover {
  color: #C89C66;
}

.hero-nav__cta-arrow {
  display: inline-flex;
  color: #C89C66;
  font-size: 1rem;
  transition: transform 0.3s ease;
}

.hero-nav__cta:hover .hero-nav__cta-arrow {
  transform: translate(2px, -2px);
}

.hero-nav__divider {
  width: 1px;
  height: 20px;
  background: rgba(0, 34, 68, 0.2);
}

.hero-nav__menu {
  display: flex;
  flex-direction: column;
  gap: 6px;
  cursor: pointer;
  padding: 4px;
  transition: opacity 0.3s ease;
}

.hero-nav__menu:hover {
  opacity: 0.6;
}

.hero-nav__menu-bar {
  display: block;
  width: 28px;
  height: 2px;
  background: var(--color-text);
  border-radius: 1px;
}

/* ═══════════════════════════════════════════════
   GLOBE AREA
   ═══════════════════════════════════════════════ */

.hero-globe-wrapper {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -52%);
  z-index: 2;
}

/* Line Drawing Layer */
.hero-globe-drawing {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3;
  transition: opacity 1.2s ease-out;
}

.hero-globe-drawing--out {
  opacity: 0;
  pointer-events: none;
}

/* Full Globe Layer */
.hero-globe-full {
  position: relative;
  z-index: 2;
  opacity: 0;
  transform: scale(0.92);
  transition: opacity 1.4s cubic-bezier(0.16, 1, 0.3, 1),
              transform 1.4s cubic-bezier(0.16, 1, 0.3, 1);
  pointer-events: none;
}

.hero-globe-full--visible {
  opacity: 1;
  transform: scale(1);
  pointer-events: auto;
}

/* Warm Golden Glow Shadow */
.hero-globe-shadow {
  position: absolute;
  bottom: -6%;
  left: 50%;
  transform: translateX(-50%);
  width: 75%;
  height: 28%;
  background: radial-gradient(
    ellipse at center,
    rgba(200, 156, 102, 0.32) 0%,
    rgba(200, 156, 102, 0.16) 35%,
    rgba(200, 156, 102, 0.05) 60%,
    transparent 100%
  );
  border-radius: 50%;
  filter: blur(24px);
  pointer-events: none;
  z-index: -1;
}

/* ═══════════════════════════════════════════════
   BOTTOM CONTENT
   ═══════════════════════════════════════════════ */

.hero-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 5;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding: clamp(24px, 4vw, 48px) clamp(24px, 4vw, 56px);
  gap: 40px;
  pointer-events: none;
}

/* Left Content */
.hero-left {
  max-width: 480px;
}

.hero-heading {
  font-family: var(--font-heading);
  font-weight: 400;
  line-height: 1.1;
  color: #FFFFFF;
  margin-bottom: 16px;
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.9s ease-out, transform 0.9s cubic-bezier(0.16, 1, 0.3, 1);
}

.hero-heading__line1 {
  display: block;
  font-size: clamp(2.4rem, 5.4vw, 4.2rem);
  color: #FFFFFF;
  font-weight: 700;
}

.hero-heading__line2 {
  display: block;
  font-size: clamp(2.4rem, 5.4vw, 4.2rem);
  font-weight: 400;
  color: #F6EEDD;
}

.hero-subtitle {
  font-family: var(--font-body);
  font-size: clamp(0.96rem, 1.32vw, 1.14rem);
  font-weight: 400;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.55);
  margin-bottom: 28px;
  max-width: 400px;
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.9s ease-out 0.1s, transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.1s;
}

/* CTA Button */
.hero-cta {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 28px;
  background: var(--color-navy);
  color: #F6EEDD;
  font-family: var(--font-body);
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  text-decoration: none;
  border-radius: 50px;
  cursor: pointer;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.8s ease-out 0.2s,
              transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s,
              background 0.4s ease,
              box-shadow 0.4s ease;
}

.hero-cta__arrow {
  display: inline-flex;
  color: var(--color-gold);
  transition: transform 0.3s ease;
  font-size: 1rem;
}

/* Right Content */
.hero-right {
  max-width: 420px;
  text-align: left;
}

.hero-right__text {
  font-family: var(--font-body);
  font-size: clamp(0.96rem, 1.32vw, 1.14rem);
  font-weight: 400;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.55);
  margin-bottom: 20px;
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.9s ease-out 0.05s, transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.05s;
}

.hero-right__text strong {
  color: #FFFFFF;
  font-weight: 600;
}

/* Service Tags */
.hero-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  opacity: 0;
  transform: translateY(18px);
  transition: opacity 0.8s ease-out 0.15s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.15s;
}

.hero-tag {
  display: inline-flex;
  align-items: center;
  padding: 8px 18px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 50px;
  font-family: var(--font-body);
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.85);
  background: transparent;
  cursor: default;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.hero-tag:hover {
  border-color: #C89C66;
  color: #FFFFFF;
  background: rgba(200, 156, 102, 0.15);
}

.hero-tag--more {
  width: 36px;
  height: 36px;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 1rem;
  font-weight: 400;
  cursor: pointer;
}

/* ─── Content Visibility (phase-controlled) ─── */
.hero-content--visible {
  pointer-events: auto;
}

.hero-content--visible .hero-heading,
.hero-content--visible .hero-subtitle,
.hero-content--visible .hero-cta,
.hero-content--visible .hero-right__text,
.hero-content--visible .hero-tags {
  opacity: 1;
  transform: translateY(0);
}

.hero-content--visible .hero-cta:hover {
  background: #C89C66;
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(200, 156, 102, 0.3);
}

.hero-content--visible .hero-cta:hover .hero-cta__arrow {
  transform: translate(2px, -2px);
}

/* ═══════════════════════════════════════════════
   ANIMATIONS
   ═══════════════════════════════════════════════ */

@keyframes loaderLogoIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes loaderLogoOut {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.94);
  }
}

/* ═══════════════════════════════════════════════
   RESPONSIVE
   ═══════════════════════════════════════════════ */

@media (max-width: 1024px) {
  .hero-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 24px;
    padding-bottom: 32px;
  }

  .hero-right {
    max-width: 100%;
  }

  .hero-globe-wrapper {
    transform: translate(-50%, -56%);
  }
}

@media (max-width: 768px) {
  .hero-section {
    min-height: 100svh;
  }

  .hero-nav {
    padding: 16px 20px;
  }

  .hero-nav__cta {
    display: none;
  }

  .hero-nav__divider {
    display: none;
  }

  .hero-globe-wrapper {
    transform: translate(-50%, -58%);
  }

  .hero-heading__line1,
  .hero-heading__line2 {
    font-size: clamp(1.8rem, 8vw, 2.5rem);
  }

  .hero-content {
    padding: 20px;
    padding-bottom: 24px;
  }

  .hero-subtitle {
    font-size: 0.82rem;
    margin-bottom: 20px;
  }

  .hero-right__text {
    font-size: 0.82rem;
  }

  .hero-tag {
    font-size: 0.6rem;
    padding: 6px 14px;
  }

  .hero-loader__percent {
    font-size: 1.4rem;
    right: 20px;
    bottom: 16px;
  }
}

@media (max-width: 480px) {
  .hero-heading__line1,
  .hero-heading__line2 {
    font-size: 1.75rem;
  }
}

```

## GlobeLineDrawing.tsx

```tsx
'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface GlobeLineDrawingProps {
  /** When true, starts the line-drawing animation */
  active: boolean;
  /** Called when all lines have finished drawing */
  onComplete?: () => void;
  /** Canvas pixel size (square) */
  size: number;
}

// ─── Coordinate helpers ───

function latLngTo3D(lat: number, lng: number, r: number): [number, number, number] {
  const phi = (90 - lat) * Math.PI / 180;
  const theta = (lng + 180) * Math.PI / 180;
  return [
    -r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta),
  ];
}

// Haversine distance (radians) for reveal ordering
function sphericalDist(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const toRad = Math.PI / 180;
  const dLat = (lat2 - lat1) * toRad;
  const dLng = (lng2 - lng1) * toRad;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * toRad) * Math.cos(lat2 * toRad) * Math.sin(dLng / 2) ** 2;
  return 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// India — the radial origin for the reveal wave
const INDIA = { lat: 20.5937, lng: 78.9629 };

const GEOJSON_URL =
  'https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson';

const GLOBE_R = 4.5;
const CAMERA_Z = 16;
const DRAW_DURATION = 2.8; // seconds

// Pre-fetch GeoJSON at module load so it's ready before the animation starts
let geoPromise: Promise<any> | null = null;
function getGeoJson() {
  if (!geoPromise) {
    geoPromise = fetch(GEOJSON_URL).then((r) => r.json());
  }
  return geoPromise;
}
// Kick off the fetch immediately
getGeoJson();

export default function GlobeLineDrawing({ active, onComplete, size }: GlobeLineDrawingProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  const activeRef = useRef(active);
  activeRef.current = active;
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const drawStartRef = useRef(0);
  const doneRef = useRef(false);
  const dataReadyRef = useRef(false);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);

  // Handle resize
  useEffect(() => {
    if (rendererRef.current) {
      rendererRef.current.setSize(size, size);
    }
  }, [size]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // ─── Scene setup ───
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.z = CAMERA_Z;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(size, size);
    rendererRef.current = renderer;

    // Globe group (for rotation)
    const group = new THREE.Group();
    // Initial rotation so India-facing side is visible
    group.rotation.y = -1.85;
    group.rotation.x = 0; // Keep upright — no tilt
    scene.add(group);

    // ─── OrbitControls for interactivity + auto-rotation ───
    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.6; // Positive = left to right
    controls.rotateSpeed = 0.5;
    controls.minDistance = CAMERA_Z;
    controls.maxDistance = CAMERA_Z;

    // ─── Subtle reference sphere (ghosted) ───
    const sphereGeo = new THREE.SphereGeometry(GLOBE_R * 0.98, 64, 48);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: '#1A1508',
      transparent: true,
      opacity: 0.18,
      depthWrite: false,
    });
    const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
    group.add(sphereMesh);

    // ─── Latitude/longitude grid (very subtle) ───
    const gridPositions: number[] = [];
    const gridOrders: number[] = [];

    // Latitude lines (every 30°, full coverage pole to pole)
    for (let lat = -90; lat <= 90; lat += 30) {
      for (let lng = -180; lng < 180; lng += 2) {
        const p1 = latLngTo3D(lat, lng, GLOBE_R * 0.998);
        const p2 = latLngTo3D(lat, lng + 2, GLOBE_R * 0.998);
        gridPositions.push(...p1, ...p2);
        const midDist = sphericalDist(INDIA.lat, INDIA.lng, lat, lng + 1);
        gridOrders.push(midDist, midDist);
      }
    }

    // Longitude lines (every 30°, full coverage pole to pole)
    for (let lng = -180; lng < 180; lng += 30) {
      for (let lat = -90; lat < 90; lat += 2) {
        const p1 = latLngTo3D(lat, lng, GLOBE_R * 0.998);
        const p2 = latLngTo3D(lat + 2, lng, GLOBE_R * 0.998);
        gridPositions.push(...p1, ...p2);
        const midDist = sphericalDist(INDIA.lat, INDIA.lng, lat + 1.5, lng);
        gridOrders.push(midDist, midDist);
      }
    }

    // ─── Load country borders ───
    getGeoJson().then((geo) => {
      const positions: number[] = [];
      const orders: number[] = [];
      let maxDist = 0;

      // Collect all segments with distance from India
      interface Segment {
        p: number[];
        d: number;
      }
      const segs: Segment[] = [];

      for (const feature of geo.features) {
        const geom = feature.geometry;
        const rings: number[][][] = [];

        if (geom.type === 'Polygon') {
          rings.push(...geom.coordinates);
        } else if (geom.type === 'MultiPolygon') {
          for (const poly of geom.coordinates) {
            rings.push(...poly);
          }
        }

        for (const ring of rings) {
          for (let i = 0; i < ring.length - 1; i++) {
            const [lng1, lat1] = ring[i];
            const [lng2, lat2] = ring[i + 1];
            const midLat = (lat1 + lat2) / 2;
            const midLng = (lng1 + lng2) / 2;
            const d = sphericalDist(INDIA.lat, INDIA.lng, midLat, midLng);
            if (d > maxDist) maxDist = d;

            const p1 = latLngTo3D(lat1, lng1, GLOBE_R);
            const p2 = latLngTo3D(lat2, lng2, GLOBE_R);
            segs.push({ p: [...p1, ...p2], d });
          }
        }
      }

      // Normalize distances and add organic jitter
      for (const s of segs) {
        const normalized = maxDist > 0 ? s.d / maxDist : 0;
        const jittered = Math.min(1, Math.max(0, normalized + (Math.random() - 0.5) * 0.1));
        positions.push(...s.p);
        orders.push(jittered, jittered);
      }

      // ─── Country borders geometry ───
      const borderGeom = new THREE.BufferGeometry();
      borderGeom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      borderGeom.setAttribute('revealOrder', new THREE.Float32BufferAttribute(orders, 1));

      const borderMat = new THREE.ShaderMaterial({
        uniforms: {
          uProgress: { value: 0 },
          uColor: { value: new THREE.Color('#F6EEDD') },
          uGlow: { value: new THREE.Color('#C89C66') },
        },
        vertexShader: `
          attribute float revealOrder;
          varying float vOrder;
          void main() {
            vOrder = revealOrder;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float uProgress;
          uniform vec3 uColor;
          uniform vec3 uGlow;
          varying float vOrder;
          void main() {
            if (vOrder > uProgress) discard;

            float edge = uProgress - vOrder;

            // Golden glow at drawing frontier
            float glowIntensity = smoothstep(0.06, 0.0, edge);

            // Fade-in solidification
            float solidify = smoothstep(0.0, 0.03, edge);

            vec3 finalColor = mix(uColor, uGlow, glowIntensity * 0.85);
            float alpha = solidify * 0.9;

            gl_FragColor = vec4(finalColor, alpha);
          }
        `,
        transparent: true,
        depthWrite: false,
      });
      materialRef.current = borderMat;

      const borderLines = new THREE.LineSegments(borderGeom, borderMat);
      group.add(borderLines);

      // ─── Grid lines geometry (shared shader, subtler) ───
      // Normalize grid distances using same maxDist
      const normalizedGridOrders = gridOrders.map((d) => {
        const n = maxDist > 0 ? d / maxDist : 0;
        return Math.min(1, Math.max(0, n + (Math.random() - 0.5) * 0.08));
      });

      const gridGeom = new THREE.BufferGeometry();
      gridGeom.setAttribute('position', new THREE.Float32BufferAttribute(gridPositions, 3));
      gridGeom.setAttribute('revealOrder', new THREE.Float32BufferAttribute(normalizedGridOrders, 1));

      const gridMat = new THREE.ShaderMaterial({
        uniforms: {
          uProgress: { value: 0 },
          uColor: { value: new THREE.Color('#E8DCC8') },
          uGlow: { value: new THREE.Color('#C89C66') },
        },
        vertexShader: borderMat.vertexShader,
        fragmentShader: `
          uniform float uProgress;
          uniform vec3 uColor;
          uniform vec3 uGlow;
          varying float vOrder;
          void main() {
            if (vOrder > uProgress) discard;
            float edge = uProgress - vOrder;
            float glowIntensity = smoothstep(0.05, 0.0, edge);
            float solidify = smoothstep(0.0, 0.02, edge);
            vec3 finalColor = mix(uColor, uGlow, glowIntensity * 0.6);
            float alpha = solidify * 0.35;
            gl_FragColor = vec4(finalColor, alpha);
          }
        `,
        transparent: true,
        depthWrite: false,
      });

      const gridLines = new THREE.LineSegments(gridGeom, gridMat);
      group.add(gridLines);

      // Data is ready — if already active, start drawing
      dataReadyRef.current = true;
      if (activeRef.current && drawStartRef.current === 0) {
        drawStartRef.current = performance.now();
      }

      (materialRef as any)._gridMat = gridMat;
    });

    // ─── Animation loop ───
    let frame = 0;

    function animate() {
      frame = requestAnimationFrame(animate);

      // Auto-rotation handled by OrbitControls
      controls.update();

      // Animate drawing progress
      if (drawStartRef.current > 0) {
        const elapsed = (performance.now() - drawStartRef.current) / 1000;
        const raw = Math.min(elapsed / DRAW_DURATION, 1);
        // Ease-out for dramatic deceleration at the end
        const eased = 1 - Math.pow(1 - raw, 2.5);

        if (materialRef.current) {
          materialRef.current.uniforms.uProgress.value = eased;
        }
        const gridMat = (materialRef as any)._gridMat as THREE.ShaderMaterial | undefined;
        if (gridMat) {
          gridMat.uniforms.uProgress.value = eased;
        }

        // Fade in the reference sphere as lines draw
        sphereMat.opacity = 0.04 + eased * 0.06;

        if (raw >= 1 && !doneRef.current) {
          doneRef.current = true;
          onCompleteRef.current?.();
        }
      } else if (activeRef.current && dataReadyRef.current) {
        // Start drawing if active and data ready
        drawStartRef.current = performance.now();
      }

      renderer.render(scene, camera);
    }

    animate();

    return () => {
      cancelAnimationFrame(frame);
      controls.dispose();
      renderer.dispose();
      sphereGeo.dispose();
      sphereMat.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: size,
        height: size,
        display: 'block',
      }}
    />
  );
}

```

## ShaderBackground.tsx

```tsx
'use client';

import { useEffect, useRef } from 'react';

const VERT = `
attribute vec2 a_position;
void main(){gl_Position=vec4(a_position,0.0,1.0);}
`;

const FRAG = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec3 u_colors[8];
uniform vec4 u_scene;
uniform vec4 u_shape;
uniform vec4 u_surface;
uniform vec4 u_finish;
uniform vec4 u_transform;
uniform vec4 u_space;
uniform vec4 u_cursor;

#define u_resolution u_scene.xy
#define u_time u_scene.z
#define u_colorCount u_scene.w
#define u_scale u_shape.x
#define u_intensity u_shape.y
#define u_paramA u_shape.z
#define u_warp u_shape.w
#define u_detail u_surface.x
#define u_contrast u_surface.y
#define u_brightness u_surface.z
#define u_saturation u_surface.w
#define u_hue u_finish.x
#define u_vignette u_finish.y
#define u_blur u_finish.z
#define u_grain u_finish.w
#ifdef GL_FRAGMENT_PRECISION_HIGH
#define u_seed u_transform.x
#else
#define u_seed mod(u_transform.x,31.0)
#endif
#define u_rotate u_transform.y
#define u_drift u_transform.z
#define u_oklab u_transform.w
#define u_offset u_space.xy
#define u_mouse u_space.zw
#define u_cursorPresence u_cursor.x
#define u_cursorEffect u_cursor.y
#define u_cursorStrength u_cursor.z
#define u_cursorRadius u_cursor.w

float hash21(vec2 p){
#ifndef GL_FRAGMENT_PRECISION_HIGH
  p=mod(p,31.0);
#endif
  p=fract(p*vec2(234.34,435.345));
  p+=dot(p,p+34.23);
  return fract(p.x*p.y);
}

float grainHash(vec2 p){
  vec3 p3=fract(vec3(p.xyx)*0.1031);
  p3+=dot(p3,p3.yzx+33.33);
  return fract((p3.x+p3.y)*p3.z);
}

vec2 hash22(vec2 p){
#ifndef GL_FRAGMENT_PRECISION_HIGH
  p=mod(p,31.0);
#endif
  float n=sin(dot(p,vec2(41.0,289.0)));
  return fract(vec2(15731.743,7892.321)*n);
}

float noise(vec2 p){
  vec2 i=floor(p);vec2 f=fract(p);
  vec2 u=f*f*(3.0-2.0*f);
  return mix(mix(hash21(i),hash21(i+vec2(1.0,0.0)),u.x),
             mix(hash21(i+vec2(0.0,1.0)),hash21(i+vec2(1.0,1.0)),u.x),u.y);
}

float fbm(vec2 p){
  float v=0.0;float a=0.5;
  for(int i=0;i<5;i++){v+=a*noise(p);p=p*2.03+vec2(17.0,9.2);a*=0.5;}
  return v;
}

vec3 srgbToLinear(vec3 c){return mix(c/12.92,pow((c+0.055)/1.055,vec3(2.4)),step(0.04045,c));}
vec3 linearToSrgb(vec3 c){return mix(c*12.92,1.055*pow(max(c,vec3(0.0)),vec3(1.0/2.4))-0.055,step(0.0031308,c));}
vec3 linToOklab(vec3 c){
  float l=0.4122214708*c.r+0.5363325363*c.g+0.0514459929*c.b;
  float m=0.2119034982*c.r+0.6806995451*c.g+0.1073969566*c.b;
  float s=0.0883024619*c.r+0.2817188376*c.g+0.6299787005*c.b;
  l=pow(max(l,0.0),1.0/3.0);m=pow(max(m,0.0),1.0/3.0);s=pow(max(s,0.0),1.0/3.0);
  return vec3(0.2104542553*l+0.7936177850*m-0.0040720468*s,
              1.9779984951*l-2.4285922050*m+0.4505937099*s,
              0.0259040371*l+0.7827717662*m-0.8086757660*s);
}
vec3 oklabToLin(vec3 c){
  float l=c.x+0.3963377774*c.y+0.2158037573*c.z;
  float m=c.x-0.1055613458*c.y-0.0638541728*c.z;
  float s=c.x-0.0894841775*c.y-1.2914855480*c.z;
  l=l*l*l;m=m*m*m;s=s*s*s;
  return vec3(4.0767416621*l-3.3077115913*m+0.2309699292*s,
             -1.2684380046*l+2.6097574011*m-0.3413193965*s,
             -0.0041960863*l-0.7034186147*m+1.7076147010*s);
}
vec3 mixColour(vec3 a,vec3 b,float t){
  if(u_oklab>0.5){
    vec3 la=linToOklab(srgbToLinear(a));vec3 lb=linToOklab(srgbToLinear(b));
    return clamp(linearToSrgb(oklabToLin(mix(la,lb,t))),0.0,1.0);
  }
  return mix(a,b,t);
}

vec3 palette(float x){
  float n=max(u_colorCount-1.0,1.0);float f=clamp(x,0.0,1.0)*n;
  vec3 col=u_colors[0];
  for(int i=0;i<7;i++){
    if(float(i)<n)
      col=mixColour(col,u_colors[i+1],smoothstep(0.0,1.0,clamp(f-float(i),0.0,1.0)));
  }
  return col;
}

vec3 hueRotate(vec3 col,float a){
  const mat3 toYIQ=mat3(0.299,0.596,0.211,0.587,-0.274,-0.523,0.114,-0.322,0.312);
  const mat3 toRGB=mat3(1.0,1.0,1.0,0.956,-0.272,-1.106,0.621,-0.647,1.703);
  vec3 yiq=toYIQ*col;float ca=cos(a),sa=sin(a);
  yiq=vec3(yiq.x,yiq.y*ca-yiq.z*sa,yiq.y*sa+yiq.z*ca);
  return toRGB*yiq;
}

vec3 shade(vec2 uv,vec2 p,float t){
  vec3 acc=u_colors[0]*0.15;float total=0.15;
  for(int i=0;i<8;i++){
    if(float(i)>=u_colorCount)break;
    float fi=float(i);
    vec2 c=vec2(sin(t*(0.21+fi*0.071)+fi*2.4+u_seed),
                cos(t*(0.17+fi*0.093)+fi*1.7))*(0.45+u_intensity*0.35);
    float w=exp(-dot(p-c,p-c)*6.0);
    acc+=u_colors[i]*w;total+=w;
  }
  return acc/total;
}

void main(){
  vec2 uv=gl_FragCoord.xy/u_resolution.xy;
  vec2 screenUv=uv;
  vec2 p=(gl_FragCoord.xy-0.5*u_resolution.xy)/min(u_resolution.x,u_resolution.y);
  float cursorMask=0.0;

  if(u_cursorPresence>0.001){
    vec2 cursor=(0.5*u_mouse*u_resolution.xy)/min(u_resolution.x,u_resolution.y);
    vec2 cursorDelta=p-cursor;
    if(u_cursorEffect<0.5){
      p+=cursor*u_cursorPresence*u_cursorStrength*0.55;
    }else{
      float cursorDistance=length(cursorDelta);
      vec2 cursorDirection=cursorDelta/max(cursorDistance,0.0001);
      cursorMask=u_cursorPresence*(1.0-smoothstep(0.0,u_cursorRadius,cursorDistance));
      if(u_cursorEffect<1.5){p-=cursorDirection*cursorMask*u_cursorStrength*0.24;}
      else if(u_cursorEffect<2.5){
        float cursorAngle=cursorMask*u_cursorStrength*2.2;
        float cc=cos(cursorAngle),cs=sin(cursorAngle);
        p=cursor+mat2(cc,-cs,cs,cc)*cursorDelta;
      }else if(u_cursorEffect<3.5){
        float ripple=sin(cursorDistance/max(u_cursorRadius,0.001)*18.0-u_time*5.0);
        p-=cursorDirection*ripple*cursorMask*u_cursorStrength*0.07;
      }
    }
  }

  uv=p*min(u_resolution.x,u_resolution.y)/u_resolution.xy+0.5;
  p*=u_scale;
  if(abs(u_rotate)>0.0001){float cr=cos(u_rotate),sr=sin(u_rotate);p=mat2(cr,-sr,sr,cr)*p;}
  p+=u_offset;
  if(u_drift>0.0001)p+=u_drift*vec2(sin(u_time*0.31),cos(u_time*0.23));
  if(u_warp>0.0){p+=u_warp*(vec2(fbm(p*u_detail+u_seed),fbm(p*u_detail+vec2(5.2,1.3)))-0.5);}

  vec3 col;
  if(u_blur>0.0){
    float e=u_blur;float pe=e*u_scale;
    vec2 uvE=vec2(e)*min(u_resolution.x,u_resolution.y)/u_resolution.xy;
    col =shade(uv,p,u_time)*0.36;
    col+=shade(uv+vec2(uvE.x,0.0),p+vec2(pe,0.0),u_time)*0.16;
    col+=shade(uv-vec2(uvE.x,0.0),p-vec2(pe,0.0),u_time)*0.16;
    col+=shade(uv+vec2(0.0,uvE.y),p+vec2(0.0,pe),u_time)*0.16;
    col+=shade(uv-vec2(0.0,uvE.y),p-vec2(0.0,pe),u_time)*0.16;
  }else{col=shade(uv,p,u_time);}

  if(abs(u_contrast-1.0)>0.0001)col=(col-0.5)*u_contrast+0.5;
  if(abs(u_saturation-1.0)>0.0001){float luma=dot(col,vec3(0.299,0.587,0.114));col=mix(vec3(luma),col,u_saturation);}
  if(abs(u_hue)>0.0001)col=hueRotate(col,u_hue);
  if(abs(u_brightness)>0.0001)col+=u_brightness;
  if(u_vignette>0.0001){float vd=length(screenUv-0.5)*1.41421356;col*=1.0-u_vignette*smoothstep(0.35,1.0,vd);}
  if(u_cursorPresence>0.001&&u_cursorEffect>3.5)col+=(vec3(0.18)+col*0.12)*cursorMask*u_cursorStrength;
  if(u_grain>0.0001)col+=(grainHash(gl_FragCoord.xy+vec2(u_seed*17.0,u_seed*31.0))-0.5)*u_grain;
  gl_FragColor=vec4(clamp(col,0.0,1.0),1.0);
}
`;

export default function ShaderBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', {
      alpha: false, antialias: false, depth: false, stencil: false,
    });
    if (!gl) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      canvas!.style.width = w + 'px';
      canvas!.style.height = h + 'px';
      gl!.viewport(0, 0, canvas!.width, canvas!.height);
    }
    resize();
    window.addEventListener('resize', resize);

    // Compile
    function mkShader(type: number, src: string) {
      const s = gl!.createShader(type)!;
      gl!.shaderSource(s, src);
      gl!.compileShader(s);
      if (!gl!.getShaderParameter(s, gl!.COMPILE_STATUS)) {
        console.error('Shader compile:', gl!.getShaderInfoLog(s));
      }
      return s;
    }

    const vs = mkShader(gl.VERTEX_SHADER, VERT);
    const fs = mkShader(gl.FRAGMENT_SHADER, FRAG);
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error('Program link:', gl.getProgramInfoLog(prog));
    }
    gl.useProgram(prog);

    // Fullscreen triangle
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 3,-1, -1,3]), gl.STATIC_DRAW);
    const posLoc = gl.getAttribLocation(prog, 'a_position');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    // Uniform locations
    const loc = {
      colors:    gl.getUniformLocation(prog, 'u_colors'),
      scene:     gl.getUniformLocation(prog, 'u_scene'),
      shape:     gl.getUniformLocation(prog, 'u_shape'),
      surface:   gl.getUniformLocation(prog, 'u_surface'),
      finish:    gl.getUniformLocation(prog, 'u_finish'),
      transform: gl.getUniformLocation(prog, 'u_transform'),
      space:     gl.getUniformLocation(prog, 'u_space'),
      cursor:    gl.getUniformLocation(prog, 'u_cursor'),
    };

    // Static uniforms — warm beige/brown/gold palette
    gl.uniform3fv(loc.colors, [
      0.051, 0.039, 0.024,  // #0D0A06 — deep warm black
      0.227, 0.165, 0.094,  // #3A2A18 — dark bronze
      0.784, 0.612, 0.400,  // #C89C66 — gold
      0.965, 0.933, 0.867,  // #F6EEDD — cream
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,  // unused slots
    ]);
    gl.uniform4f(loc.shape,     1.16, 0.34, 0.50, 0.00);
    gl.uniform4f(loc.surface,   2.40, 1.16, 0.00, 1.00);
    gl.uniform4f(loc.finish,    0.00, 0.00, 0.000, 0.09);
    gl.uniform4f(loc.transform, 1453.0, 0.00, 0.00, 0.0);
    gl.uniform4f(loc.space,     0.00, 0.00, 0.0, 0.0);
    gl.uniform4f(loc.cursor,    0.0, 2.0, 0.65, 0.46);

    // Animation
    let frame = 0;
    const t0 = performance.now();
    let running = true;

    function onVis() {
      if (document.hidden) {
        running = false;
      } else {
        running = true;
        frame = requestAnimationFrame(render);
      }
    }
    document.addEventListener('visibilitychange', onVis);

    function render() {
      if (!running) return;
      const sec = (performance.now() - t0) / 1000;
      gl!.uniform4f(loc.scene, canvas!.width, canvas!.height, sec * 0.73, 4.0);
      gl!.drawArrays(gl!.TRIANGLES, 0, 3);
      frame = requestAnimationFrame(render);
    }
    frame = requestAnimationFrame(render);

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none',
      }}
    />
  );
}

```

