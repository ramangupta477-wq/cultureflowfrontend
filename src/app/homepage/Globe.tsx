"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, useMemo, useCallback } from "react";

// Dynamically import react-globe.gl to prevent SSR issues (WebGL needs window/document)
const GlobeGL = dynamic(() => import("react-globe.gl"), {
  ssr: false,
  loading: () => (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        width: 48,
        height: 48,
        borderRadius: '50%',
        border: '2px solid transparent',
        borderTopColor: '#C89C66',
        borderBottomColor: '#C89C66',
        animation: 'spin 1s linear infinite',
      }} />
    </div>
  ),
});

const INDIA_COORDS = { lat: 20.5937, lng: 78.9629 };

export const LISTED_COUNTRIES = [
  { name: "ITALY", lat: 41.8719, lng: 12.5674, time: "1h" },
  { name: "SPAIN", lat: 40.4637, lng: -3.7492, time: "3h" },
  { name: "GREECE", lat: 39.0742, lng: 21.8243, time: "1h" },
  { name: "UNITED KINGDOM", lat: 55.3781, lng: -3.4360, time: "3h" },
  { name: "GERMANY", lat: 51.1657, lng: 10.4515, time: "2h" },
  { name: "FRANCE", lat: 46.2276, lng: 2.2137, time: "2.5h" },
  { name: "HUNGARY", lat: 47.1625, lng: 19.5033, time: "2h" },
  { name: "AUSTRIA", lat: 47.5162, lng: 14.5501, time: "1.5h" },
  { name: "UNITED STATES", lat: 37.0902, lng: -95.7129, time: "10h" },
  { name: "CANADA", lat: 56.1304, lng: -106.3468, time: "11h" },
  { name: "ISRAEL", lat: 31.0461, lng: 34.8516, time: "3h" },
  { name: "SWITZERLAND", lat: 46.8182, lng: 8.2275, time: "2h" },
  { name: "CZECH REPUBLIC", lat: 49.8153, lng: 15.4730, time: "2h" },
  { name: "DENMARK", lat: 56.2639, lng: 9.5018, time: "3h" },
  { name: "NORWAY", lat: 60.4720, lng: 8.4689, time: "3.5h" },
  { name: "SWEDEN", lat: 60.1282, lng: 18.6435, time: "3.5h" },
  { name: "POLAND", lat: 51.9194, lng: 19.1451, time: "2.5h" },
  { name: "PORTUGAL", lat: 39.3999, lng: -8.2245, time: "4h" },
  { name: "KOSOVO", lat: 42.6026, lng: 20.9030, time: "0.5h" },
  { name: "NORTH MACEDONIA", lat: 41.6086, lng: 21.7453, time: "0.5h" },
  { name: "NETHERLANDS", lat: 52.1326, lng: 5.2913, time: "3h" },
  { name: "BELGIUM", lat: 50.5039, lng: 4.4699, time: "2.5h" },
];

const HIGHLIGHTED_ISO = ["ITA", "ESP", "GRC", "GBR", "DEU", "FRA", "HUN", "AUT", "USA", "CAN", "ISR", "CHE", "CZE", "DNK", "NOR", "SWE", "POL", "PRT", "KOS", "MKD", "NLD", "BEL"];

// Generate arcs from India to other countries
const ARCS_DATA = LISTED_COUNTRIES.map((c, i) => ({
  startLat: INDIA_COORDS.lat,
  startLng: INDIA_COORDS.lng,
  endLat: c.lat,
  endLng: c.lng,
  color: "#C89C66",
  initialGap: (i * 0.4) % 5,
}));

// ─── CUSTOM GRATICULE LINES ───
// Generate latitude and longitude lines as path data.
// Each path is an array of {lat, lng, alt} points.
// Using altitude 0.004 to ensure they render ABOVE polygon caps (at 0.001).
const GRATICULE_ALT = 0.004;
const GRATICULE_STEP = 15; // degrees between lines
const GRATICULE_RESOLUTION = 2; // degrees per segment for smooth curves

function generateGraticuleData() {
  const paths: { points: { lat: number; lng: number; alt: number }[] }[] = [];

  // Latitude lines (horizontal circles) — from -75 to 75
  for (let lat = -75; lat <= 75; lat += GRATICULE_STEP) {
    const points: { lat: number; lng: number; alt: number }[] = [];
    for (let lng = -180; lng <= 180; lng += GRATICULE_RESOLUTION) {
      points.push({ lat, lng, alt: GRATICULE_ALT });
    }
    paths.push({ points });
  }

  // Longitude lines (vertical great-circle arcs) — from -180 to 165
  for (let lng = -180; lng < 180; lng += GRATICULE_STEP) {
    const points: { lat: number; lng: number; alt: number }[] = [];
    for (let lat = -90; lat <= 90; lat += GRATICULE_RESOLUTION) {
      points.push({ lat, lng, alt: GRATICULE_ALT });
    }
    paths.push({ points });
  }

  return paths;
}

const GRATICULE_DATA = generateGraticuleData();
const GRATICULE_POINTS = (d: any) => d.points;
const GRATICULE_POINT_LAT = (p: any) => p.lat;
const GRATICULE_POINT_LNG = (p: any) => p.lng;
const GRATICULE_POINT_ALT = (p: any) => p.alt;
const GRATICULE_COLOR = () => "rgba(139, 115, 85, 0.35)"; // Warm brown, semi-transparent

// Stable callback functions
const POLYGON_CAP_COLOR = (d: any) => HIGHLIGHTED_ISO.includes(d.properties.ADM0_A3) ? "#050A30" : "transparent";
const POLYGON_SIDE_COLOR = () => "transparent";
const POLYGON_STROKE_COLOR = () => "#050A30"; // Using navy for the wireframe lines to contrast with the light background
const ARC_COLOR = (d: any) => d.color;
const ARC_INITIAL_GAP = (d: any) => d.initialGap;
const EMPTY_LABEL = () => "";
const NOOP = () => { };

export interface GlobeProps {
  compact?: boolean;
  hero?: boolean;
  heroSize?: number;
}

export default function Globe({ compact, hero, heroSize }: GlobeProps = {}) {
  const globeEl = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [countries, setCountries] = useState({ features: [] });
  const [globeSize, setGlobeSize] = useState(compact ? 600 : hero ? (heroSize || 550) : 2500);

  useEffect(() => {
    if (compact) {
      setGlobeSize(568); // Increased another 4%
      return;
    }
    if (hero) {
      // Size is controlled by parent via heroSize prop
      if (heroSize) setGlobeSize(heroSize);
      return;
    }
    const updateSize = () => {
      const w = window.innerWidth;
      if (w < 768) {
        setGlobeSize(476); // Increased another 4%
      } else if (w < 1024) {
        setGlobeSize(619); // Increased another 4%
      } else {
        setGlobeSize(757); // Increased another 4%
      }
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, [compact, hero, heroSize]);

  // Load Geographic Data for the globe base
  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson"
    )
      .then((res) => res.json())
      .then((data) => setCountries(data))
      .catch((err) => console.error("Failed to load map data", err));
  }, []);

  // Create globe material — transparent/wireframe look
  const [globeMaterial, setGlobeMaterial] = useState<any>(null);
  useEffect(() => {
    import("three").then((THREE) => {
      setGlobeMaterial(
        new THREE.MeshBasicMaterial({
          color: "#F6EEDD", // Same as bg to make it look transparent
          transparent: true,
          opacity: 0.1,
          depthWrite: true,
        })
      );
    });
  }, []);

  // ─── CONTROLS SETUP ───
  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;
    let initialized = false;

    const setupControls = () => {
      if (!globeEl.current) return;

      try {
        const controls = globeEl.current.controls();
        if (controls && !initialized) {
          initialized = true;
          controls.autoRotate = true;
          controls.autoRotateSpeed = hero ? 0.6 : 0.5;
          controls.enableRotate = !hero;
          controls.enablePan = false;
          controls.enableZoom = false;

          // Set initial camera position looking at India
          globeEl.current.pointOfView({ lat: 20.5937, lng: 78.9629, altitude: hero ? 2.0 : 2.2 }, 0);

          const dist = controls.getDistance();
          if (dist > 0) {
            controls.minDistance = dist;
            controls.maxDistance = dist;
          }

          clearInterval(intervalId);
        }
      } catch {
        // controls not ready yet
      }
    };

    intervalId = setInterval(setupControls, 200);
    setupControls();

    return () => clearInterval(intervalId);
  }, []);

  const resolvedWidth = compact ? '100%' : globeSize;
  const resolvedHeight = compact ? 380 : globeSize;
  const glWidth = compact ? 600 : globeSize;
  const glHeight = compact ? 380 : globeSize;

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        overflow: 'visible',
        width: resolvedWidth,
        height: resolvedHeight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <GlobeGL
        ref={globeEl}
        width={glWidth}
        height={glHeight}
        backgroundColor="rgba(0,0,0,0)"
        showAtmosphere={false}
        showGlobe={true}
        showGraticules={false}
        globeMaterial={globeMaterial}
        pathsData={GRATICULE_DATA}
        pathPoints={GRATICULE_POINTS}
        pathPointLat={GRATICULE_POINT_LAT}
        pathPointLng={GRATICULE_POINT_LNG}
        pathPointAlt={GRATICULE_POINT_ALT}
        pathColor={GRATICULE_COLOR}
        pathStroke={0.4}
        pathTransitionDuration={0}
        polygonsData={countries.features}
        polygonCapColor={POLYGON_CAP_COLOR}
        polygonSideColor={POLYGON_SIDE_COLOR}
        polygonStrokeColor={POLYGON_STROKE_COLOR}
        polygonAltitude={0.001}
        onPolygonHover={NOOP}
        polygonLabel={EMPTY_LABEL}
        arcsData={ARCS_DATA}
        arcColor={ARC_COLOR}
        arcAltitudeAutoScale={0.4}
        arcStroke={0.5}
        arcDashLength={0.4}
        arcDashGap={1}
        arcDashAnimateTime={2000}
        arcDashInitialGap={ARC_INITIAL_GAP}
        onArcHover={NOOP}
        arcLabel={EMPTY_LABEL}
      />
    </div>
  );
}
