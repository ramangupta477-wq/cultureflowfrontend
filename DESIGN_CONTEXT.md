# Culture Flow — Design Context & Design System Specification

> **Document Version:** 1.0.0  
> **Brand Kit Reference:** Culture Flow Brand Kit 1.0  
> **Target Audience:** Designers, Frontend Engineers, Motion Designers, Product Architects, AI Pair Programmers  
> **Repository:** `culture_flow`

---

## 1. Executive Summary & Brand Identity

### 1.1 Brand Mission & Vision
**Culture Flow** is a premier global educational mobility and university pathway infrastructure platform. It transforms Indian student mobility through structured, accredited educational programs, partnering directly with world-class academic institutions (including Oxford, Harvard, TUM Munich, and NUS Singapore).

- **Brand Essence:** Seamless academic transition, institutional credibility, uncompromising student safety, and elite educational elevation.
- **Brand Slogan:** `One Step. New Future.`
- **Tone of Voice:** Authoritative yet warm, prestigious, transparent, aspirational, and meticulously organized.
- **Design Philosophy:** Editorial luxury meets modern interactive WebGL engineering. The interface departs from generic SaaS blueprints, delivering a warm parchment editorial aesthetic (reminiscent of bespoke academic journals, timeless cartography, and high-end print design) elevated by physics-driven motion, 3D WebGL globes, and interactive scroll storytelling.

---

## 2. Brand Assets & Logo Architecture

### 2.1 Logo Mark & Monogram
- **Mark:** Custom **CF Monogram** featuring an upward curved flight trajectory with a dashed navigational track and an ascending airplane silhouette bridging the **C** and the **F**.
- **Wordmark:** **CULTURE FLOW** set in **Playfair Display (ExtraBold)**, tracked with generous spacing.
- **Lockup Variants:**
  1. **Primary Horizontal Lockup:** Monogram on the left, vertical separator line, stacked wordmark (`CULTURE` over `FLOW`) on the right.
  2. **Monogram Icon Only:** For favicons, loading state centers, and app icons.
  3. **Tagline Lockup:** Primary lockup with `One Step. New Future.` anchored below in serif italic.

### 2.2 Allowed Color Variations
| Context | Monogram / Text | Background | Usage Rule |
| :--- | :--- | :--- | :--- |
| **Light Canvas (Primary)** | Navy `#050A30` / `#002244` | Parchment `#F6EEDD` or White `#FCFCFF` | Default web & brand collateral |
| **Dark Canvas (Inverted)** | Pure White `#FFFFFF` | Deep Navy `#050A30` or Charcoal `#1A1508` | Footers, hero overlays, dark cards |
| **Gold Monogram** | Solid Gold `#C89C66` | Strictly restricted | *Disallowed on light grounds* per Brand Kit |

---

## 3. Color System & Design Tokens

Culture Flow operates on a curated dual palette: the **Official Corporate Identity** (defined in Brand Kit 1.0) and the **Warm Editorial Web Canvas** (developed for the digital web experience).

### 3.1 Core Color Tokens

```css
:root {
  /* ─── Official Brand Palette ─── */
  --color-navy:        #050A30; /* Primary Brand Dark (CMYK: 90, 79, 0, 81 | RGB: 5, 10, 48) */
  --color-gold:        #C89C66; /* Signature Accent Gold (CMYK: 0, 22, 49, 22 | RGB: 200, 156, 102) */
  --color-text:        #002244; /* High-contrast Body Navy */
  --color-brand-white: #FCFCFF; /* Official Brand Kit Canvas Tint */

  /* ─── Editorial Web Warmth Tokens ─── */
  --color-bg:          #F6EEDD; /* Warm Cream / Parchment Main Canvas */
  --color-bg-card:     #ECE2CF; /* Subtle Contrast Surface (Stats / Panels) */
  --color-bg-card-alt: #F5EFE1; /* Value Grid Card Surface */
  --color-bg-hover:    #E6DCB8; /* Active / Hover State for Cards */

  /* ─── Translucent Tints & Overlays ─── */
  --color-gold-light:  rgba(200, 156, 102, 0.15);
  --color-gold-glow:   rgba(200, 156, 102, 0.35);
  --color-navy-light:  rgba(5, 10, 48, 0.08);
  --color-border-subtle: rgba(0, 34, 68, 0.06);

  /* ─── Shading & Accents ─── */
  --shader-c1:         #473C30; /* Light Umber Brown */
  --shader-c2:         #8A6B46; /* Medium Warm Ochre */
  --shader-c3:         #E6C799; /* Luminous Warm Gold */
  --shader-c4:         #FFFBF0; /* Near-white Cream highlight */
}
```

### 3.2 Semantic Color Mapping
- **Primary Action (CTA):** Deep Navy (`#050A30`) background with Cream text (`#F6EEDD`) and Gold (`#C89C66`) directional icons.
- **Secondary Action / Tags:** Transparent background with subtle translucent border (`rgba(255, 255, 255, 0.15)` or `rgba(0, 34, 68, 0.1)`), transitioning to Gold hover tint.
- **Borders & Dividers:** Gold hairpins (`#C89C66` with 0.3–0.5 opacity) or subtle navy lines (`rgba(0, 34, 68, 0.08)`).
- **Selection Color:** Background `#C89C66`, text `#F6EEDD`.

---

## 4. Typography Hierarchy & Font Pairings

The typography system fuses classical literary serif forms with functional modern grotesque sans-serifs and calligraphic script accents.

### 4.1 Typeface Matrix

| Role | Font Family | Google Font / Source | Weights | Intent & Feeling |
| :--- | :--- | :--- | :--- | :--- |
| **Display Headings** | `Oranienbaum` | Google Fonts | 400 (Regular) | Classical antiqua, dramatic contrast, prestigious institutional authority |
| **Wordmark Display** | `Playfair Display` | Google Fonts | 800 (ExtraBold), 400 Italic | Editorial emphasis, brand presence, literary elegance |
| **Body & UI Elements** | `Inter` (Web) / `TT Norms` (Print) | Google Fonts | 300, 400, 500, 600, 700 | Flawless digital legibility, tabular numerals, clean metrics |
| **Script Flourishes** | `Carattere` / `Alex Brush` | Google Fonts / Next Font | 400 (Regular) | Handcrafted human touch for program taglines and category stamps |

### 4.2 Typographic Hierarchy Scale

```css
/* Display & Hero Headlines */
.font-display-hero {
  font-family: var(--font-heading); /* Oranienbaum */
  font-size: clamp(2.4rem, 5.4vw, 4.2rem);
  font-weight: 400;
  line-height: 1.1;
  letter-spacing: 0.01em;
}

/* Section Headings */
.font-heading-section {
  font-family: var(--font-heading);
  font-size: clamp(2.2rem, 3.6vw, 3.5rem);
  font-weight: 400;
  line-height: 1.16;
  letter-spacing: -0.015em;
  color: var(--color-text);
}

/* Script Taglines */
.font-script-accent {
  font-family: var(--font-script); /* Carattere */
  font-size: clamp(1.4rem, 2vw, 1.8rem);
  color: var(--color-gold);
  line-height: 1;
}

/* Card & Spec Numbers */
.font-metric-num {
  font-family: var(--font-body); /* Inter */
  font-size: clamp(2.8rem, 4vw, 4.4rem);
  font-weight: 600;
  letter-spacing: -0.03em;
  font-variant-numeric: tabular-nums;
}

/* Body Paragraphs */
.font-body-copy {
  font-family: var(--font-body);
  font-size: clamp(0.96rem, 1.32vw, 1.14rem);
  font-weight: 400;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.55); /* or var(--color-text) on light grounds */
}

/* Micro Tags & Badges */
.font-pill-badge {
  font-family: var(--font-body);
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
```

---

## 5. Motion, Physics & Interactive Philosophy

Motion is not decorative in Culture Flow; it acts as a spatial narrative guiding the student from apprehension to complete structured peace of mind.

### 5.1 Easing & Timing Curves
- **Snappy Entrance (`--ease-out-expo`):** `cubic-bezier(0.16, 1, 0.3, 1)` — Used for card reveals, heading arrivals, and loader exits.
- **Smooth Transition (`--ease-in-out`):** `cubic-bezier(0.65, 0, 0.35, 1)` — Used for camera pans and color fades.
- **Lerp Scroll Smoothing:** Multiplier `0.08` to `0.085` via `requestAnimationFrame` for scrubbed timelines (ValueGrid & ProgramSection).

### 5.2 Smooth Scroll Architecture
- **Engine:** **Lenis** (`lenis/react`).
- **Scroll Lock Protocol:** Native and Lenis scroll locks are strictly enforced during the Hero Loader & Line Drawing reveal phases:
  ```ts
  if (phase !== "hero") {
    document.body.style.overflow = "hidden";
    lenis.stop();
  } else {
    document.body.style.overflow = "";
    lenis.start();
  }
  ```

### 5.3 Elliptical Curtain Transition (`section-transition-effect.tsx`)
- **Technique:** GSAP `ScrollTrigger` driving dynamic SVG/CSS `clip-path: ellipse()`.
- **Closed State:** `clip-path: ellipse(220% 200% at 50% 300%)` (Pushed deep below viewport).
- **Open State:** `clip-path: ellipse(220% 200% at 50% 175%)` (Curved upward swell covering previous section like an organic curtain).

---

## 6. Section-by-Section Architectural Specifications

### 6.1 Background: Procedural WebGL Shader (`ShaderBackground.tsx`)
- **Purpose:** Replaces static flat backgrounds with a living, subtle, organic warmth.
- **Technique:** WebGL fragment shader with Fractional Brownian Motion (5 octaves FBM), OKLab color mixing, procedural grain hash, and soft vignette.
- **Palette Array:** 4 blended colors: `#473C30`, `#8A6B46`, `#E6C799`, and `#FFFBF0`.
- **Performance:** Single full-screen triangle (`[-1,-1, 3,-1, -1,3]`), no heavy vertex overhead, auto-pausing via `document.visibilitychange`.

### 6.2 Hero Section & 3D Vector Globe (`HeroSection.tsx`, `GlobeLineDrawing.tsx`)
The Hero section delivers a cinematic 3-phase onboarding experience:

```
[Phase 1: "loading"]       --> [Phase 2: "revealing"]     --> [Phase 3: "hero"]
- Centered CF Logo             - Loader fades (0.9s)          - Nav drops into view
- 0% → 100% Counter            - 3D Globe lines draw          - Headlines slide up
- Gold progress bar fill         outward from India (2.8s)    - Lenis scroll unlocked
```

- **Interactive 3D Globe Specs:**
  - **Technology:** Three.js + `OrbitControls`.
  - **Origin Point:** India coordinates `{ lat: 20.5937, lng: 78.9629 }`.
  - **GeoJSON Source:** 110m Natural Earth administrative country polygons.
  - **Shaders:** Custom vertex & fragment shaders indexing distance from India to trigger an organic outward radial wave of lines.
  - **Atmosphere:** Ghosted reference sphere (`#1A1508`, opacity `0.18`), 30° lat/long grid, and radial gold drop glow (`rgba(200, 156, 102, 0.32)`).
  - **Auto-Rotation:** Speed `0.6` (positive left-to-right rotation).

### 6.3 Value Grid & Mobility Infrastructure (`valuegrid.tsx`, `valuegrid.css`)
Inspired by clean algorithmic infrastructure visualizations (DeepJudge style):
- **Mechanism:** Pinned scroll container (`height: 300vh+`).
- **Interactive Stages:**
  - **Stage 1 (0.00 – 0.45):** 6 scattered benefit nodes ("Zero Logistics", "Safety Assurance", "Uncompromising Trust", "Local Mentorship", "Verified Housing", "24/7 Helpline") linked by curved dashed SVG beziers (`stroke-dasharray="8 10"`).
  - **Stage 2 (0.45 – 0.55):** Nodes compress inward along bezier tangents into a single glowing gold focal dot (`#C89C66`).
  - **Stage 3 (0.55 – 1.00):** The center dot splits apart into 4 structured rectangular cards with vertical dashed feeder lines:
    1. `01` **Zero Logistics:** End-to-end relocation, visa coordination, accommodation onboarding.
    2. `02` **Safety Assurance:** 24/7 emergency response, verified housing partners, safe transit.
    3. `03` **Uncompromising Trust:** 100% transparent fee structures, direct university partnerships.
    4. `04` **End-to-End Care:** Pre-departure briefings, airport reception, local mentors.
- **Barcode Graphic:** Vector SVG barcodes on cards echoing logistical precision.

### 6.4 Impact Metrics Section (`StatsSection.tsx`, `StatsSection.css`)
- **Grid Layout:** 5-column responsive card arrangement on `#F6EEDD` canvas.
- **Card Surfaces:** `#ECE2CF` with 18px corner radiuses and subtle navy borders.
- **Counters:**
  - `+65h` Saved per student on visa & relocation paperwork
  - `+85%` Adoption & completion across global mobility cohorts
  - `+23` Partner universities across 12+ international hubs
  - `+4x ROI` In the first year of global campus transition
  - `90%` Report seamless cultural integration & zero relocation friction
- **Interaction:** `IntersectionObserver` initiates a 1.9s cubic ease-out counter with staggered card entrance. Hover states elevate card by `-5px` with enhanced soft shadows.

### 6.5 Curated Pathways Horizontal Scroller (`ProgramSection.tsx`, `ProgramSection.css`)
- **Stage Progression:**
  - **Phase A (0.00 – 0.10):** White intro card expands, title slides UP, description slides DOWN, faint world map SVG in background fades.
  - **Phase B (0.10 – 0.22):** The featured campus photograph expands continuously into the hero column position.
  - **Phase C (0.22 – 0.32):** Left and right metadata panels slide in laterally.
  - **Phase D (0.32 – 1.00):** Horizontal pinned track (`cf-horizontal-track`) translates across 4 curated elite pathways:
    1. **University of Oxford** (`Collegiate Excellence` · `OXFORD GLOBAL FELLOWS`)
    2. **Harvard University** (`Ivy League Legacy` · `HARVARD LEADERSHIP COHORT`)
    3. **TUM Munich** (`Engineering Pioneers` · `TUM MUNICH DEEP TECH & AI`)
    4. **NUS Singapore** (`Future of Asia` · `NUS SINGAPORE VENTURE VANGUARD`)
- **Navigation Controls:** Bottom interactive pill selectors (`01 Oxford`, `02 Harvard`, `03 TUM Munich`, `04 NUS Singapore`) allowing direct programmatic smooth scrolling to specific slides.

### 6.6 Social Proof & Verified Reviews (`ReviewsSection.tsx`, `ReviewsSection.css`)
- **Layout:** 3-column masonry grid populated by 9 detailed student experiences.
- **Visual Motif:** Conversational speech bubble cards with custom directional tails, author avatar initials, three-dot options icon (`⋯`), and verified Facebook-style recommendation badges (`[✔] recommends Culture Flow`).
- **Watermark:** Huge serif outline background typography: *"Kind Words From Our Successful Students"*.

### 6.7 Architectural Footer & Lead Ingestion (`Footer.tsx`, `Footer.css`)
- **Background:** High-atmosphere moody campus imagery (`footer-bg.jpg`) with deep navy gradient overlay.
- **Left Column:**
  - Physical office addresses: **New Delhi HQ** (Connaught Place) and **Mumbai Office** (Bandra West).
  - Interactive circular arrow links (`↗`).
  - Contact links (`hello@cultureflow.in`, `+91 123 456 7890`) and social links.
- **Right Column:** High-converting student consultation form (`Name`, `Email`, `Phone`, `Institution`, `Message`).
- **Bottom Legal Bar:** Full corporate disclosures including CIN (`U80902DL2024PTC123456`), registered address, trademark copyright, and creator signature.

---

## 7. UI Components Anatomy & Design Patterns

### 7.1 Buttons & Interactive Links
```css
/* Primary Action Pill */
.hero-cta {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 28px;
  background: #050A30;
  color: #F6EEDD;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  border-radius: 50px;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.hero-cta:hover {
  background: #C89C66;
  color: #050A30;
  box-shadow: 0 8px 24px rgba(200, 156, 102, 0.4);
}

/* Arrow Circle Icon Button */
.cf-footer-arrow-circle {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease, border-color 0.3s ease;
}
```

### 7.2 Service & Filter Tags
```css
.hero-tag {
  display: inline-flex;
  align-items: center;
  padding: 8px 18px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 50px;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.85);
  background: transparent;
  transition: all 0.3s ease;
}
.hero-tag:hover {
  border-color: #C89C66;
  color: #FFFFFF;
  background: rgba(200, 156, 102, 0.15);
}
```

### 7.3 Form Input Fields
- **Background:** Semi-transparent dark wash (`rgba(255, 255, 255, 0.05)`).
- **Border:** `1px solid rgba(255, 255, 255, 0.12)` transitioning to `#C89C66` on focus.
- **Border Radius:** `8px` to `12px`.
- **Text Color:** `#F6EEDD`.

---

## 8. Asset Inventory & Paths

| Asset Name | Relative Path | Purpose |
| :--- | :--- | :--- |
| **Brand Logo (Vector)** | `/homepage_assets/Culture Flow logo.svg` | Navigation bar, hero loader |
| **World Map (Vector)** | `/homepage_assets/world.svg` | ProgramSection atmospheric background |
| **Airplane Silhouette** | `/homepage_assets/plane.png` | Graphical trajectory flourishes |
| **Footer Background** | `/homepage_assets/footer-bg.jpg` | Footer high-atmosphere image layer |
| **Oxford University** | `/homepage_assets/programs/oxford.jpg` | Oxford Global Fellows card |
| **Harvard University** | `/homepage_assets/programs/harvard.jpg` | Harvard Leadership Cohort card |
| **TUM Munich** | `/homepage_assets/programs/munich.jpg` | Munich Deep Tech card |
| **NUS Singapore** | `/homepage_assets/programs/singapore.jpg` | NUS Venture Vanguard card |
| **Brand Kit PDF** | `/src/app/resources/Culture Flow Brand Kit 1.0.pdf` | Master Brand Guidelines 1.0 |

---

## 9. Engineering & Performance Conventions

1. **Client vs Server Components:**
   - Keep page-level routing and SEO metadata in Server Components (`layout.tsx`, `page.tsx`).
   - Use `"use client"` exclusively for interactive, Three.js, GSAP, or Lenis-dependent components (`HeroSection`, `ValueGrid`, `ProgramSection`, etc.).
2. **Three.js SSR Isolation:**
   - Always load Three.js / WebGL canvas components with Next.js dynamic import (`ssr: false`):
     ```ts
     const GlobeLineDrawing = dynamic(() => import("./GlobeLineDrawing"), { ssr: false });
     ```
3. **Hardware Acceleration:**
   - Apply `will-change: transform, opacity;` strictly to animated elements (loaders, pinned cards, clip-path wrappers).
   - Cap WebGL DPR to `Math.min(window.devicePixelRatio, 2)` to protect battery life and GPU frame rates on mobile/retina displays.
4. **Data Isolation:**
   - Maintain program curricula and student reviews inside dedicated data modules (`src/data/programsData.ts`, `src/data/reviewsData.ts`) to enable rapid headless CMS or database integration.
