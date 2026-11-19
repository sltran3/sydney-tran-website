"use client";

import { useEffect, useRef } from "react";
import { chromeMaterial, loadChromeShapes } from "@/components/chromeShapes";

// liquid chrome, twice: a larger object parked in the bottom-right corner (click it to morph to the next shape:
// blob → star → geometric → flower → blob…) and a small one right under your cursor that matches it. based on
// chromeMorph.js: the four FLORA shapes were traced onto a shared sphere ahead of time (public/models/chrome-morph.bin,
// ~560 KB instead of ~25 MB of .glb files). moving the cursor leaves one solid swipe of chrome behind it.
// hidden on the opening screen; the cursor one is also hidden when the cursor leaves the window, and on touch screens.
// drawn on a full-screen layer that never catches clicks; the corner has a real button over it.

const STIFF = 60; // morph spring stiffness (higher = snappier)
const DAMP = 9; // morph spring damping (lower = more wobble/overshoot)
const WOBBLE = 0.06; // how much the surface jiggles while morphing

// the object in the corner
const CORNER = 30; // px per unit: about 60px across
const CORNER_INSET = 64; // px from the right and bottom edges to its centre
const CORNER_SMALL = 19; // on phones: smaller and tucked closer into the corner, so it covers less of the text
const CORNER_INSET_SMALL = 38;

// the object under the cursor
const SIZE = 19; // px per unit: the shape is about 36px across
const FOLLOW_STIFF = 700; // a tight spring: it stays right under the cursor, with just a hint of lag
const FOLLOW_DAMP = 48;
const FOLLOW_STEP = 1 / 240; // s: the follow spring is stepped at least this finely, whatever the frame rate

// the swipe: one tube of chrome laid along the cursor's path. the physics, per point along it:
//  - it's laid down carrying part of the blob's velocity, so the stroke keeps flowing for a moment
//  - air drag slows it in proportion to its speed (exponential decay)
//  - a little gravity lets the stroke sag into a soft arc as it slows
//  - the tube is thickest where it leaves the blob and tapers to a point at the tail, and the whole stroke thins
//    away within about half a second once you stop
const TRAIL_MAX = 160; // points along the tube
const RING = 14; // sides around the tube
const STEP = 3; // px between points
const SHED_SPEED = 900; // px/s: below this, no stroke at all (it only appears on a quick flick)
const FULL_SPEED = 2400; // px/s: at this speed the stroke is at full thickness (it grows in from nothing above SHED_SPEED)
const KEEP = 0.14; // share of the blob's velocity a new point carries
const LIFE = 0.45; // s
const SWIPE_R = 9.5; // px: tube radius at the head (tucked inside the blob)
const DRAG = 3.4; // 1/s
const GRAVITY = 150; // px/s², screen-down
const SMOOTH = 4; // smoothing passes over the stroke's centre line, so it reads as one fluid curve

export default function ChromeMorph() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const next = useRef<() => void>(() => {});
  const hover = useRef(false);
  const hintRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const button = buttonRef.current;
    const hint = hintRef.current;
    if (!canvas || !button || !hint) return;
    // the "click me" note: shown until the shape has been clicked once (remembered on this browser)
    let clickedOnce = false;
    try { clickedOnce = localStorage.getItem("chrome-clicked") === "1"; } catch {}
    const fine = window.matchMedia("(pointer: fine)").matches; // touch screens have no cursor to follow
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let dead = false;
    let cleanup = () => {};

    (async () => {
      const THREE = await import("three");
      const { RoomEnvironment } = await import("three/examples/jsm/environments/RoomEnvironment.js");
      const loaded = await loadChromeShapes(THREE);
      if (dead || !loaded) return;
      const { index, dirs, shapes, normals } = loaded;
      const n = dirs.length / 3;

      // ---- scene: a full-screen layer where 1 world unit = 1 screen pixel on the z = 0 plane ----
      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
      // 1.5×, not 2×: this canvas covers the whole screen, and the objects on it are small, shiny and moving
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      const scene = new THREE.Scene();
      const cam = new THREE.PerspectiveCamera(35, 1, 1, 10000);
      const pmrem = new THREE.PMREMGenerator(renderer);
      const room = new RoomEnvironment();
      scene.environment = pmrem.fromScene(room, 0.04).texture; // chrome needs something to reflect
      room.dispose();
      const chrome = chromeMaterial(THREE);

      // the object: holder (position) → stretch (along the motion) → unturn → lean → mesh (its own spin)
      const geo = new THREE.BufferGeometry();
      const posAttr = new THREE.BufferAttribute(shapes[0].slice(), 3);
      const nrmAttr = new THREE.BufferAttribute(normals[0].slice(), 3);
      posAttr.setUsage(THREE.DynamicDrawUsage);
      nrmAttr.setUsage(THREE.DynamicDrawUsage);
      geo.setAttribute("position", posAttr);
      geo.setAttribute("normal", nrmAttr);
      geo.setIndex(index);
      const mesh = new THREE.Mesh(geo, chrome);
      const lean = new THREE.Group();
      const unturn = new THREE.Group();
      const stretch = new THREE.Group();
      const holder = new THREE.Group();
      lean.add(mesh); unturn.add(lean); stretch.add(unturn); holder.add(stretch);
      holder.scale.setScalar(SIZE);
      scene.add(holder);
      // the corner one shares the same (morphing) geometry
      const cornerMesh = new THREE.Mesh(geo, chrome);
      const corner = new THREE.Group();
      corner.add(cornerMesh);
      corner.scale.setScalar(CORNER);
      scene.add(corner);

      // the swipe: one tube mesh rebuilt along the trail every frame, in a slightly deeper silver so it reads as solid
      const swipeChrome = chrome.clone();
      swipeChrome.color.set(0xd2d2da);
      const swipeGeo = new THREE.BufferGeometry();
      const sPos = new Float32Array(TRAIL_MAX * RING * 3);
      const sNrm = new Float32Array(TRAIL_MAX * RING * 3);
      const sPosAttr = new THREE.BufferAttribute(sPos, 3).setUsage(THREE.DynamicDrawUsage);
      const sNrmAttr = new THREE.BufferAttribute(sNrm, 3).setUsage(THREE.DynamicDrawUsage);
      swipeGeo.setAttribute("position", sPosAttr);
      swipeGeo.setAttribute("normal", sNrmAttr);
      const sIdx: number[] = [];
      for (let i = 0; i < TRAIL_MAX - 1; i++) for (let j = 0; j < RING; j++) {
        const a = i * RING + j, b = i * RING + ((j + 1) % RING), c = a + RING, d = b + RING;
        sIdx.push(a, c, b, b, c, d);
      }
      swipeGeo.setIndex(sIdx);
      swipeGeo.setDrawRange(0, 0);
      const swipe = new THREE.Mesh(swipeGeo, swipeChrome);
      swipe.frustumCulled = false;
      scene.add(swipe);
      // the points the tube runs through, oldest (tail) first; each keeps moving after it's laid down
      const T = {
        x: new Float32Array(TRAIL_MAX), y: new Float32Array(TRAIL_MAX),
        vx: new Float32Array(TRAIL_MAX), vy: new Float32Array(TRAIL_MAX),
        age: new Float32Array(TRAIL_MAX), w: new Float32Array(TRAIL_MAX),
      };
      let pts = 0;
      const smX = new Float32Array(TRAIL_MAX), smY = new Float32Array(TRAIL_MAX), smW = new Float32Array(TRAIL_MAX), tmp = new Float32Array(TRAIL_MAX);
      let lastVx = 0, lastVy = 0; // the blob's velocity last frame, so new points blend smoothly between the two
      const pushPoint = (x: number, y: number, vx: number, vy: number, w: number) => {
        if (pts === TRAIL_MAX) { // full: drop the oldest
          for (const k of Object.values(T)) k.copyWithin(0, 1);
          pts--;
        }
        T.x[pts] = x; T.y[pts] = y; T.vx[pts] = vx; T.vy[pts] = vy; T.age[pts] = 0; T.w[pts] = w;
        pts++;
      };

      // ---- shown once the about section is well into view (hidden on the opening screen) ----
      const aboutEl = document.querySelector<HTMLElement>("#about");
      let shown = false;
      const mouse = { x: 0, y: 0, in: false };
      const onScroll = () => {
        const about = aboutEl?.getBoundingClientRect();
        shown = !!about && about.top < window.innerHeight * 0.6;
        canvas.style.opacity = shown ? "1" : "0";
        button.style.opacity = shown ? "1" : "0";
        button.style.pointerEvents = shown ? "auto" : "none";
        button.tabIndex = shown ? 0 : -1;
        hint.style.opacity = shown && !clickedOnce ? "1" : "0";
      };

      // ---- the cursor ----
      const follow = { x: 0, y: 0, vx: 0, vy: 0, started: false };
      const onPointer = (e: PointerEvent) => {
        if (e.pointerType !== "mouse") return;
        mouse.x = e.clientX; mouse.y = e.clientY;
        if (!follow.started) { follow.x = mouse.x; follow.y = mouse.y; follow.started = true; } // no fly-in from the corner
        mouse.in = true;
      };
      const onLeave = () => { mouse.in = false; };
      if (fine) {
        window.addEventListener("pointermove", onPointer, { passive: true });
        document.documentElement.addEventListener("mouseleave", onLeave);
      }
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();

      // camera distance so that 1 unit = 1 pixel at z = 0
      let W = 1, H = 1, cSize = CORNER, cInset = CORNER_INSET;
      const resize = () => {
        W = window.innerWidth; H = window.innerHeight;
        const small = W < 640;
        cSize = small ? CORNER_SMALL : CORNER;
        cInset = small ? CORNER_INSET_SMALL : CORNER_INSET;
        const hit = Math.round(cSize * 2.6); // the click target, a little bigger than the object
        Object.assign(button.style, { width: `${hit}px`, height: `${hit}px`, right: `${cInset - hit / 2}px`, bottom: `${cInset - hit / 2}px` });
        // the note sits up and to the left; its arrow's tip (the bottom-right corner of the note, ~4px in) comes down
        // onto the top middle of the shape, stopping just above it so the bob never touches
        Object.assign(hint.style, { right: `${cInset - 4}px`, bottom: `${cInset + cSize + 5}px` });
        renderer.setSize(W, H, false);
        cam.aspect = W / H;
        cam.position.set(0, 0, H / (2 * Math.tan((cam.fov * Math.PI) / 360)));
        cam.updateProjectionMatrix();
      };
      window.addEventListener("resize", resize);
      resize();
      const wx = (px: number) => px - W / 2; // screen → world
      const wy = (py: number) => H / 2 - py;

      // ---- physics ----
      // ---- click → next shape. the morph runs from a snapshot of the surface as it is right now, so clicking
      //      again mid-morph carries on smoothly instead of jumping ----
      const P = posAttr.array as Float32Array, N = nrmAttr.array as Float32Array;
      const fromP = shapes[0].slice(), fromN = normals[0].slice();
      let target = 0;
      let settledOn = -1; // the shape the surface last finished settling on (-1 while morphing)
      let p = 1, v = 0, rotV = 0, time = 0, last = performance.now(), raf = 0, grow = 1, growV = 0;
      next.current = () => {
        fromP.set(P); fromN.set(N);
        target = (target + 1) % shapes.length;
        p = 0;
        if (calm) p = 1; // no animation: swap straight to the new shape
        growV -= 4; // a little press-in on the click
        if (!clickedOnce) {
          clickedOnce = true;
          hint.style.opacity = "0";
          try { localStorage.setItem("chrome-clicked", "1"); } catch {}
        }
      };
      const clamp = THREE.MathUtils.clamp;

      const frame = (now: number) => {
        raf = requestAnimationFrame(frame);
        if (!shown || document.hidden) { last = now; return; } // nothing to draw: skip the work
        // at rest (cursor still or away, no swipe, no morph, no click bounce) the only motion is the slow spin and
        // bob, which looks the same at half the frame rate: draw every other frame and save the GPU the rest
        const resting = pts === 0 && v === 0 && Math.abs(growV) < 0.01 &&
          (!mouse.in || (Math.abs(mouse.x - follow.x) < 0.05 && Math.abs(mouse.y - follow.y) < 0.05 && Math.hypot(follow.vx, follow.vy) < 0.5));
        if (resting && now - last < 30) return;
        const dt = Math.min((now - last) / 1000, 1 / 30);
        last = now;
        time += dt;

        // ---- follow: a tight spring right under the cursor ----
        const px = follow.x, py = follow.y;
        if (calm) { follow.x = mouse.x; follow.y = mouse.y; follow.vx = follow.vy = 0; }
        else {
          // small fixed sub-steps: a stiff spring stepped in one big jump (a slow frame) overshoots and flips
          // direction every frame, which made the blob (and the swipe it lays down) jitter back and forth
          const subs = Math.ceil(dt / FOLLOW_STEP), h = dt / subs;
          for (let s = 0; s < subs; s++) {
            follow.vx += ((mouse.x - follow.x) * FOLLOW_STIFF - follow.vx * FOLLOW_DAMP) * h;
            follow.vy += ((mouse.y - follow.y) * FOLLOW_STIFF - follow.vy * FOLLOW_DAMP) * h;
            follow.x += follow.vx * h;
            follow.y += follow.vy * h;
          }
        }
        holder.visible = mouse.in;
        holder.position.set(wx(follow.x), wy(follow.y), 0);
        const speed = Math.hypot(follow.vx, follow.vy);

        // ---- the blob stretches along its motion (constant volume) and leans into it ----
        if (!calm) {
          const sx = 1 + clamp(speed / 2600, 0, 0.4);
          // only re-aim while actually moving: near zero speed the direction is just noise
          const ang = speed > 20 ? Math.atan2(-follow.vy, follow.vx) : stretch.rotation.z; // world y is up
          stretch.rotation.z = ang;
          stretch.scale.set(sx, 1 / Math.sqrt(sx), 1 / Math.sqrt(sx));
          unturn.rotation.z = -ang;
          lean.rotation.z += (clamp(-follow.vx * 0.0006, -0.5, 0.5) - lean.rotation.z) * 0.15;
          lean.rotation.x += (clamp(follow.vy * 0.0006, -0.5, 0.5) - lean.rotation.x) * 0.15;
        }

        // ---- lay the swipe down along the path travelled this frame (extra points on fast frames keep it smooth) ----
        if (!calm && mouse.in && speed > SHED_SPEED) {
          const seg = Math.hypot(follow.x - px, follow.y - py);
          const steps = Math.max(1, Math.ceil(seg / STEP));
          const w = Math.sqrt(clamp((speed - SHED_SPEED) / (FULL_SPEED - SHED_SPEED), 0, 1)); // faster = more metal
          for (let s = 1; s <= steps; s++) {
            const f = s / steps;
            const vx = lastVx + (follow.vx - lastVx) * f, vy = lastVy + (follow.vy - lastVy) * f;
            pushPoint(px + (follow.x - px) * f, py + (follow.y - py) * f, vx * KEEP, vy * KEEP, w);
          }
        }
        lastVx = follow.vx; lastVy = follow.vy;

        // ---- swipe physics: every point keeps part of the speed it was laid down with, slows with air drag,
        //      and sags a little under gravity; points age out from the tail ----
        const drag = Math.exp(-DRAG * dt);
        for (let i = 0; i < pts; i++) {
          T.age[i] += dt;
          T.vx[i] *= drag;
          T.vy[i] = T.vy[i] * drag + GRAVITY * dt;
          T.x[i] += T.vx[i] * dt;
          T.y[i] += T.vy[i] * dt;
        }
        let dropOld = 0;
        while (dropOld < pts && T.age[dropOld] >= LIFE) dropOld++;
        if (dropOld) { for (const k of Object.values(T)) k.copyWithin(0, dropOld); pts -= dropOld; }

        // ---- smooth the centre line (ends stay put, so the head stays attached to the blob) ----
        smX.set(T.x.subarray(0, pts)); smY.set(T.y.subarray(0, pts)); smW.set(T.w.subarray(0, pts));
        for (let pass = 0; pass < SMOOTH && pts > 2; pass++) {
          for (const arr of [smX, smY, smW]) {
            tmp.set(arr.subarray(0, pts));
            for (let i = 1; i < pts - 1; i++) arr[i] = (tmp[i - 1] + 2 * tmp[i] + tmp[i + 1]) / 4;
          }
        }

        // ---- rebuild the tube: thick at the head, tapering to a point at the tail ----
        for (let i = 0; i < pts; i++) {
          const a = Math.max(0, i - 2), b = Math.min(pts - 1, i + 2);
          let tx = smX[b] - smX[a], ty = smY[b] - smY[a];
          const tl = Math.hypot(tx, ty) || 1;
          tx /= tl; ty /= tl;
          // side direction in the screen plane (world y is up, screen y is down)
          const nx = ty, ny = tx;
          const along = pts > 1 ? i / (pts - 1) : 1; // 0 at the tail, 1 at the head
          const fade = 1 - Math.pow(T.age[i] / LIFE, 2.2); // holds its thickness, then thins away
          const r = SWIPE_R * smW[i] * Math.pow(Math.max(0, along), 0.45) * Math.max(0, fade);
          const cx = wx(smX[i]), cy = wy(smY[i]);
          for (let j = 0; j < RING; j++) {
            const th = (j / RING) * Math.PI * 2, c = Math.cos(th), s = Math.sin(th);
            const o = (i * RING + j) * 3;
            const ox = nx * c, oy = ny * c, oz = s; // round cross-section: side direction and toward the viewer
            sPos[o] = cx + ox * r; sPos[o + 1] = cy + oy * r; sPos[o + 2] = oz * r;
            sNrm[o] = ox; sNrm[o + 1] = oy; sNrm[o + 2] = oz;
          }
        }
        sPosAttr.needsUpdate = true;
        sNrmAttr.needsUpdate = true;
        swipeGeo.setDrawRange(0, Math.max(0, pts - 1) * RING * 6);

        // ---- morph to the target shape: damped spring (overshoots a little, then settles) ----
        const acc = STIFF * (1 - p) - DAMP * v;
        v += acc * dt;
        p += v * dt;
        if (Math.abs(v) < 1e-3 && Math.abs(1 - p) < 1e-3) { p = 1; v = 0; }
        const t = clamp(p, 0, 1);
        const B = shapes[target], NB = normals[target];
        const amp = calm ? 0 : WOBBLE * Math.min(Math.abs(v), 3);
        // once the morph has settled the surface stops changing: skip rewriting ~23k vertices every frame
        const morphing = !(p === 1 && v === 0 && settledOn === target);
        if (morphing) settledOn = p === 1 && v === 0 ? target : -1;
        for (let kk = 0; morphing && kk < n; kk++) {
          const j = kk * 3;
          const front = dirs[j + 1] * 0.5 + 0.5; // the top changes a bit before the bottom, like flowing metal
          let lt = clamp((t - (1 - front) * 0.35) / 0.65, 0, 1);
          lt = lt * lt * (3 - 2 * lt);
          const x = fromP[j] + (B[j] - fromP[j]) * lt;
          const y = fromP[j + 1] + (B[j + 1] - fromP[j + 1]) * lt;
          const z = fromP[j + 2] + (B[j + 2] - fromP[j + 2]) * lt;
          const rip = amp * Math.sin(time * 14 + dirs[j] * 6 + dirs[j + 1] * 9 + dirs[j + 2] * 5);
          const ball = Math.sin(lt * Math.PI) * 0.12; // mid-morph the liquid pulls toward a sphere
          const rr = Math.hypot(x, y, z) || 1;
          const s = 1 - ball + ball * (0.8 / rr);
          P[j] = x * s + dirs[j] * rip;
          P[j + 1] = y * s + dirs[j + 1] * rip;
          P[j + 2] = z * s + dirs[j + 2] * rip;
          N[j] = fromN[j] + (NB[j] - fromN[j]) * lt;
          N[j + 1] = fromN[j + 1] + (NB[j + 1] - fromN[j + 1]) * lt;
          N[j + 2] = fromN[j + 2] + (NB[j + 2] - fromN[j + 2]) * lt;
        }
        if (morphing) { posAttr.needsUpdate = true; nrmAttr.needsUpdate = true; }
        const squash = 1 + clamp(v * 0.08, -0.15, 0.15);
        mesh.scale.set(1 / Math.sqrt(squash), squash, 1 / Math.sqrt(squash));
        cornerMesh.scale.copy(mesh.scale);
        if (!calm) {
          rotV += (Math.abs(v) * 0.6 - rotV) * 0.05;
          mesh.rotation.y += (0.25 + rotV) * dt;
          mesh.rotation.x = Math.sin(time * 0.5) * 0.15;
          cornerMesh.rotation.copy(mesh.rotation);
          // the corner one swells a little under the cursor (springy) and dips in when clicked
          growV += ((hover.current ? 1.12 : 1) - grow) * 180 * dt - growV * 16 * dt;
          grow += growV * dt;
        }

        // ---- the corner object sits in the bottom-right, bobbing gently ----
        const bob = calm ? 0 : Math.sin(time * 1.6) * 3;
        corner.position.set(wx(W - cInset), wy(H - cInset) + bob, 0);
        corner.scale.setScalar(cSize * grow);
        renderer.render(scene, cam);
      };
      raf = requestAnimationFrame(frame);

      cleanup = () => {
        cancelAnimationFrame(raf);
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", resize);
        window.removeEventListener("pointermove", onPointer);
        next.current = () => {};
        document.documentElement.removeEventListener("mouseleave", onLeave);
        geo.dispose();
        swipeGeo.dispose();
        chrome.dispose();
        swipeChrome.dispose();
        scene.environment?.dispose();
        pmrem.dispose();
        renderer.dispose();
      };
    })();

    return () => { dead = true; cleanup(); };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-hidden
        // full-screen, see-through layer for the objects and the swipe; never catches clicks
        className="pointer-events-none fixed inset-0 z-[60] h-screen w-screen opacity-0 transition-opacity duration-500"
      />
      {/* a hand-written note pointing at the corner object, until it's been clicked once */}
      <div
        ref={hintRef}
        aria-hidden
        style={{ right: 100, bottom: 80 }}
        className="pointer-events-none fixed z-[61] flex items-start gap-0.5 text-mauve opacity-0 transition-opacity duration-700"
      >
        <span className="hint-bob -mt-1 font-serif text-[13px] italic leading-none whitespace-nowrap sm:text-[15px]">click me</span>
        {/* arrow: out to the right, then curving down onto the shape; tip at (34, 36) */}
        <svg viewBox="0 0 40 40" className="size-6 sm:size-[30px]" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 6 C 18 0, 32 5, 34 35" />
          <path d="M29.5 29.5 L 34 36 L 38.5 29.5" />
        </svg>
      </div>
      {/* the click target over the corner object (the object itself is drawn on the canvas) */}
      <button
        ref={buttonRef}
        type="button"
        tabIndex={-1}
        aria-label="Change the chrome shape"
        title="Click to change the shape"
        onClick={() => next.current()}
        onPointerEnter={() => { hover.current = true; }}
        onPointerLeave={() => { hover.current = false; }}
        onFocus={() => { hover.current = true; }}
        onBlur={() => { hover.current = false; }}
        style={{ right: 24, bottom: 24 }}
        className="pointer-events-none fixed z-[61] h-20 w-20 cursor-pointer rounded-full opacity-0 transition-opacity duration-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mauve"
      />
    </>
  );
}
