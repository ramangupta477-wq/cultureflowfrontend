"use client";

import { useEffect, useRef } from "react";

const N_MIN = 4, N_MAX = 12;
const PHASE2 = 0.3;
const SMOOTHING = 0.2;
const STOP_EPSILON = 0.0005;
const C_LINE = "#0B0B0B";
const C_AXLE = "#0B0B0B";

const easeInOut = (t: number) => t * t * (3 - 2 * t);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const idealCache: Record<number, Float64Array> = {};
function idealVerts(n: number, r: number) {
  let base = idealCache[n];
  if (!base) {
    base = new Float64Array(n * 2);
    for (let i = 0; i < n; i++) {
      const a = Math.PI / 2 + (2 * Math.PI * i) / n;
      base[i * 2] = Math.cos(a);
      base[i * 2 + 1] = Math.sin(a);
    }
    idealCache[n] = base;
  }
  const v = new Float64Array(n * 2);
  for (let i = 0; i < n * 2; i++) v[i] = base[i] * r;
  return v;
}

function alignedIdealVerts(n: number, r: number, refx: number, refy: number) {
  const raw = idealVerts(n, r);
  const refAngle = Math.atan2(refy, refx);
  let best = 0, bestDiff = Infinity;
  for (let o = 0; o < n; o++) {
    const a = Math.atan2(raw[o * 2 + 1], raw[o * 2]);
    let d = Math.abs(a - refAngle);
    if (d > Math.PI) d = 2 * Math.PI - d;
    if (d < bestDiff) { bestDiff = d; best = o; }
  }
  const out = new Float64Array(n * 2);
  for (let i = 0; i < n; i++) {
    const s = ((i + best) % n) * 2;
    out[i * 2] = raw[s]; out[i * 2 + 1] = raw[s + 1];
  }
  return out;
}

function continuousVerts(nf: number, r: number) {
  const nLo = Math.floor(nf);
  const frac = nf - nLo;
  if (frac < 1e-9) return idealVerts(nLo, r);
  const nHi = nLo + 1;
  const base = idealVerts(nLo, r);
  const start = new Float64Array(nHi * 2);
  start[0] = base[0]; start[1] = base[1];
  start[2] = (base[0] + base[2]) / 2;
  start[3] = (base[1] + base[3]) / 2;
  for (let i = 2; i < nHi; i++) {
    start[i * 2] = base[(i - 1) * 2];
    start[i * 2 + 1] = base[(i - 1) * 2 + 1];
  }
  const target = alignedIdealVerts(nHi, r, base[0], base[1]);
  const out = new Float64Array(nHi * 2);
  for (let i = 0; i < nHi * 2; i++) out[i] = lerp(start[i], target[i], frac);
  return out;
}

/**
 * Renders just a <canvas>. The parent provides the scroll container ref
 * so the polygon and the track bars share the same 400vh scroll context.
 */
export default function RollingPolygon({
  containerRef,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const outer = containerRef.current;
    if (!canvas || !outer) return;
    const ctx = canvas.getContext("2d")!;
    if (!ctx) return;

    let W = 0, H = 0, R = 0, dpr = 1;
    let isMobile = false;
    let targetProgress = 0, progress = 0;
    let rafId: number | null = null;
    let scrollDirty = false;
    let scrollable = 0, offsetFrac = 0, xLeft = 0, xRight = 0, tEntry = 0;

    const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    function resize() {
      const sticky = canvas!.parentElement!;
      dpr = window.devicePixelRatio || 1;
      const cssW = sticky.clientWidth || window.innerWidth;
      const cssH = sticky.clientHeight || window.innerHeight;
      canvas!.width = Math.round(cssW * dpr);
      canvas!.height = Math.round(cssH * dpr);
      canvas!.style.width = cssW + "px";
      canvas!.style.height = cssH + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.lineJoin = "round";
      ctx.lineCap = "round";

      W = cssW; H = cssH;
      isMobile = W <= 767;
      R = Math.min(W, H) * (isMobile ? 0.12 : 0.095);
      scrollable = Math.max(0, outer!.offsetHeight - window.innerHeight);
      offsetFrac = isMobile ? 0 : 0.25;
      xLeft = isMobile ? R : -R;
      xRight = W - 2 * R - (isMobile ? 10 : 20);
      tEntry = isMobile ? 0.05 : (2 * R) / (xRight - xLeft);
      updateTarget();
      render(progress);
    }

    function updateTarget() {
      const rect = outer!.getBoundingClientRect();
      const scrolled = Math.max(0, -rect.top);
      const raw = scrollable > 0 ? Math.min(1, scrolled / scrollable) : 0;
      targetProgress = Math.max(0, (raw - offsetFrac) / (1 - offsetFrac));
      if (prefersReduced) { progress = targetProgress; render(progress); return; }
      if (!rafId) rafId = requestAnimationFrame(animate);
    }

    function onScroll() {
      if (scrollDirty) return;
      scrollDirty = true;
      requestAnimationFrame(() => { scrollDirty = false; updateTarget(); });
    }

    function animate() {
      progress = lerp(progress, targetProgress, SMOOTHING);
      if (Math.abs(targetProgress - progress) < STOP_EPSILON) progress = targetProgress;
      render(progress);
      rafId = Math.abs(targetProgress - progress) >= STOP_EPSILON
        ? requestAnimationFrame(animate)
        : null;
    }

    function render(p: number) {
      const t = Math.max(0, Math.min(1, p));
      const span = xRight - xLeft;
      const wheelX = lerp(xLeft, xRight, t);

      const tMorphRaw = Math.max(0, (t - tEntry) / (1 - tEntry));
      const tMorph = easeInOut(Math.min(1, tMorphRaw));
      const tPoly = Math.min(tMorph / PHASE2, 1);
      const tCirc = Math.max(0, (tMorph - PHASE2) / (1 - PHASE2));
      const circT = easeInOut(tCirc);

      const nf = N_MIN + tPoly * (N_MAX - N_MIN);
      const nLo = Math.floor(nf);
      const nHi = Math.min(N_MAX, nLo + 1);
      const frac = nf - nLo;

      const sLo = 2 * R * Math.sin(Math.PI / nLo);
      const sHi = 2 * R * Math.sin(Math.PI / nHi);
      const s = lerp(sLo, sHi, frac);

      const aLo = R * Math.cos(Math.PI / nLo);
      const aHi = R * Math.cos(Math.PI / nHi);
      const a = lerp(aLo, aHi, frac);

      const bottomMargin = isMobile ? 60 : 80;
      const roadPeakY = (H - bottomMargin) * 0.68 + a;
      const axleY = roadPeakY - (a + (R - a) * circT);

      ctx.clearRect(0, 0, W, H);

      // catenary road
      const firstPeakX = xLeft + Math.ceil((-xLeft - s) / s) * s;
      const numArches = Math.ceil((W + s * 2) / s) + 2;
      const steps = Math.max(48, Math.round(s));
      const invA = 1 / a;
      const oneMinusCirc = 1 - circT;

      ctx.beginPath();
      for (let ai = 0; ai < numArches; ai++) {
        const peakX = firstPeakX + ai * s;
        const archLeft = peakX - s / 2;
        for (let si = 0; si <= steps; si++) {
          const f2 = si / steps;
          const lx = archLeft + f2 * s;
          const localX = lx - peakX;
          const catenaryY = roadPeakY + a * Math.cosh(localX * invA) - a;
          const worldY = catenaryY * oneMinusCirc + roadPeakY * circT;
          if (si === 0) ctx.moveTo(lx, worldY); else ctx.lineTo(lx, worldY);
        }
      }
      ctx.strokeStyle = C_LINE;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // rolling shape
      const d = t * span;
      const rotation = (d / s) * (2 * Math.PI / nf) - Math.PI / nf;
      const verts = continuousVerts(nf, R);
      const vCount = verts.length / 2;

      ctx.save();
      ctx.translate(wheelX, axleY);
      ctx.rotate(rotation);
      ctx.beginPath();

      if (circT < 0.999) {
        const STEPS = isMobile ? 90 : 360;
        const per = vCount / STEPS;
        for (let i = 0; i <= STEPS; i++) {
          const vi = i * per;
          const vi0 = Math.floor(vi) % vCount;
          const vi1 = (vi0 + 1) % vCount;
          const vf = vi - Math.floor(vi);
          const px = lerp(verts[vi0 * 2], verts[vi1 * 2], vf);
          const py = lerp(verts[vi0 * 2 + 1], verts[vi1 * 2 + 1], vf);
          const pr = Math.sqrt(px * px + py * py);
          const scale = lerp(pr, R, circT) / pr;
          const bx = px * scale, by = py * scale;
          if (i === 0) ctx.moveTo(bx, by); else ctx.lineTo(bx, by);
        }
        ctx.closePath();
      } else {
        ctx.arc(0, 0, R, 0, Math.PI * 2);
      }

      ctx.strokeStyle = C_LINE;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // center dot
      ctx.beginPath();
      ctx.arc(0, 0, 3, 0, Math.PI * 2);
      ctx.fillStyle = C_LINE;
      ctx.fill();
      ctx.restore();

      // axle guide
      ctx.save();
      ctx.strokeStyle = C_AXLE;
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 10]);
      ctx.globalAlpha = 0.4;
      ctx.beginPath();
      ctx.moveTo(0, axleY);
      ctx.lineTo(W, axleY);
      ctx.stroke();
      ctx.restore();
    }

    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    resize();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [containerRef]);

  return <canvas ref={canvasRef} className="polygon-canvas" />;
}
