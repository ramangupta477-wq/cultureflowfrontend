"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { useBlurReveal } from "@/lib/reveals";
import "./role-picker.css";

const ROLES = ["Student", "Parent", "Corporate Employee"] as const;
// Repeat enough to fill the track above and below center
const ITEMS = [...ROLES, ...ROLES, ...ROLES];

interface RolePickerProps {
  onSelect: (role: string) => void;
}

export default function RolePicker({ onSelect }: RolePickerProps) {
  useBlurReveal();
  const [selected, setSelected] = useState<string | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const pointerDown = useRef(false);
  const dragging = useRef(false);
  const startY = useRef(0);
  const startScroll = useRef(0);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const pillH = 82;
    el.scrollTop = ROLES.length * pillH;
  }, []);

  const handlePick = useCallback((role: string) => {
    if (dragging.current) return;
    setSelected(role);
  }, []);

  const handleNext = () => {
    if (selected) onSelect(selected);
  };

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    pointerDown.current = true;
    dragging.current = false;
    startY.current = e.clientY;
    startScroll.current = trackRef.current?.scrollTop ?? 0;
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!pointerDown.current || !trackRef.current) return;
    const dy = e.clientY - startY.current;
    if (!dragging.current && Math.abs(dy) > 5) {
      dragging.current = true;
      trackRef.current.style.cursor = "grabbing";
    }
    if (dragging.current) {
      trackRef.current.scrollTop = startScroll.current - dy;
    }
  }, []);

  const onPointerUp = useCallback(() => {
    pointerDown.current = false;
    dragging.current = false;
    if (trackRef.current) {
      trackRef.current.style.cursor = "grab";
    }
  }, []);

  return (
    <section className="rp-section" aria-label="Choose your role">
      <div className="rp-inner">
        <h2 className="rp-prompt" data-pr>I am a</h2>

        <div className="rp-track-mask" data-pr style={{ "--pr-d": "0.1s" } as React.CSSProperties}>
          <div
            ref={trackRef}
            className="rp-track"
            role="listbox"
            aria-label="Select your role"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          >
            {ITEMS.map((role, i) => (
              <button
                key={`${role}-${i}`}
                type="button"
                role="option"
                aria-selected={selected === role}
                className={`rp-pill ${selected === role ? "rp-pill--active" : ""}`}
                onClick={() => handlePick(role)}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          className={`rp-next ${selected ? "rp-next--ready" : ""}`}
          disabled={selected === null}
          onClick={handleNext}
          data-pr
          style={{ "--pr-d": "0.2s" } as React.CSSProperties}
          suppressHydrationWarning
        >
          next <span aria-hidden>→</span>
        </button>
      </div>
    </section>
  );
}
