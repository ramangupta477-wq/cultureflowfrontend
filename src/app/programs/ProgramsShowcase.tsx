"use client";

import React, { useRef, useEffect } from "react";
import "./programs-showcase.css";

/* ─── Photo config ─── */
/* x,y = anchor (fraction of viewport); w = width in vw; ar = height/width
   s,d = start & duration on the 0-1 join phase timeline */
const PHOTOS = [
  { x: 0.885, y: 0.50, w: 12.6, ar: 1.50, s: 0.00, d: 0.36 },
  { x: 0.145, y: 0.19, w: 6.6,  ar: 1.40, s: 0.06, d: 0.34 },
  { x: 0.115, y: 0.26, w: 7.8,  ar: 1.00, s: 0.12, d: 0.34 },
  { x: 0.105, y: 0.84, w: 6.8,  ar: 1.45, s: 0.18, d: 0.34 },
  { x: 0.865, y: 0.24, w: 8.8,  ar: 0.70, s: 0.24, d: 0.34 },
  { x: 0.855, y: 0.31, w: 7.2,  ar: 1.30, s: 0.30, d: 0.34 },
  { x: 0.865, y: 0.75, w: 9.2,  ar: 1.45, s: 0.36, d: 0.34 },
];

/* Timeline phases (0–1) */
const T = { copyIn: [0.10, 0.17], copyOut: [0.55, 0.63], joinEnd: 0.66 };

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ss = (a: number, b: number, v: number) => { const t = clamp((v - a) / (b - a)); return t * t * (3 - 2 * t); };
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export default function ProgramsShowcase() {
  const trackRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const photoEls = useRef<HTMLDivElement[]>([]);
  const state = useRef({ target: 0, cur: 0, W: 0, H: 0, raf: 0 });

  useEffect(() => {
    const track = trackRef.current;
    const copy = copyRef.current;
    if (!track || !copy) return;

    const s = state.current;
    s.W = window.innerWidth;
    s.H = window.innerHeight;

    function readScroll() {
      const r = track!.getBoundingClientRect();
      const max = track!.offsetHeight - s.H;
      s.target = clamp(-r.top / max);
    }

    function render(p: number) {
      const jp = clamp(p / T.joinEnd);

      // Photos: depth fly-through
      PHOTOS.forEach((o, i) => {
        const el = photoEls.current[i];
        if (!el) return;
        const u = clamp((jp - o.s) / o.d);
        if (u <= 0 || u >= 1) { el.style.opacity = "0"; return; }
        const z = Math.pow(u, 1.35);
        const sc = lerp(0.30, 2.35, z);
        const dx = (o.x - 0.5) * s.W * lerp(0.55, 1.55, z);
        const dy = (o.y - 0.5) * s.H * lerp(0.55, 1.35, z);
        const w = o.w * s.W / 100, h = w * o.ar;
        const blur = lerp(0, 22, Math.pow(Math.abs(u - 0.50) * 2, 1.7));
        const op = ss(0, 0.22, u) * (1 - ss(0.86, 1, u));
        el.style.width = w + "px";
        el.style.height = h + "px";
        el.style.opacity = String(op);
        el.style.filter = `blur(${blur.toFixed(2)}px)`;
        el.style.transform = `translate3d(${(s.W / 2 + dx - w / 2).toFixed(1)}px,${(s.H / 2 + dy - h / 2).toFixed(1)}px,0) scale(${sc.toFixed(3)})`;
      });

      // Centre copy
      const ci = ss(T.copyIn[0], T.copyIn[1], p);
      const co = 1 - ss(T.copyOut[0], T.copyOut[1], p);
      const cop = ci * co;
      copy!.style.opacity = String(cop);
      copy!.style.transform = `translate3d(0,${((1 - ci) * 18 + (1 - co) * -14).toFixed(1)}px,0) scale(${(lerp(0.985, 1, ci) * lerp(1.02, 1, co)).toFixed(4)})`;
      copy!.style.filter = `blur(${((1 - ci) * 5 + (1 - co) * 6).toFixed(2)}px)`;
    }

    function tick() {
      s.cur += (s.target - s.cur) * 0.11;
      if (Math.abs(s.target - s.cur) < 0.00005) s.cur = s.target;
      render(s.cur);
      s.raf = requestAnimationFrame(tick);
    }

    function onResize() { s.W = window.innerWidth; s.H = window.innerHeight; readScroll(); }

    window.addEventListener("scroll", readScroll, { passive: true });
    window.addEventListener("resize", onResize);
    readScroll();
    s.cur = s.target;
    tick();

    return () => {
      cancelAnimationFrame(s.raf);
      window.removeEventListener("scroll", readScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div ref={trackRef} className="ps-track">
      <section className="ps-stage" aria-label="Programs">
        <div className="ps-photos">
          {PHOTOS.map((_, i) => (
            <div key={i} className="ps-ph" ref={(el) => { if (el) photoEls.current[i] = el; }} />
          ))}
        </div>

        <div ref={copyRef} className="ps-copy">
          <h2>Programs</h2>
          <p>
            Three tracks across the world's leading universities — research,
            deep-tech, and cultural leadership. We match ambition to
            institution, handle the paperwork, and make sure you arrive ready
            to work, not just travel.
          </p>
          <p>If our mission resonates with you, let&rsquo;s talk.</p>
          <a className="ps-cta" href="/waitlist">
            <span>Join waitlist</span>
            <i>→</i>
          </a>
        </div>
      </section>
    </div>
  );
}
