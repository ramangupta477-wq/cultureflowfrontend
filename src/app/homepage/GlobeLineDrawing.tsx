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
      color: '#0B0B0B',
      transparent: true,
      opacity: 0.04,
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
          uColor: { value: new THREE.Color('#0B0B0B') },
          uGlow: { value: new THREE.Color('#1B1B1B') },
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

            // Subtle glow at drawing frontier
            float glowIntensity = smoothstep(0.06, 0.0, edge);

            // Fade-in solidification
            float solidify = smoothstep(0.0, 0.03, edge);

            vec3 finalColor = mix(uColor, uGlow, glowIntensity * 0.85);
            float alpha = solidify * 0.95;

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
          uColor: { value: new THREE.Color('#222222') },
          uGlow: { value: new THREE.Color('#222222') },
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
