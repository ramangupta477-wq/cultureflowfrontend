"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import BlurText from "@/components/ui/BlurText";
import "./ValuesSection.css";

const STEPS = [
  {
    title: "Discovery",
    copy: "It starts with a conversation. Tell us about your goals, interests, and ambitions — we listen closely to understand who you are and where you want to go.",
    mark: "M 15 148 C 110 24 310 0 474 82 S 690 183 884 40",
  },
  {
    title: "Matching",
    copy: "We research and shortlist the universities, courses, and destinations that align perfectly with your profile, budget, and long-term aspirations.",
    mark: "M 20 104 C 190 0 520 0 768 72 C 900 112 720 170 330 148 C -40 127 -28 64 164 25",
  },
  {
    title: "Application",
    copy: "From personal statements to submission deadlines, our team guides you through every step of the application with clarity and precision.",
    mark: "M 18 104 C 220 190 195 0 360 54 C 500 128 490 218 645 93 S 812 22 884 75",
  },
  {
    title: "Preparation",
    copy: "Visa support, accommodation, finances, and pre-departure briefings — we handle the details so you can focus on what matters most.",
    mark: "M 6 145 C 225 177 490 24 355 48 C 152 84 370 186 522 127 S 740 4 884 23",
  },
  {
    title: "Arrival",
    copy: "Landing in a new country is a big moment. We stay connected to make sure you settle in smoothly and feel at home from day one.",
    mark: "M 5 172 L 890 5",
  },
  {
    title: "Growth",
    copy: "Your journey doesn't end at enrollment. We're here as you build confidence, lasting friendships, and a wider view of your future.",
    mark: "M 84 104 L 184 161 C 278 82 406 17 528 0",
  },
];

const clamp = (value: number) => Math.max(0, Math.min(1, value));

export default function ValuesSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [seen, setSeen] = useState(false);
  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const targetProgress = useRef(0);
  const currentProgress = useRef(0);
  const frameRef = useRef(0);
  const lastTimeRef = useRef(0);
  const activeRef = useRef(-1);

  // Viewport observer to trigger BlurText animation on entering and reverse on leaving
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      {
        threshold: 0.02,
      }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

    const tick = (now: number) => {
      const elapsed = Math.min(0.06, (now - lastTimeRef.current) / 1000 || 0);
      lastTimeRef.current = now;
      currentProgress.current = reduced
        ? targetProgress.current
        : currentProgress.current + (targetProgress.current - currentProgress.current) * (1 - Math.exp(-elapsed * 4.2));

      const progress = currentProgress.current;
      const index = Math.min(STEPS.length - 1, Math.floor(targetProgress.current * STEPS.length + 0.0001));
      if (index !== activeRef.current) {
        activeRef.current = index;
        setActiveIndex(index);
      }

      const paths = section.querySelectorAll<SVGPathElement>(".values-marks path");
      const stage = stageRef.current;
      if (!stage || paths.length !== STEPS.length) return;

      const stageRect = stage.getBoundingClientRect();
      const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
      const k = rem / 16;
      const list = section.querySelector<HTMLOListElement>(".values-list");
      const firstCopy = section.querySelector<HTMLElement>(".values-text p");
      const listItems = [...section.querySelectorAll<HTMLElement>(".values-list li")];
      if (!list || !firstCopy || listItems.length !== STEPS.length) return;
      const firstRect = firstCopy.getBoundingClientRect();
      const copyTop = firstRect.top - stageRect.top;
      const copyLeft = firstRect.left - stageRect.left;
      const lineHeight = parseFloat(getComputedStyle(firstCopy).lineHeight);
      const fontSize = parseFloat(getComputedStyle(list).fontSize);
      const point = (x: number, y: number) => `${x.toFixed(1)} ${y.toFixed(1)}`;
      const itemRects = listItems.map((item) => {
        const rect = (item.querySelector<HTMLElement>("button") ?? item).getBoundingClientRect();
        return {
          left: rect.left - stageRect.left,
          right: rect.right - stageRect.left,
          centerY: rect.top - stageRect.top + rect.height / 2,
          baseline: rect.top - stageRect.top + rect.height / 2 + fontSize * 0.27,
          width: rect.width,
        };
      });
      const end = { x: copyLeft - rem * 0.45, y: copyTop + lineHeight * 0.46 };
      const pathsData = [
        (() => { const r = itemRects[0]; const sx = r.right + rem * 0.3, sy = r.centerY + rem * 0.15; const o = (x:number,y:number) => point(sx+x*k, sy+y*k); return `M ${point(sx,sy)} C ${o(60,-30)} ${o(190,-50)} ${o(270,-10)} C ${o(330,25)} ${o(300,95)} ${o(230,125)} C ${o(140,150)} ${o(75,105)} ${o(95,70)} C ${o(115,25)} ${o(210,25)} ${o(250,75)} C ${o(290,120)} ${o(290,170)} ${o(265,165)} C ${o(240,160)} ${o(245,110)} ${o(290,70)} C ${o(340,25)} ${point(end.x-100*k,end.y+8*k)} ${point(end.x,end.y)}`; })(),
        (() => { const r = itemRects[1], by = r.baseline + rem * 1.35, left = r.left - rem * 0.1, right = r.right + rem * 1.9; const o = (x:number,y:number) => point(x,by+y*k); return `M ${o(left,4)} C ${o(left+rem*4.4,-6)} ${o(left+rem*9.4,-12)} ${o(right,-2)} C ${o(right-rem*1.9,12)} ${o(left+rem*5.6,16)} ${o(left+rem*1.0,10)}`; })(),
        (() => { const r = itemRects[2], sx = r.right + rem * 0.3, sy = r.centerY; const o = (x:number,y:number) => point(sx+x*k,sy+y*k); return `M ${point(sx,sy)} C ${o(60,6)} ${o(200,10)} ${o(260,-12)} C ${o(305,-32)} ${o(310,-82)} ${o(268,-80)} C ${o(228,-78)} ${o(232,-22)} ${o(300,-26)} C ${o(390,-30)} ${point(end.x-90*k,end.y+36*k)} ${point(end.x,end.y)}`; })(),
        (() => { const r = itemRects[3]; return `M ${point(r.right+rem*0.3,r.centerY+rem*0.05)} L ${point(end.x,end.y+rem*0.1)}`; })(),
        (() => { const r = itemRects[4], cx=(r.left+r.right)/2, cy=r.centerY+rem*0.1, rx=r.width/2+rem*1.15, ry=rem*1.95, tilt=-3*Math.PI/180; const pts=[]; for(let i=0;i<=110;i++){const a=Math.PI*1.08+Math.PI*2.18*i/110,g=1+0.07*i/110,x=Math.cos(a)*rx*g,y=Math.sin(a)*ry*g;pts.push(point(cx+x*Math.cos(tilt)-y*Math.sin(tilt),cy+x*Math.sin(tilt)+y*Math.cos(tilt)));} return `M ${pts.join(" L ")}`; })(),
        (() => { const r = itemRects[5], ax=r.left-rem*3, ay=r.centerY+rem*0.05, bx=r.left-rem*2.15, by=r.centerY+rem, cx=r.left-rem*0.55, cy=r.centerY-rem*1.15; return `M ${point(ax,ay)} C ${point(ax+rem*0.3,ay+rem*0.35)} ${point(bx-rem*0.3,by-rem*0.35)} ${point(bx,by)} C ${point(bx+rem*0.35,by-rem*0.7)} ${point(cx-rem*0.7,cy+rem*0.8)} ${point(cx,cy)}`; })(),
      ];
      paths.forEach((path, i) => {
        if (path.getAttribute("d") !== pathsData[i]) path.setAttribute("d", pathsData[i]);
        const localProgress = progress * STEPS.length - i;
        const draw = clamp(localProgress / 0.6);
        const fade = i === STEPS.length - 1 ? 1 : 1 - clamp((localProgress - 1.02) / 0.3);
        const length = path.getTotalLength();
        path.style.strokeDasharray = `${length} ${length + 2}`;
        path.style.strokeDashoffset = `${length * (1 - draw)}`;
        path.style.opacity = draw > 0.002 ? `${fade}` : "0";
      });

      if (Math.abs(targetProgress.current - currentProgress.current) > 0.0004) {
        frameRef.current = requestAnimationFrame(tick);
      } else {
        frameRef.current = 0;
      }
    };

    const update = () => {
      const rect = section.getBoundingClientRect();
      const span = section.offsetHeight - window.innerHeight;
      const raw = span > 0 ? clamp(-rect.top / span) : 0;
      targetProgress.current = clamp((raw - 0.04) / 0.92);

      if (rect.top < window.innerHeight * 0.8) setSeen(true);
      if (!frameRef.current) frameRef.current = requestAnimationFrame(tick);
    };

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
    requestAnimationFrame(() => {
      update();
      requestAnimationFrame(() => update());
    });

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      cancelAnimationFrame(frameRef.current);
      frameRef.current = 0;
    };
  }, []);

  const scrollToValue = (index: number) => {
    const section = sectionRef.current;
    if (!section) return;
    const top = section.getBoundingClientRect().top + window.scrollY;
    const span = section.offsetHeight - window.innerHeight;
    const progress = (index + 0.7) / STEPS.length;
    window.scrollTo({ top: top + (0.04 + progress * 0.92) * span, behavior: "smooth" });
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    event.preventDefault();
    const next = (index + (event.key === "ArrowDown" ? 1 : STEPS.length - 1)) % STEPS.length;
    setActiveIndex(next);
    (listRef.current?.children[next].querySelector("button") as HTMLButtonElement)?.focus();
    scrollToValue(next);
  };

  return (
    <section ref={sectionRef} id="values" className="values-section" data-bg-fade="#FDFCF4">
      <div className="values-sticky">
        
        {/* Editorial Header */}
        <div className="values-header">
          <div className={`values-kicker ${inView ? "" : "is-hidden"}`}>
            <span className="values-kicker-dot" aria-hidden="true" />
            <span>04 — HOW IT WORKS</span>
            <span className="values-kicker-count">[06 STEPS]</span>
          </div>
          <BlurText
            as="h2"
            text="How it works"
            effect="blur"
            animateBy="words"
            direction="top"
            staggerFrom="start"
            inView={inView}
            reverse={true}
            delay={120}
            stepDuration={0.38}
            blur={14}
            distance={36}
            className="values-heading"
          />
        </div>

        {/* Dynamic Interactive Stage */}
        <div ref={stageRef} className="values-stage">
          <ol ref={listRef} className="values-list" role="tablist" aria-label="How it works" aria-orientation="vertical">
            {STEPS.map((step, index) => (
              <li key={step.title} className={`${seen ? "in" : ""} ${index === activeIndex ? "on" : ""}`}>
                <button
                  type="button"
                  role="tab"
                  aria-selected={index === activeIndex}
                  onClick={() => scrollToValue(index)}
                  onKeyDown={(event) => handleKeyDown(event, index)}
                >
                  {step.title}
                </button>
              </li>
            ))}
          </ol>

          <div className="values-text" aria-live="polite">
            {STEPS.map((step, index) => (
              <p key={step.title} className={index === activeIndex ? "on" : ""}>{step.copy}</p>
            ))}
          </div>

          <svg className="values-marks" aria-hidden="true">
            {STEPS.map((step) => (
              <path key={step.title} d={step.mark} />
            ))}
          </svg>
        </div>

      </div>
    </section>
  );
}
