"use client";

import { useEffect, useRef, useState } from "react";

const MODEL = "/img/sydney-tran.glb";
const OVER = { x: 0.1, y: 0.35 }; // canvas spills past the logo box (share of width / height) so tilts never clip
const DEG = Math.PI / 180;

// the 3D chrome name. the chrome is the file's own material; lighting matches the model-viewer reference:
// neutral studio, "commerce" tone mapping, 22° field of view, camera 5° above eye level.
// tilts slightly toward the mouse (degrees in `tilt`); the float comes from the CSS wrappers in Hero.
// while you hover, a small real light follows your cursor.
const ELEVATION = 5 * DEG; // model-viewer's camera-orbit polar angle of 85deg = 5° above the horizon
// a touch darker than the reference (exposure 1.3, silver as in the file) for a little more contrast
const EXPOSURE = 1.15;
const SILVER_DIM = 0.92; // multiplies the file's own silver colour
const GLINT = 0.55; // brightness of the shine that follows your cursor on hover
// what the chrome reflects: "studio" = model-viewer's neutral white room; "sky" = the site's own pink sky photo,
// so the edges pick up pinks and cloud tones instead of a white halo against the page
// (tried "sky": the halo goes, but the letters turn into pink glass that melts into the background)
const REFLECT: "studio" | "sky" = "studio";
// the "poof" it appears with: soft cloud puffs bursting out from behind the name, plus a few sparkles.
// fixed numbers (not random) so every visit looks the same and nothing changes between renders.
// x, y: where a puff starts, as % of the logo box; dx, dy: how far it drifts; s: size; d: delay (s).
// dx, dy and s are scaled to the logo's width when drawn (cqw), so the poof shrinks with the logo on small screens
const PUFFS = [
  [8, 50, -70, -10, 120, 0.02], [18, 30, -40, -60, 140, 0.06], [20, 72, -50, 55, 130, 0.0],
  [32, 22, -10, -75, 150, 0.08], [34, 80, -15, 70, 140, 0.04], [46, 18, 5, -85, 160, 0.03],
  [50, 50, 0, 0, 220, 0.0], [52, 84, 10, 80, 150, 0.07], [64, 24, 20, -70, 150, 0.05],
  [66, 78, 25, 65, 140, 0.01], [80, 30, 45, -55, 140, 0.06], [82, 70, 50, 50, 130, 0.03],
  [92, 50, 75, 5, 120, 0.0], [40, 50, -30, 10, 180, 0.1], [60, 50, 30, -10, 180, 0.09],
] as const;
// a denser cloud in FRONT of the name, which breaks apart and drifts off to reveal it
const VEIL = [
  [14, 50, -60, -20, 230, 0.0], [32, 45, -25, -40, 260, 0.03], [50, 55, 0, 30, 280, 0.0],
  [68, 45, 30, -35, 260, 0.02], [86, 50, 60, 15, 230, 0.04],
] as const;
const SPARKS = [
  [12, 20, -90, -70, 0.12], [30, 6, -30, -110, 0.18], [58, 4, 30, -120, 0.14], [86, 16, 100, -80, 0.2],
  [6, 82, -100, 60, 0.16], [44, 98, -20, 110, 0.22], [72, 96, 50, 100, 0.15], [96, 70, 110, 40, 0.19],
] as const;

export default function Logo3D({ tilt, appearAt = 0 }: {
  tilt: { x: number; y: number };
  appearAt?: number; // seconds to wait before it may appear (so it poofs in after the opening sky climb, not hidden behind it)
}) {
  const box = useRef<HTMLDivElement>(null);
  const holder = useRef<HTMLDivElement>(null);
  const tiltRef = useRef(tilt);
  const cursor = useRef({ x: 0, y: 0, on: false }); // cursor over the canvas, in -1..1
  const [ready, setReady] = useState(false); // the live 3D logo has drawn its first frame
  const [due, setDue] = useState(false); // appearAt has passed
  const [fallback, setFallback] = useState(false); // 3D is taking too long (or can't run): poof in the still instead
  const shown = due && (ready || fallback);
  const [popped, setPopped] = useState(false); // the pop-in animation has finished

  useEffect(() => {
    const a = setTimeout(() => setDue(true), appearAt * 1000);
    const b = setTimeout(() => setFallback(true), (appearAt + 2.5) * 1000);
    return () => { clearTimeout(a); clearTimeout(b); };
  }, [appearAt]);

  useEffect(() => { tiltRef.current = tilt; }, [tilt]);

  useEffect(() => {
    const host = holder.current;
    if (!host) return;
    let dead = false;
    let cleanup = () => {};

    (async () => {
      const THREE = await import("three");
      const { GLTFLoader } = await import("three/examples/jsm/loaders/GLTFLoader.js");
      const { makeChromeRoom } = await import("@/components/chromeRoom"); // loaded here too, so three.js stays out of the first download
      if (dead) return;

      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      } catch {
        return; // no WebGL: the still image of the logo stays
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);
      renderer.toneMapping = THREE.NeutralToneMapping; // model-viewer's "commerce"
      renderer.toneMappingExposure = EXPOSURE;
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.domElement.style.cssText = "position:absolute;inset:0;width:100%;height:100%";

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(22, 1, 0.01, 20);

      // what the chrome reflects (see REFLECT above), no extra lights
      const pmrem = new THREE.PMREMGenerator(renderer);
      let room: InstanceType<typeof THREE.Texture> | null = null;
      if (REFLECT === "sky") {
        try {
          const photo = await new THREE.TextureLoader().loadAsync("/img/sky.webp");
          photo.mapping = THREE.EquirectangularReflectionMapping;
          photo.colorSpace = THREE.SRGBColorSpace;
          room = pmrem.fromEquirectangular(photo).texture;
          photo.dispose();
        } catch {}
      }
      if (!room) {
        // the studio (or the fallback if the sky fails): white room, blush floor so there's no white halo
        const studio = makeChromeRoom();
        room = pmrem.fromScene(studio, 0.04).texture;
        studio.dispose();
      }
      scene.environment = room;

      // more dimension: a key light from the upper left for the main highlights, a faint pink fill from the right
      // so the shadow side isn't flat, and a rim light from behind that catches the edges against the sky
      const key = new THREE.DirectionalLight(0xffffff, 3.6);
      key.position.set(-1, 1.5, 2);
      const fill = new THREE.DirectionalLight(0xf6dfe6, 0.7);
      fill.position.set(1.5, -0.3, 1.5);
      const rim = new THREE.DirectionalLight(0xffffff, 2.6);
      rim.position.set(0.5, 1, -1.5);
      scene.add(key, fill, rim);

      // the cursor light: off until you hover
      const glint = new THREE.PointLight(0xffffff, 0, 1.4, 2);
      scene.add(glint);

      let model: InstanceType<typeof THREE.Group>;
      try {
        model = (await new GLTFLoader().loadAsync(MODEL)).scene;
      } catch {
        renderer.dispose();
        pmrem.dispose();
        return; // model failed to load: the still image of the logo stays
      }
      if (dead) { renderer.dispose(); pmrem.dispose(); return; }
      // the chrome is the file's own material, just a shade darker
      model.traverse((o) => {
        const mesh = o as InstanceType<typeof THREE.Mesh>;
        if (mesh.isMesh) (mesh.material as InstanceType<typeof THREE.MeshStandardMaterial>).color.multiplyScalar(SILVER_DIM);
      });
      // centre it; the model is 1 unit wide
      const bounds = new THREE.Box3().setFromObject(model);
      model.position.sub(bounds.getCenter(new THREE.Vector3()));
      const pivot = new THREE.Group();
      pivot.add(model);
      scene.add(pivot);
      const width = bounds.max.x - bounds.min.x;

      host.appendChild(renderer.domElement);

      // camera distance so the model spans exactly the logo box's width
      const fit = () => {
        const r = host.getBoundingClientRect();
        if (!r.width || !r.height) return;
        renderer.setSize(r.width, r.height, false);
        camera.aspect = r.width / r.height;
        camera.updateProjectionMatrix();
        const visible = width * (1 + 2 * OVER.x); // canvas is wider than the logo by OVER on each side
        const halfH = Math.tan((camera.fov * DEG) / 2);
        const d = visible / (2 * halfH * camera.aspect);
        camera.position.set(0, d * Math.sin(ELEVATION), d * Math.cos(ELEVATION));
        camera.lookAt(0, 0, 0);
      };
      fit();
      const ro = new ResizeObserver(fit);
      ro.observe(host);

      // follow the tilt smoothly; place the cursor light just in front of the metal
      const aim = new THREE.Vector3();
      let raf = 0;
      let visible = true;
      let first = true;
      const frame = () => {
        const t = tiltRef.current;
        pivot.rotation.x += (t.x * DEG - pivot.rotation.x) * 0.12;
        pivot.rotation.y += (t.y * DEG - pivot.rotation.y) * 0.12;
        const c = cursor.current;
        aim.set(c.x, c.y, 0.5).unproject(camera).sub(camera.position).normalize();
        const along = (0.09 - camera.position.z) / aim.z; // where the cursor ray meets a plane just in front of the logo
        glint.position.copy(camera.position).addScaledVector(aim, along);
        glint.intensity += ((c.on ? GLINT : 0) - glint.intensity) * 0.12;
        renderer.render(scene, camera);
        if (first) { first = false; setReady(true); }
        if (visible) raf = requestAnimationFrame(frame);
      };
      const io = new IntersectionObserver(([e]) => {
        visible = e.isIntersecting;
        cancelAnimationFrame(raf);
        if (visible) raf = requestAnimationFrame(frame);
      });
      io.observe(host);

      cleanup = () => {
        cancelAnimationFrame(raf);
        io.disconnect();
        ro.disconnect();
        model.traverse((o) => {
          const mesh = o as InstanceType<typeof THREE.Mesh>;
          if (!mesh.isMesh) return;
          mesh.geometry.dispose();
          const mat = mesh.material as InstanceType<typeof THREE.MeshStandardMaterial>;
          [mat.map, mat.normalMap, mat.metalnessMap, mat.roughnessMap].forEach((tx) => tx?.dispose());
          mat.dispose();
        });
        room.dispose();
        pmrem.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    })();

    return () => { dead = true; cleanup(); };
  }, []);

  // cursor position over the canvas, for the light
  function point(e: React.PointerEvent<HTMLDivElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    cursor.current = { x: ((e.clientX - r.left) / r.width) * 2 - 1, y: -(((e.clientY - r.top) / r.height) * 2 - 1), on: true };
  }

  return (
    <div
      ref={box}
      role="img"
      aria-label="Sydney Tran"
      // holds the logo's place (same 3:1 shape as always); the name poofs in once the live 3D logo is ready
      className="@container pointer-events-auto relative aspect-[3/1] w-full"
      onPointerEnter={point}
      onPointerMove={point}
      onPointerLeave={() => { cursor.current = { ...cursor.current, on: false }; }}
    >
      {/* the poof: cloud puffs and sparkles burst out once, the moment the name appears. plain CSS animations
          (globals.css), so they play smoothly even while the page is still busy setting up the 3D */}
      {shown && (
        <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
          {PUFFS.map(([x, y, dx, dy, size, d], i) => (
            <span
              key={i}
              className="poof-puff absolute rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.95)_0%,rgba(255,240,246,0.7)_38%,rgba(255,255,255,0)_70%)] blur-[2px]"
              style={{
                left: `${x}%`, top: `${y}%`, width: `${size * 0.1}cqw`, height: `${size * 0.1}cqw`, marginLeft: `${-size * 0.05}cqw`, marginTop: `${-size * 0.05}cqw`,
                "--dx": `${dx * 0.1}cqw`, "--dy": `${dy * 0.1}cqw`, animationDelay: `${d}s`,
              } as React.CSSProperties}
            />
          ))}
          {SPARKS.map(([x, y, dx, dy, d], i) => (
            <span
              key={"s" + i}
              className="poof-spark absolute -ml-1 -mt-1.5 text-[clamp(9px,1.4cqw,14px)] leading-none text-white [text-shadow:0_0_8px_rgba(255,255,255,0.9)]"
              style={{ left: `${x}%`, top: `${y}%`, "--dx": `${dx * 0.1}cqw`, "--dy": `${dy * 0.1}cqw`, animationDelay: `${d + 0.1}s` } as React.CSSProperties}
            >
              ✦
            </span>
          ))}
        </div>
      )}
      {shown && (
        <div aria-hidden className="pointer-events-none absolute inset-0 z-[2]">
          {VEIL.map(([x, y, dx, dy, size, d], i) => (
            <span
              key={i}
              className="poof-veil absolute rounded-full bg-[radial-gradient(circle,rgba(255,255,255,1)_0%,rgba(255,244,248,0.85)_40%,rgba(255,255,255,0)_70%)] blur-[3px]"
              style={{
                left: `${x}%`, top: `${y}%`, width: `${size * 0.066}cqw`, height: `${size * 0.066}cqw`, marginLeft: `${-size * 0.033}cqw`, marginTop: `${-size * 0.033}cqw`,
                "--dx": `${dx * 0.066}cqw`, "--dy": `${dy * 0.066}cqw`, animationDelay: `${d}s`,
              } as React.CSSProperties}
            />
          ))}
        </div>
      )}

      {/* the name itself: pops out of the poof (squeezed small and blurred → a little past full size → settles) */}
      {/* once the pop-in has played, the class comes off, so nothing (not even scale(1) / blur(0)) is left on the
          3D canvas's parent: leftovers keep it on a cached layer and the chrome can look soft */}
      <div
        className={`absolute inset-0 z-[1] ${!shown ? "opacity-0" : popped ? "" : "poof-in"}`}
        onAnimationEnd={(e) => { if (e.target === e.currentTarget) setPopped(true); }}
      >
        {/* a still render of this same 3D logo: stands in only if the live 3D is slow or can't run,
            and fades out if the live logo arrives afterwards */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/img/wordmark.webp"
          alt=""
          aria-hidden
          className={`absolute inset-0 h-full w-full object-contain drop-shadow-[0_24px_28px_rgba(60,40,60,0.3)] transition-opacity duration-700 ${!ready && fallback ? "opacity-100" : "opacity-0"}`}
        />
        {/* the 3D canvas, a little larger than the logo box so tilting never clips it */}
        <div
          ref={holder}
          aria-hidden
          className={`absolute transition-opacity duration-500 drop-shadow-[0_24px_28px_rgba(60,40,60,0.3)] ${ready ? "opacity-100" : "opacity-0"}`}
          style={{ left: `${-OVER.x * 100}%`, right: `${-OVER.x * 100}%`, top: `${-OVER.y * 100}%`, bottom: `${-OVER.y * 100}%` }}
        />
      </div>
    </div>
  );
}
