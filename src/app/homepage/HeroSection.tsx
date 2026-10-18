"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import "./HeroSection.css";

// ─── 3D Sphere Ball Styles (Tactile Depth, Realistic Lighting & Specular Highlights) ───
interface BallStyle {
  highlight: string;
  mid: string;
  shadow: string;
  rim: string;
  text: string;
  isDark: boolean;
}

const BALL_STYLES: BallStyle[] = [
  {
    highlight: "#3A3A44",
    mid: "#141418",
    shadow: "#040406",
    rim: "rgba(255, 205, 0, 0.20)",
    text: "#FFFFFF",
    isDark: true,
  }, // Obsidian Black 3D (White Text)
  {
    highlight: "#FFFFFF",
    mid: "#F5F3EC",
    shadow: "#D2CCA7",
    rim: "rgba(255, 255, 255, 0.65)",
    text: "#0B0B0B",
    isDark: false,
  }, // Pearl White 3D (Obsidian Text)
  {
    highlight: "#3A3A44",
    mid: "#141418",
    shadow: "#040406",
    rim: "rgba(255, 205, 0, 0.28)",
    text: "#FFCD00",
    isDark: true,
  }, // Obsidian Black 3D (Signature Gold Text)
  {
    highlight: "#42424E",
    mid: "#1E1E26",
    shadow: "#09090D",
    rim: "rgba(255, 255, 255, 0.16)",
    text: "#FFFFFF",
    isDark: true,
  }, // Deep Charcoal 3D
  {
    highlight: "#FFFFFE",
    mid: "#F8F5EB",
    shadow: "#D7D0B7",
    rim: "rgba(255, 255, 255, 0.55)",
    text: "#0B0B0B",
    isDark: false,
  }, // Luxury Warm Cream 3D
  {
    highlight: "#303038",
    mid: "#0E0E12",
    shadow: "#020204",
    rim: "rgba(255, 205, 0, 0.18)",
    text: "#FFFFFF",
    isDark: true,
  }, // Ink Black 3D
  {
    highlight: "#FFFFFF",
    mid: "#F7F6F1",
    shadow: "#D5CFB9",
    rim: "rgba(255, 255, 255, 0.70)",
    text: "#0B0B0B",
    isDark: false,
  }, // Pure White 3D
  {
    highlight: "#4A4D5A",
    mid: "#22242E",
    shadow: "#0C0D11",
    rim: "rgba(255, 205, 0, 0.22)",
    text: "#FFCD00",
    isDark: true,
  }, // Dark Graphite 3D (Gold Text)
  {
    highlight: "#FFFFFF",
    mid: "#EFECE1",
    shadow: "#CCC5AD",
    rim: "rgba(255, 255, 255, 0.45)",
    text: "#0B0B0B",
    isDark: false,
  }, // Pale Oat 3D
  {
    highlight: "#3D414D",
    mid: "#181A22",
    shadow: "#06070A",
    rim: "rgba(255, 255, 255, 0.16)",
    text: "#FFFFFF",
    isDark: true,
  }, // Midnight Charcoal 3D
];

// ─── "Hello" in world languages ───
const HELLO_WORDS = [
  "Hello",      // English
  "नमस्ते",     // Hindi
  "Hola",       // Spanish
  "Bonjour",    // French
  "Ciao",       // Italian
  "こんにちは", // Japanese
  "Hallo",      // German
  "Olá",        // Portuguese
  "你好",        // Chinese
  "안녕",        // Korean
  "Merhaba",    // Turkish
  "مرحباً",     // Arabic
  "Sawadee",    // Thai
  "Jambo",      // Swahili
  "Привет",     // Russian
  "Ahoj",       // Czech
  "Hej",        // Swedish
  "Oi",         // Brazilian
  "Γεια",       // Greek
  "שלום",       // Hebrew
];

interface Coin {
  x: number;
  y: number;
  vx: number;
  vy: number;
  a: number;
  w: number;
  k: number;
  r: number;
  style: BallStyle;
  glyph: string;
  glyphAng: number;
  born: number;
  scale?: number;
  opacity?: number;
  isExiting?: boolean;
}

export default function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const footRef = useRef<HTMLElement>(null);

  const [delhiTime, setDelhiTime] = useState<string>("15:30");

  // ─── Real-time New Delhi IST Clock ───
  useEffect(() => {
    const updateTime = () => {
      try {
        const timeStr = new Intl.DateTimeFormat("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Asia/Kolkata",
          hour12: false,
        }).format(new Date());
        setDelhiTime(timeStr);
      } catch {
        setDelhiTime("15:30");
      }
    };
    updateTime();
    const interval = setInterval(updateTime, 20000);
    return () => clearInterval(interval);
  }, []);

  // ─── Kinetic Character Split & Intro Trigger ───
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    // Split headline characters with random --d (delay) and --x (horizontal offset)
    const lines = hero.querySelectorAll<HTMLElement>("[data-split] .line");
    lines.forEach((line) => {
      const originalText = line.textContent || "";
      line.textContent = "";

      [...originalText].forEach((char) => {
        const span = document.createElement("span");
        if (char === " ") {
          span.className = "cf-hero-sp";
          line.appendChild(span);
          return;
        }
        span.className = "cf-hero-ch";
        span.textContent = char;
        span.style.setProperty("--d", `${(0.15 + Math.random() * 0.95).toFixed(2)}s`);
        span.style.setProperty(
          "--x",
          `${((Math.random() < 0.5 ? -1 : 1) * (30 + Math.random() * 90)).toFixed(0)}px`
        );
        line.appendChild(span);
      });
    });

    // Trigger .go class after fonts are ready
    const triggerGo = () => {
      requestAnimationFrame(() => {
        hero.classList.add("go");
      });
    };

    if (document.fonts && document.fonts.ready) {
      Promise.race([
        document.fonts.ready,
        new Promise((resolve) => setTimeout(resolve, 800)),
      ]).then(triggerGo);
    } else {
      triggerGo();
    }
  }, []);

  // ─── Physics Simulation for Culture Flow Coins ───
  useEffect(() => {
    const hero = heroRef.current;
    const canvas = canvasRef.current;
    const foot = footRef.current;
    if (!hero || !canvas || !foot) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ballStyles = BALL_STYLES;

    let W = 0;
    let H = 0;
    let DPR = 1;
    let floorY = 0;
    let baseRadius = 22;

    const coins: Coin[] = [];
    const mouse = { x: -999, y: -999, vx: 0, vy: 0, on: false };

    const resize = () => {
      DPR = Math.min(window.devicePixelRatio || 1, 2);
      const heroRect = hero.getBoundingClientRect();
      W = heroRect.width;
      H = heroRect.height;

      canvas.width = W * DPR;
      canvas.height = H * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

      const footRect = foot.getBoundingClientRect();
      // Floor line aligns precisely with the top edge of the footer divider
      floorY = footRect.top - heroRect.top;
      // Ball base radius
      baseRadius = Math.max(20, Math.min(W * 0.0264, 53));

      coins.forEach((c) => {
        c.r = baseRadius * c.k;
      });

      updateObstacles();
    };

    interface Obstacle {
      left: number;
      top: number;
      right: number;
      bottom: number;
    }

    let obstacles: Obstacle[] = [];

    const updateObstacles = () => {
      if (!hero) return;
      const heroRect = hero.getBoundingClientRect();
      const elements = hero.querySelectorAll<HTMLElement>(
        ".cf-hero-main .line, .cf-hero-lede"
      );
      const list: Obstacle[] = [];
      elements.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.width > 15 && r.height > 15) {
          list.push({
            left: r.left - heroRect.left - 2,
            top: r.top - heroRect.top - 2,
            right: r.right - heroRect.left + 2,
            bottom: r.bottom - heroRect.top + 2,
          });
        }
      });
      obstacles = list;
    };

    resize();
    window.addEventListener("resize", resize);

    const obsTimer1 = setTimeout(updateObstacles, 400);
    const obsTimer2 = setTimeout(updateObstacles, 1200);

    const spawnCoin = (originX?: number, originY?: number, impulseVx?: number) => {
      const k = 0.96 + Math.random() * 0.08;
      const style = ballStyles[Math.floor(Math.random() * ballStyles.length)];
      const r = baseRadius * k;

      // Pick a random "hello" word for this coin
      const word = HELLO_WORDS[Math.floor(Math.random() * HELLO_WORDS.length)];

      // Spawn from just below the logo, left side
      const logoBottom = Math.max(H * 0.14, 130);
      const defaultX = originX !== undefined ? originX : W * (0.01 + Math.random() * 0.05);
      const defaultY = originY !== undefined ? originY : logoBottom + Math.random() * baseRadius;
      const defaultVx =
        impulseVx !== undefined
          ? impulseVx
          : originX !== undefined
          ? (Math.random() - 0.5) * W * 0.12
          : W * (0.52 + Math.random() * 0.26);
      const defaultVy =
        originY !== undefined
          ? -H * (0.04 + Math.random() * 0.10)
          : H * (0.02 + Math.random() * 0.04);

      coins.push({
        x: defaultX,
        y: defaultY,
        vx: defaultVx,
        vy: defaultVy,
        a: 0,      // No initial rotation
        w: 0,      // No angular velocity — balls stay upright
        k,
        r,
        style,
        glyph: word,
        glyphAng: 0, // Text stays upright
        born: performance.now(),
        scale: 1,
        opacity: 1,
        isExiting: false,
      });
    };

    // Pick one existing ball at random to smoothly shrink & disappear
    const dismissOneCoin = () => {
      const activeCoins = coins.filter((c) => !c.isExiting);
      if (activeCoins.length === 0) return;

      // Prefer balls that have settled or been in the scene for at least 1.5s
      const settled = activeCoins.filter((c) => performance.now() - c.born > 1500);
      const candidates = settled.length > 0 ? settled : activeCoins;

      const target = candidates[Math.floor(Math.random() * candidates.length)];
      target.isExiting = true;
    };

    // Slowly bring one new ball in, while one existing ball disappears
    const spawnSlowBall = () => {
      dismissOneCoin();
      spawnCoin();
    };

    // Physics constants
    const G = () => H * 2.8; // Gravity px/s²
    const REST = 0.48; // Elasticity restitution (walls/floor)
    const FRIC = 0.25; // Rolling friction

    const physicsStep = (dt: number) => {
      const g = G();

      // Update exiting balls (smooth shrink & fade out)
      for (let i = coins.length - 1; i >= 0; i--) {
        const c = coins[i];
        if (c.isExiting) {
          c.scale = (c.scale ?? 1) - dt * 2.4;
          c.opacity = Math.max(0, (c.opacity ?? 1) - dt * 2.4);
          if ((c.scale ?? 1) <= 0.05) {
            coins.splice(i, 1);
            continue;
          }
        }
      }

      for (const c of coins) {
        c.vy += g * dt;
        c.x += c.vx * dt;
        c.y += c.vy * dt;
        c.a += c.w * dt;
        // Velocity-dependent air drag (quadratic at high speed, linear at low)
        const speed = Math.hypot(c.vx, c.vy);
        const dragCoeff = 0.12 + speed * 0.00015;
        c.vx *= 1 - dragCoeff * dt;
        c.vy *= 1 - dragCoeff * dt * 0.5;
        // Angular damping
        c.w *= 1 - 1.8 * dt;

        // Mouse interaction — realistic push with momentum transfer
        if (mouse.on) {
          const dx = c.x - mouse.x;
          const dy = c.y - mouse.y;
          const dist = Math.hypot(dx, dy);
          const contactRadius = c.r + 40;

          if (dist < contactRadius && dist > 0.001) {
            const nx = dx / dist;
            const ny = dy / dist;
            const overlap = contactRadius - dist;
            const overlapRatio = overlap / contactRadius;

            // Soft spring push (quadratic falloff)
            const springForce = overlapRatio * overlapRatio * 12;
            c.vx += nx * springForce;
            c.vy += ny * springForce;

            // Momentum transfer from cursor velocity
            const mouseSpeed = Math.hypot(mouse.vx, mouse.vy);
            if (mouseSpeed > 1) {
              const transfer = Math.min(mouseSpeed * 0.35, 25);
              c.vx += (mouse.vx / mouseSpeed) * transfer * overlapRatio;
              c.vy += (mouse.vy / mouseSpeed) * transfer * overlapRatio;
            }

            // Separate overlapping position
            c.x += nx * overlap * 0.4;
            c.y += ny * overlap * 0.4;
          }
        }

        // Floor collision at footer divider
        if (c.y + c.r > floorY) {
          c.y = floorY - c.r;
          if (c.vy > 0) c.vy *= -REST;
          if (Math.abs(c.vy) < 28) c.vy = 0;

          // Rolling friction
          c.vx *= 1 - FRIC * dt * 3;
        }

        // ─── Solid Text Obstacles Collision (Balls bounce off text words) ───
        for (const obs of obstacles) {
          const cx = Math.max(obs.left, Math.min(c.x, obs.right));
          const cy = Math.max(obs.top, Math.min(c.y, obs.bottom));

          const dx = c.x - cx;
          const dy = c.y - cy;
          const distSq = dx * dx + dy * dy;

          if (distSq < c.r * c.r && distSq > 0.0001) {
            const dist = Math.sqrt(distSq);
            const nx = dx / dist;
            const ny = dy / dist;
            const overlap = c.r - dist;

            c.x += nx * overlap;
            c.y += ny * overlap;

            const vn = c.vx * nx + c.vy * ny;
            if (vn < 0) {
              const impulse = -(1 + REST * 1.15) * vn;
              c.vx += impulse * nx;
              c.vy += impulse * ny;

              // Tangential friction against text surface
              const tx = -ny;
              const ty = nx;
              const vt = c.vx * tx + c.vy * ty;
              c.vx -= tx * vt * 0.16;
              c.vy -= ty * vt * 0.16;
            }
          } else if (distSq <= 0.0001) {
            const dLeft = c.x - obs.left;
            const dRight = obs.right - c.x;
            const dTop = c.y - obs.top;
            const dBottom = obs.bottom - c.y;
            const minD = Math.min(dLeft, dRight, dTop, dBottom);

            if (minD === dTop) {
              c.y = obs.top - c.r;
              if (c.vy > 0) c.vy *= -REST;
            } else if (minD === dBottom) {
              c.y = obs.bottom + c.r;
              if (c.vy < 0) c.vy *= -REST;
            } else if (minD === dLeft) {
              c.x = obs.left - c.r;
              if (c.vx > 0) c.vx *= -REST;
            } else {
              c.x = obs.right + c.r;
              if (c.vx < 0) c.vx *= -REST;
            }
          }
        }

        // Soft right-side barrier — keep balls from drifting into the right text
        const zoneR = W * 0.64;
        if (c.x > zoneR) {
          c.vx -= (c.x - zoneR) * 5 * dt;
        }

        // Left / Right Walls
        if (c.x - c.r < 0) {
          c.x = c.r;
          c.vx = Math.abs(c.vx) * REST;
        }
        if (c.x + c.r > W) {
          c.x = W - c.r;
          c.vx = -Math.abs(c.vx) * REST;
        }
      }

      // Coin-to-coin elastic collision (mass-proportional)
      for (let it = 0; it < 4; it++) {
        for (let i = 0; i < coins.length; i++) {
          for (let j = i + 1; j < coins.length; j++) {
            const a = coins[i];
            const b = coins[j];

            if (a.isExiting || b.isExiting) continue;

            const dx = b.x - a.x;
            const dy = b.y - a.y;
            const minDist = a.r + b.r;
            const distSq = dx * dx + dy * dy;

            if (distSq >= minDist * minDist || distSq === 0) continue;

            const dist = Math.sqrt(distSq);
            const nx = dx / dist;
            const ny = dy / dist;
            const overlap = minDist - dist;

            // Mass proportional to area (r²)
            const mA = a.r * a.r;
            const mB = b.r * b.r;
            const totalM = mA + mB;

            // Position correction weighted by inverse mass
            a.x -= nx * overlap * (mB / totalM);
            a.y -= ny * overlap * (mB / totalM);
            b.x += nx * overlap * (mA / totalM);
            b.y += ny * overlap * (mA / totalM);

            // Relative velocity along collision normal
            const rvx = b.vx - a.vx;
            const rvy = b.vy - a.vy;
            const vn = rvx * nx + rvy * ny;

            if (vn < 0) {
              // Elastic impulse with mass weighting
              const e = 0.55;
              const impulse = -(1 + e) * vn / (1 / mA + 1 / mB);
              a.vx -= (impulse / mA) * nx;
              a.vy -= (impulse / mA) * ny;
              b.vx += (impulse / mB) * nx;
              b.vy += (impulse / mB) * ny;

              // Tangential friction — transfers spin-like rolling energy
              const tx = -ny;
              const ty = nx;
              const vt = rvx * tx + rvy * ty;
              const frictionCoeff = 0.18;
              const maxFriction = Math.abs(impulse) * 0.4;
              const frictionImpulse = Math.sign(vt) * Math.min(Math.abs(vt) * frictionCoeff / (1 / mA + 1 / mB), maxFriction);

              a.vx += (frictionImpulse / mA) * tx;
              a.vy += (frictionImpulse / mA) * ty;
              b.vx -= (frictionImpulse / mB) * tx;
              b.vy -= (frictionImpulse / mB) * ty;

              // Angular velocity transfer (visual spin on impact)
              const spinTransfer = vt * 0.003;
              a.w -= spinTransfer / a.r;
              b.w += spinTransfer / b.r;
            }
          }
        }
      }
    };

    // Draw individual 3D ball (tactile sphere with radial lighting, specular sheen, and contact shadow)
    const drawCoin = (c: Coin) => {
      const { x, y, r, style, glyph, scale, opacity } = c;

      const curScale = Math.max(0, scale ?? 1);
      const curOpacity = Math.max(0, Math.min(1, opacity ?? 1));
      if (curScale <= 0.02 || curOpacity <= 0.02) return;

      const effectiveR = r * curScale;

      ctx.save();
      ctx.translate(x, y);
      ctx.globalAlpha = curOpacity;

      // ─── Floor Contact Shadow (Physical grounding on horizontal divider line) ───
      const distFromFloor = floorY - (y + effectiveR);
      if (distFromFloor < effectiveR * 1.2 && distFromFloor >= -15) {
        const shadowIntensity = Math.max(0, 1 - distFromFloor / (effectiveR * 1.2));
        const shadowW = effectiveR * (1.15 + shadowIntensity * 0.2);
        const shadowH = Math.max(2, effectiveR * 0.20 * shadowIntensity);
        ctx.save();
        ctx.beginPath();
        ctx.ellipse(0, effectiveR + 1, shadowW, shadowH, 0, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 0, 0, ${0.28 * shadowIntensity * curOpacity})`;
        ctx.fill();
        ctx.restore();
      }

      // ─── Outer Ball Ambient Drop Shadow ───
      ctx.save();
      ctx.shadowColor = "rgba(0, 0, 0, 0.22)";
      ctx.shadowBlur = effectiveR * 0.38;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = effectiveR * 0.18;

      // ─── Main 3D Sphere Body (Radial Lighting Gradient) ───
      // Light source at upper-left (-0.32 * R, -0.32 * R)
      const sphereGrad = ctx.createRadialGradient(
        -effectiveR * 0.32,
        -effectiveR * 0.32,
        effectiveR * 0.06,
        0,
        0,
        effectiveR
      );
      sphereGrad.addColorStop(0, style.highlight);
      sphereGrad.addColorStop(0.5, style.mid);
      sphereGrad.addColorStop(0.85, style.shadow);
      sphereGrad.addColorStop(1, style.shadow);

      ctx.beginPath();
      ctx.arc(0, 0, effectiveR, 0, Math.PI * 2);
      ctx.fillStyle = sphereGrad;
      ctx.fill();
      ctx.restore(); // Clear drop shadow

      // ─── Specular Glossy Sheen (Top-Left Highlight Arc) ───
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(
        -effectiveR * 0.28,
        -effectiveR * 0.30,
        effectiveR * 0.38,
        effectiveR * 0.20,
        -Math.PI / 4,
        0,
        Math.PI * 2
      );
      const sheenGrad = ctx.createRadialGradient(
        -effectiveR * 0.28,
        -effectiveR * 0.30,
        0,
        -effectiveR * 0.28,
        -effectiveR * 0.30,
        effectiveR * 0.38
      );
      sheenGrad.addColorStop(0, style.isDark ? "rgba(255, 255, 255, 0.38)" : "rgba(255, 255, 255, 0.68)");
      sheenGrad.addColorStop(0.55, style.isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(255, 255, 255, 0.24)");
      sheenGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = sheenGrad;
      ctx.fill();
      ctx.restore();

      // ─── Subtle Ambient Rim Reflection ───
      ctx.save();
      ctx.beginPath();
      ctx.arc(0, 0, effectiveR - 0.5, 0, Math.PI * 2);
      ctx.strokeStyle = style.rim;
      ctx.lineWidth = Math.max(1, 1.2 * curScale);
      ctx.stroke();
      ctx.restore();

      // ─── Multilingual Typography with 3D Depth ───
      const maxInnerWidth = effectiveR * 1.55;
      let fontSize = Math.max(11 * curScale, Math.floor(effectiveR * 0.44));
      const fontStack = `"Plus Jakarta Sans", "Inter", "Noto Sans", "Noto Sans Devanagari", system-ui, -apple-system, sans-serif`;
      ctx.font = `700 ${fontSize}px ${fontStack}`;

      // Measure text width and scale down if necessary to ensure it never clips
      const measured = ctx.measureText(glyph);
      if (measured.width > maxInnerWidth && measured.width > 0) {
        fontSize = Math.max(9 * curScale, Math.floor(fontSize * (maxInnerWidth / measured.width)));
        ctx.font = `700 ${fontSize}px ${fontStack}`;
      }

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // 3D stamped depth under typography
      ctx.save();
      if (style.isDark) {
        ctx.shadowColor = "rgba(0, 0, 0, 0.7)";
        ctx.shadowBlur = 3 * curScale;
        ctx.shadowOffsetY = 1.5 * curScale;
      } else {
        ctx.shadowColor = "rgba(255, 255, 255, 0.75)";
        ctx.shadowBlur = 2 * curScale;
        ctx.shadowOffsetY = 1 * curScale;
      }
      ctx.fillStyle = style.text;
      ctx.fillText(glyph, 0, 0);
      ctx.restore();

      ctx.restore();
    };

    // Animation Loop
    let animId = 0;
    let lastTime = performance.now();

    const loop = (now: number) => {
      const dt = Math.min(0.032, (now - lastTime) / 1000);
      lastTime = now;

      // 6 sub-steps for stable multi-ball collisions
      const sub = 6;
      for (let s = 0; s < sub; s++) {
        physicsStep(dt / sub);
      }

      mouse.vx *= 0.85;
      mouse.vy *= 0.85;

      ctx.clearRect(0, 0, W, H);
      for (const coin of coins) {
        drawCoin(coin);
      }

      animId = requestAnimationFrame(loop);
    };

    // Pointer event listeners
    const handlePointerMove = (e: PointerEvent) => {
      const rect = hero.getBoundingClientRect();
      const nx = e.clientX - rect.left;
      const ny = e.clientY - rect.top;
      mouse.vx = nx - mouse.x;
      mouse.vy = ny - mouse.y;
      mouse.x = nx;
      mouse.y = ny;
      mouse.on = e.pointerType !== "touch" || e.buttons > 0;
    };

    const handlePointerLeave = () => {
      mouse.on = false;
    };

    // Click anywhere on the hero card to drop another coin
    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("a, button")) return;

      // When at 10 or more balls, dismiss one ball smoothly so count stays balanced
      const activeCount = coins.filter((c) => !c.isExiting).length;
      if (activeCount >= 10) {
        dismissOneCoin();
      }

      const rect = hero.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      spawnCoin(clickX, clickY, (Math.random() - 0.5) * W * 0.12);
    };

    hero.addEventListener("pointermove", handlePointerMove);
    hero.addEventListener("pointerleave", handlePointerLeave);
    hero.addEventListener("pointerdown", handlePointerDown);

    // Initial sequence: all 10 come first from the left, then slowly one by one with replacement
    let rainTimer: NodeJS.Timeout | null = null;
    let cycleTimer: NodeJS.Timeout | null = null;
    let transitionTimer: NodeJS.Timeout | null = null;

    if (reduceMotion) {
      for (let i = 0; i < 10; i++) spawnCoin();
      for (let i = 0; i < 400; i++) physicsStep(1 / 200);
    } else {
      let spawnedCount = 0;
      rainTimer = setInterval(() => {
        spawnCoin();
        spawnedCount++;
        if (spawnedCount >= 10 && rainTimer) {
          clearInterval(rainTimer);
          rainTimer = null;

          // When all 10 come, wait 2.2s for them to settle, then slowly one new ball comes and any one disappears
          transitionTimer = setTimeout(() => {
            cycleTimer = setInterval(() => {
              spawnSlowBall();
            }, 3600);
          }, 2200);
        }
      }, 340);
    }

    lastTime = performance.now();
    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      clearTimeout(obsTimer1);
      clearTimeout(obsTimer2);
      if (rainTimer) clearInterval(rainTimer);
      if (transitionTimer) clearTimeout(transitionTimer);
      if (cycleTimer) clearInterval(cycleTimer);
      window.removeEventListener("resize", resize);
      hero.removeEventListener("pointermove", handlePointerMove);
      hero.removeEventListener("pointerleave", handlePointerLeave);
      hero.removeEventListener("pointerdown", handlePointerDown);
    };
  }, []);

  return (
    <div className="cf-hero-frame">
      <section
        ref={heroRef}
        id="hero"
        className="cf-hero-card cf-hero-card--yellow"
      >
        {/* No internal header — using global Navbar */}

        {/* ═══ MAIN HEADLINE GRID ═══ */}
        <div className="cf-hero-main">
          {/* Left Column (3 lines) */}
          <h1 className="cf-hero-h1 left" data-split>
            <span className="line">One</span>
            <span className="line">Global</span>
            <span className="line">Movement.</span>
          </h1>

          {/* Right Column (2 lines) */}
          <h1 className="cf-hero-h1 right" data-split>
            <span className="line">New</span>
            <span className="line">
              <span className="cf-hero-accent-text">Future.</span>
            </span>
          </h1>

          {/* Lede Paragraph */}
          <p className="cf-hero-lede">
            Culture Flow is India&apos;s premier global education mobility and
            university pathway platform. We partner directly with world-class
            academic institutions to build pathways students don&apos;t just
            follow — they embrace.
          </p>
          <Link href="/waitlist" className="hero-cta">
            JOIN WAITLIST
            <span className="hero-cta__arrow">↗</span>
          </Link>
        </div>

        {/* ═══ FOOTER (FLOOR FOR BOUNCING COINS) ═══ */}
        <footer ref={footRef} id="cf-hero-foot" className="cf-hero-footer">
          <span>
            Based in:{" "}
            <b>
              New Delhi <span id="cf-hero-clock">{delhiTime}</span> IST · Global Pathways
            </b>
          </span>
          <span>
            Say hello:{" "}
            <a href="mailto:admissions@cultureflow.in">admissions@cultureflow.in</a>
          </span>
        </footer>

        {/* ═══ INTERACTIVE COIN PHYSICS CANVAS ═══ */}
        <canvas id="cf-coins-canvas" ref={canvasRef} />
      </section>
    </div>
  );
}
