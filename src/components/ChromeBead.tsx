"use client";

import { useEffect, useRef } from "react";
import { chromeMaterial, loadChromeShapes } from "@/components/chromeShapes";

// a small spinning chrome shape, used between words in the skills marquee. however many beads are on the page, they
// share ONE hidden WebGL renderer (browsers allow only a handful of WebGL contexts): each frame it draws each shape
// once and copies the picture into every bead showing that shape. beads that are off screen cost nothing.

const PX = 44; // bead size, css px

type Bead = { ctx: CanvasRenderingContext2D; shape: number; visible: boolean };
const beads = new Set<Bead>();
let started = false;

async function start() {
  if (started) return;
  started = true;
  const THREE = await import("three");
  const { RoomEnvironment } = await import("three/examples/jsm/environments/RoomEnvironment.js");
  const loaded = await loadChromeShapes(THREE);
  if (!loaded) return;
  const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const dpr = Math.min(window.devicePixelRatio, 2);
  const size = Math.round(PX * dpr);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(1);
  renderer.setSize(size, size, false);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  scene.environment = pmrem.fromScene(room, 0.04).texture;
  room.dispose();
  const cam = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
  cam.position.set(0, 0, 4.1);

  const geos = loaded.shapes.map((p, k) => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(p, 3));
    g.setAttribute("normal", new THREE.BufferAttribute(loaded.normals[k], 3));
    g.setIndex(loaded.index);
    return g;
  });
  const mesh = new THREE.Mesh(geos[0], chromeMaterial(THREE));
  scene.add(mesh);

  let t = 0, last = performance.now(), drewOnce = false;
  const frame = (now: number) => {
    requestAnimationFrame(frame);
    const dt = Math.min((now - last) / 1000, 1 / 30);
    last = now;
    let any = false;
    for (const b of beads) if (b.visible) { any = true; break; }
    if (!any || document.hidden || (calm && drewOnce)) return;
    t += dt;
    drewOnce = true;
    mesh.rotation.y = calm ? 0.6 : t * 0.7;
    mesh.rotation.x = calm ? 0.2 : Math.sin(t * 0.5) * 0.25;
    geos.forEach((g, k) => {
      let used = false;
      for (const b of beads) if (b.visible && b.shape === k) { used = true; break; }
      if (!used) return;
      mesh.geometry = g;
      renderer.render(scene, cam);
      for (const b of beads) {
        if (!b.visible || b.shape !== k) continue;
        b.ctx.clearRect(0, 0, size, size);
        b.ctx.drawImage(renderer.domElement, 0, 0);
      }
    });
  };
  requestAnimationFrame(frame);
}

export default function ChromeBead({ shape }: { shape: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio, 2);
    canvas.width = canvas.height = Math.round(PX * dpr);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const bead: Bead = { ctx, shape: shape % 4, visible: false };
    beads.add(bead);
    const io = new IntersectionObserver(([e]) => {
      bead.visible = e.isIntersecting;
      if (bead.visible) void start();
    }, { rootMargin: "200px" });
    io.observe(canvas);
    return () => { io.disconnect(); beads.delete(bead); };
  }, [shape]);

  return <canvas ref={ref} aria-hidden className="inline-block shrink-0" style={{ width: PX, height: PX }} />;
}
