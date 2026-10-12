"use client";

import React, { useState, useEffect, useRef } from "react";
import "./valuegrid.css";

// Helper Barcode SVG component to match DeepJudge reference aesthetic
const BarcodeGraphic = ({ seed = 1 }: { seed?: number }) => {
  const bars = [
    { x: 5, w: 3 }, { x: 12, w: 2 }, { x: 18, w: 4 }, { x: 26, w: 2 },
    { x: 32, w: 5 }, { x: 41, w: 2 }, { x: 47, w: 3 }, { x: 54, w: 4 },
    { x: 62, w: 2 }, { x: 68, w: 4 }, { x: 76, w: 3 }, { x: 83, w: 2 },
  ];
  return (
    <svg className="vg-barcode-svg" viewBox="0 0 90 40">
      {bars.map((bar, idx) => (
        <rect
          key={idx}
          x={bar.x}
          y={4}
          width={bar.w}
          height={32}
          fill="#002244"
          opacity={0.85 - ((idx * seed) % 4) * 0.15}
        />
      ))}
    </svg>
  );
};

export default function ValueGrid() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const targetProgress = useRef(0);
  const currentProgress = useRef(0);
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 });

  useEffect(() => {
    let animationFrameId: number;

    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const totalScrollable = rect.height - window.innerHeight;
      if (totalScrollable <= 0) return;

      const currentScroll = -rect.top;
      targetProgress.current = Math.min(Math.max(currentScroll / totalScrollable, 0), 1);
    };

    const updateLoop = () => {
      // Lerp (linear interpolation) for buttery smooth scrolling
      const diff = targetProgress.current - currentProgress.current;

      // If there's a difference, update state
      if (Math.abs(diff) > 0.0001) {
        currentProgress.current += diff * 0.08; // The smaller the multiplier, the smoother/slower the follow
        setScrollProgress(currentProgress.current);
      }

      animationFrameId = requestAnimationFrame(updateLoop);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Initial setup
    handleScroll();
    currentProgress.current = targetProgress.current;
    setScrollProgress(currentProgress.current);

    updateLoop();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Calculate phase progress values
  // Phase 1 -> Phase 2 (0 to 0.45): Collapse scattered items into center dot
  // Phase 2 -> Phase 3 (0.55 to 1.0): Expand center dot into 4 cards

  const p1 = Math.min(Math.max(scrollProgress / 0.45, 0), 1); // 0 (start) to 1 (collapsed)
  const p2 = Math.min(Math.max((scrollProgress - 0.55) / 0.45, 0), 1); // 0 to 1 (grid reveal)

  const cx = dimensions.width / 2;
  const cy = dimensions.height / 2;

  const nodes = [
    { id: "logistics", type: "card", label: "ZERO LOGISTICS", x: -480, y: -260, seed: 1 },
    { id: "safety", type: "card", label: "SAFETY ASSURANCE", x: 460, y: -230, seed: 2 },
    { id: "trust", type: "card", label: "UNCOMPROMISING TRUST", x: -500, y: 220, seed: 3 },
    { id: "mentorship", type: "card", label: "LOCAL MENTORSHIP", x: 480, y: 250, seed: 4 },
    { id: "housing", type: "capsule", label: "VERIFIED HOUSING", x: -220, y: -320 },
    { id: "helpline", type: "capsule", label: "24/7 HELPLINE", x: 260, y: -330 },
    { id: "visa", type: "capsule", label: "VISA PROCESSING", x: -240, y: 310 },
    { id: "transit", type: "capsule", label: "SECURE TRANSIT", x: 230, y: 380 },
  ];

  const edges = [
    { from: "trust", to: "housing" },
    { from: "housing", to: "mentorship" },
    { from: "mentorship", to: "transit" },
    { from: "trust", to: "logistics" },
    { from: "trust", to: "safety" },
    { from: "visa", to: "trust" },
    { from: "helpline", to: "safety" },
  ];

  // 4 Final Grid Value Cards Data
  const valueCards = [
    {
      num: "01",
      title: "Zero Logistics",
      desc: "Complete end-to-end relocation management, visa coordination, and seamless accommodation onboarding."
    },
    {
      num: "02",
      title: "Safety Assurance",
      desc: "24/7 emergency response, verified university housing partners, and safe transit protocols."
    },
    {
      num: "03",
      title: "Uncompromising Trust",
      desc: "100% transparent fee structure, direct university partnerships, and zero hidden costs."
    },
    {
      num: "04",
      title: "End-to-End Care",
      desc: "Comprehensive pre-departure briefings, airport reception, and dedicated local mentorship."
    }
  ];

  return (
    <section ref={containerRef} className="vg-scroll-container">
      <div className="vg-sticky-viewport">
        {/* SVG Curved Dashed Connection Layer */}
        <svg className="vg-svg-layer">
          <g style={{ opacity: 1 - p2, transition: "opacity 0.1s linear" }}>
            {edges.map((edge, i) => {
              const fromNode = nodes.find(n => n.id === edge.from);
              const toNode = nodes.find(n => n.id === edge.to);
              if (!fromNode || !toNode) return null;

              const fx = cx + fromNode.x * (1 - p1);
              const fy = cy + fromNode.y * (1 - p1);
              const tx = cx + toNode.x * (1 - p1);
              const ty = cy + toNode.y * (1 - p1);

              return (
                <path
                  key={i}
                  d={`M ${fx} ${fy} Q ${cx} ${cy} ${tx} ${ty}`}
                  fill="none"
                  stroke="#C89C66"
                  strokeWidth="2"
                  strokeDasharray="8 10"
                  opacity={0.55}
                />
              );
            })}
          </g>
        </svg>

        {/* Phase 1: Scattered Nodes & Headline */}
        <div className="vg-scatter-wrapper">
          {/* Center Headline */}
          <div
            className="vg-center-headline"
            style={{
              opacity: Math.max(1 - p1 * 2, 0),
              transform: `scale(${1 + p1 * 0.3}) translateY(${-p1 * 40}px)`
            }}
          >
            <h2 className="vg-center-title">
              Your Peace of Mind <br />
              <span style={{ color: "#C89C66" }}>is Our Core Commitment</span>
            </h2>
            <p className="vg-center-subtitle">
              Complex international relocation turned into structured, effortless success.
            </p>
          </div>

          {/* Floating Nodes */}
          {nodes.map((node) => {
            const currentX = node.x * (1 - p1);
            const currentY = node.y * (1 - p1);
            const currentScale = 1 - p1 * 0.7;
            const currentOpacity = Math.max(1 - p1 * 1.8, 0);

            return (
              <div
                key={node.id}
                className="vg-floating-node"
                style={{
                  transform: `translate(${currentX}px, ${currentY}px) scale(${currentScale})`,
                  opacity: currentOpacity
                }}
              >
                {node.type === "card" ? (
                  <div className="vg-card-node">
                    <span className="vg-card-label">{node.label}</span>
                    <BarcodeGraphic seed={node.seed} />
                  </div>
                ) : (
                  <div className="vg-capsule-node">
                    <span className="vg-capsule-text">{node.label}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Phase 2 & 3: The Dot & Grid Expansion */}

        {/* The single dot that sits in the center before breaking */}
        {p1 > 0.6 && (
          <div
            className="vg-center-dot"
            style={{
              opacity: p2 < 0.5 ? 1 : 0, // Hides instantly when cards take over
              width: '16px',
              height: '16px',
              background: '#C89C66',
              borderRadius: '50%',
              boxShadow: '0 0 24px rgba(200, 156, 162, 0.8)',
              zIndex: 3
            }}
          />
        )}

        {/* Phase 3b: The cards appear overlapping and pull apart */}
        <div
          className="vg-grid-wrapper"
          style={{
            opacity: p2 > 0.5 ? 1 : 0,
            // Start at 0px offset to perfectly align with the gold dot, then drift downwards by 120px to fill the bottom space
            transform: `translateY(${Math.max((p2 - 0.5) / 0.5, 0) * 120}px)`,
            pointerEvents: p2 > 0.5 ? 'auto' : 'none',
            position: 'relative',
            justifyContent: 'center',
            zIndex: 4
          }}
        >
          <div
            className="vg-grid-top-border"
            style={{
              opacity: p2 > 0.5 ? (p2 - 0.5) * 2 : 0,
              transform: `scaleX(${Math.pow(p2, 0.5)})`,
              transformOrigin: "center",
              position: 'absolute',
              top: '-100px'
            }}
          />

          <div
            className="vg-grid-header"
            style={{
              opacity: p2 > 0.5 ? (p2 - 0.5) * 2 : 0,
              position: 'absolute',
              top: '-200px',
              width: '100%',
              textAlign: 'center'
            }}
          >
            <p className="vg-grid-header-sub">WHY CULTURE FLOW</p>
            <h3 className="vg-grid-header-title">Structured Mobility Infrastructure</h3>
          </div>

          <div className="vg-cards-grid">
            {valueCards.map((card, idx) => {
              // The cards start perfectly overlapped when they appear at p2=0.5, and pull apart
              const pullProgress = Math.max((p2 - 0.5) / 0.5, 0);

              // To make grid items perfectly overlap at the exact center, we must account for their % width AND the 24px grid gaps!
              const pctOffsets = [150, 50, -50, -150];
              const pxOffsets = [36, 12, -12, -36]; // 1.5 * 24, 0.5 * 24, etc.

              const currentPct = pctOffsets[idx] * (1 - pullProgress);
              const currentPx = pxOffsets[idx] * (1 - pullProgress);

              return (
                <div
                  key={idx}
                  style={{
                    position: 'relative',
                    // Wrapper handles the exact horizontal sliding using calc() to counteract grid gaps
                    transform: `translateX(calc(${currentPct}% + ${currentPx}px))`,
                    height: '100%'
                  }}
                >
                  {/* Vertical connecting line from top header line to this card */}
                  <div style={{
                    position: 'absolute',
                    top: -100, // Reaches exactly up to the horizontal line at -100px
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 3,
                    height: 100, // Spans the full 100px gap
                    borderLeft: '3px dashed #C89C66',
                    opacity: p2 > 0.8 ? (p2 - 0.8) * 5 : 0, // Fades in smoothly at the end
                    transition: 'opacity 0.1s ease',
                    pointerEvents: 'none'
                  }} />
                  {/* Small gold dot connecting line to card */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '-6px',
                      left: '50%',
                      transform: `translateX(-50%) scale(${pullProgress > 0.8 ? 1 : 0})`,
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      background: '#C89C66',
                      opacity: pullProgress > 0.8 ? (pullProgress - 0.8) * 5 : 0,
                      transition: 'opacity 0.2s, transform 0.2s',
                      zIndex: 2
                    }}
                  />

                  {/* The Actual Card */}
                  <div
                    className="vg-value-card"
                    style={{
                      opacity: 1,
                      borderRadius: pullProgress < 0.5 ? '40px' : '16px',
                      borderColor: pullProgress > 0.2 ? 'rgba(0, 34, 68, 0.08)' : 'transparent',
                      transition: 'border-radius 0.2s ease, border-color 0.2s ease',
                      height: '100%',
                      background: 'transparent' // Background must be transparent so pseudo glow can go behind the inner bg
                    }}
                  >
                    {/* Inner Solid Background to sit on top of the glowing pseudo-elements */}
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: '#F5EFE1', // Light cream color
                      borderRadius: 'inherit',
                      zIndex: -1
                    }} />

                    <div style={{ opacity: pullProgress, display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                      <div>
                        <div className="vg-card-num">{card.num}</div>
                        <h4 className="vg-card-title">{card.title}</h4>
                      </div>
                      <p className="vg-card-desc" style={{ marginTop: 'auto' }}>{card.desc}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
