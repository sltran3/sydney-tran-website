"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { features, PHONE_MEDIA, phoneVideoFor, posterFor, tools } from "@/content/site";
import TitleRise, { type Piece } from "@/components/TitleRise";
import Spinner from "@/components/Spinner";

const TITLE: Piece[] = [{ t: "Selected", italic: true }, { t: "WORK" }];

function GiantTitle() {
  return (
    <TitleRise
      pieces={TITLE}
      label="Selected work"
      className="font-bodoni font-normal leading-[0.9]"
      rowClassName="flex flex-wrap items-baseline justify-start gap-x-[0.28em] text-[clamp(40px,7vw,104px)]"
      together
      leaveOffset={["start 0.32", "end 0.08"]}
    />
  );
}

// every project on one curved glass wall: the case studies, then the tools (archived ones are left out)
type Item = { key: string; name: string; tag?: string; img: string; bg: string; href?: string; video?: string };
const items: Item[] = [
  ...features.filter((f) => !("archived" in f && f.archived)).map((f) => ({ key: f.slug, name: f.name, tag: f.meta.split(" · ")[0], img: f.img || ("video" in f && f.video ? posterFor(f.video) : ""), bg: f.bg, href: `/work/${f.slug}`, video: "video" in f ? f.video : undefined })),
  ...tools.filter((t) => !("archived" in t && t.archived)).map((t) => ({ key: t.name, name: t.name, img: t.img || (t.video ? posterFor(t.video) : ""), bg: t.bg, href: t.href, video: t.video })),
];
const N = items.length;

// the wall: panels bent onto the inside of a unit cylinder, camera at its centre
const ARC = 0.72; // radians one panel wraps around (smaller = gentler bend)
const STEP = ARC + 0.05; // panel + gap
const PANEL_H = ARC / 1.6; // 16:10 panels
const MAX_RENDER_PIXELS = 4_000_000;
const spring = { type: "spring", stiffness: 150, damping: 24 } as const;

const wrap = (d: number) => ((((d + N / 2) % N) + N) % N) - N / 2; // shortest signed distance around the loop
const mod = (n: number) => ((n % N) + N) % N;

// panel: rounded corners, soft top sheen, shaded sides and a bright glass rim
const panelVert = /* glsl */ `
varying vec2 vUv;
void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
const panelFrag = /* glsl */ `
uniform sampler2D map;
uniform vec2 uMediaScale;
uniform float uDim;
uniform float uVideo;
varying vec2 vUv;
float sdRound(vec2 p, vec2 b, float r) { vec2 q = abs(p) - b + r; return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r; }
void main() {
  vec2 size = vec2(1.6, 1.0);
  float d = sdRound((vUv - 0.5) * size, size * 0.5, 0.045);
  float aa = fwidth(d);
  float alpha = 1.0 - smoothstep(-aa, aa, d);
  vec3 mauve = vec3(0.56, 0.47, 0.50);
  vec3 col = texture2D(map, (vUv - 0.5) * uMediaScale + 0.5).rgb;
  col += mix(0.10, 0.025, uVideo) * smoothstep(0.5, 1.0, vUv.y);              // lighter sheen over video
  col = mix(col, mauve, 0.22 * smoothstep(0.7, 1.0, abs(vUv.x * 2.0 - 1.0))); // sides turn away from the light
  col = mix(col, vec3(1.0), 0.6 * (1.0 - smoothstep(0.0, 0.012, -d)));      // glass rim
  col = mix(col, mauve, uDim);
  gl_FragColor = vec4(col * alpha, alpha);
}`;

// lens over the whole wall: slight barrel, colour fringes that grow toward the sides and while moving
const postFrag = /* glsl */ `
uniform sampler2D tScene;
uniform float uAb;
varying vec2 vUv;
void main() {
  vec2 c = vUv - 0.5;
  vec2 uv = 0.5 + c * (1.0 - 0.06 * dot(c, c));
  float side = smoothstep(0.12, 0.5, abs(c.x));
  vec2 off = c * (0.0012 + uAb) * side * side;
  vec4 r = texture2D(tScene, uv + off);
  vec4 g = texture2D(tScene, uv);
  vec4 b = texture2D(tScene, uv - off);
  // the page background, drawn here so fringes tint softly instead of turning into neon bands
  // (same radial gradient as the section's CSS: 120% x 80% ellipse, stops at 0 / 55 / 100%)
  float k = length(c / vec2(1.2, 0.8));
  vec3 bg = mix(vec3(0.973, 0.961, 0.945), vec3(0.929, 0.902, 0.937), smoothstep(0.0, 0.55, k));
  bg = mix(bg, vec3(0.871, 0.816, 0.878), smoothstep(0.55, 1.0, k));
  // each colour channel sits on the background on its own, then they recombine
  gl_FragColor = vec4(r.r + bg.r * (1.0 - r.a), g.g + bg.g * (1.0 - g.a), b.b + bg.b * (1.0 - b.a), 1.0);
}`;

// draws a card face: the project image if there is one, otherwise a soft labelled placeholder
async function paintCard(it: Item, font: string) {
  const c = document.createElement("canvas");
  c.width = 1600;
  c.height = 1000;
  const g = c.getContext("2d")!;
  g.fillStyle = it.bg;
  g.fillRect(0, 0, 1600, 1000);
  const wash = g.createLinearGradient(0, 0, 1600, 1000);
  wash.addColorStop(0, "rgba(255,255,255,0.45)");
  wash.addColorStop(1, "rgba(143,119,127,0.16)");
  g.fillStyle = wash;
  g.fillRect(0, 0, 1600, 1000);
  if (it.img) {
    try {
      const im = new Image();
      im.src = it.img;
      await im.decode();
      const s = Math.max(1600 / im.width, 1000 / im.height);
      g.drawImage(im, (1600 - im.width * s) / 2, (1000 - im.height * s) / 2, im.width * s, im.height * s);
      return c;
    } catch {}
  }
  g.fillStyle = "#6e5960";
  g.font = `500 34px ${font}`;
  g.textAlign = "center";
  g.fillText(`[ ${it.name} — 16:10 image ]`, 800, 512);
  return c;
}

// Selected work: a curved glass wall you drag, swipe or scroll sideways
export default function Work() {
  const pos = useMotionValue(0); // which panel is centred; fractional while moving
  const [active, setActive] = useState(0);
  const [card, setCard] = useState({ w: 0, h: 0, mobile: false });
  const [gl, setGl] = useState(true);
  const [loading, setLoading] = useState(false); // the front film is on its way (shows a spinner over the card)
  const section = useRef<HTMLElement>(null);
  const canvasBox = useRef<HTMLDivElement>(null);
  const videos = useRef(new Map<string, HTMLVideoElement>());
  const fallbackVideo = useRef<HTMLVideoElement>(null);
  const drag = useRef({ on: false, x: 0, start: 0, moved: false });

  useMotionValueEvent(pos, "change", (p) => setActive(mod(Math.round(p))));
  // wall parallax: from the section entering until its bottom meets the screen bottom (the hold frame),
  // the wall rises into place slightly behind the page scroll
  const calm = useReducedMotion();
  const { scrollYProgress: rise } = useScroll({ target: section, offset: ["start end", "end end"] });
  const wallY = useTransform(rise, [0, 1], [80, 0]);
  const wallYSmall = useTransform(rise, [0, 1], [30, 0]); // phones: a gentler rise, so the wall stays close under the title

  // any hands-on move (drag, click, arrows, sideways scroll) pauses the auto-turn for a few seconds
  const lastTouch = useRef(0);
  const entryStart = useRef<number | null>(null);
  const spunOnEntry = useRef(false);
  const touch = () => {
    lastTouch.current = performance.now();
    entryStart.current = null;
    spunOnEntry.current = true;
  };
  const settle = (target: number) => { touch(); return animate(pos, target, spring); };
  const go = (dir: number) => settle(Math.round(pos.get()) + dir);

  const overMiddle = useRef(false);
  const { scrollYProgress: entry } = useScroll({
    target: canvasBox,
    offset: ["start 0.88", "start 0.28"],
  });
  useMotionValueEvent(entry, "change", (progress) => {
    if (calm || !gl) return;
    if (entryStart.current === null && progress === 0) spunOnEntry.current = false;
    if (entryStart.current === null) {
      if (spunOnEntry.current || progress <= (entry.getPrevious() ?? 0) || progress >= 1 || drag.current.on) return;
      pos.stop();
      entryStart.current = pos.get();
    }

    // Accelerate through the middle of the entrance, then ease onto a centered card.
    const start = entryStart.current;
    const sweep = progress * progress * (3 - 2 * progress);
    pos.set(start + (Math.round(start) + 1 - start) * sweep);
    lastTouch.current = performance.now();
    if (progress === 0 || progress === 1) {
      entryStart.current = null;
      spunOnEntry.current = progress === 1;
    }
  });

  // Give each centered card time to read. Video cards get a full reel of actual playback.
  useEffect(() => {
    const sec = section.current;
    if (!sec || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let onScreen = false;
    const io = new IntersectionObserver(([e]) => { onScreen = e.intersectionRatio >= 0.3; }, { threshold: 0.3 });
    io.observe(sec);

    let raf = 0;
    let last = performance.now();
    let centered: number | null = null;
    let dwell = 0;
    let played = 0;
    let previousTime: number | null = null;
    let turn: ReturnType<typeof animate> | null = null;

    const tick = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      const at = Math.round(pos.get());
      const ready = entryStart.current === null && !drag.current.on && Math.abs(pos.get() - at) < 0.03;

      if (centered !== at || !ready) {
        centered = at;
        dwell = 0;
        played = 0;
        previousTime = null;
      }

      if (now - lastTouch.current < 5000 && turn) {
        turn.stop();
        turn = null;
      }

      if (ready && !turn && onScreen && !document.hidden) {
        dwell += dt;
        const item = items[mod(at)];
        const video = item.video ? videos.current.get(item.key) ?? fallbackVideo.current : null;
        const duration = video?.duration ?? 0;
        if (video && Number.isFinite(duration) && duration > 0) {
          const time = video.currentTime;
          if (previousTime !== null) {
            const elapsed = time >= previousTime ? time - previousTime : duration - previousTime + time;
            played += elapsed;
          }
          previousTime = time;
        }

        const watchedEnough = !item.video || (duration > 0 && played >= duration);
        if (dwell >= 4 && watchedEnough && now - lastTouch.current >= 5000 && !overMiddle.current) {
          turn = animate(pos, at + 1, {
            duration: 1.4,
            ease: [0.45, 0, 0.25, 1],
            onComplete: () => { turn = null; },
          });
        }
      } else {
        previousTime = null;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      turn?.stop();
      io.disconnect();
    };
  }, [pos]);

  // three.js scene: loaded only when the section is near the screen
  useEffect(() => {
    const host = canvasBox.current;
    const sec = section.current;
    if (!host || !sec) return;
    let dead = false;
    let cleanup = () => {};

    const start = async () => {
      const THREE = await import("three");
      if (dead) return;
      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try {
        renderer = new THREE.WebGLRenderer({ alpha: true, premultipliedAlpha: true });
      } catch {
        setGl(false);
        return;
      }
      renderer.setClearColor(0x000000, 0);
      renderer.domElement.style.cssText = "position:absolute;inset:0;width:100%;height:100%";
      host.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(60, 1, 0.01, 10);

      // a flat plane bent around the cylinder
      const geo = new THREE.PlaneGeometry(ARC, PANEL_H, 64, 1);
      const p = geo.attributes.position;
      for (let i = 0; i < p.count; i++) {
        const a = p.getX(i);
        p.setXYZ(i, Math.sin(a), p.getY(i), -Math.cos(a));
      }
      p.needsUpdate = true;

      const font = getComputedStyle(document.body).fontFamily;
      await document.fonts.ready;
      const faces = await Promise.all(items.map((it) => paintCard(it, font)));
      if (dead) { renderer.dispose(); renderer.domElement.remove(); return; }
      const panels = faces.map((cv, i) => {
        const tex = new THREE.CanvasTexture(cv);
        tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
        const source = items[i].video;
        const video = source ? document.createElement("video") : null;
        if (video && source) {
          // no src yet: showVideos() below loads each film only once its panel is in front or next to it
          video.muted = true;
          video.loop = true;
          video.playsInline = true;
          video.preload = "none";
          video.dataset.src = window.matchMedia(PHONE_MEDIA).matches ? phoneVideoFor(source) : source; // phones get the 720p copy
          video.className = "pointer-events-none absolute inset-0 -z-10 h-px w-px opacity-0";
          host.appendChild(video);
          videos.current.set(items[i].key, video);
        }
        const videoTexture = video ? new THREE.VideoTexture(video) : null;
        const mat = new THREE.ShaderMaterial({
          uniforms: { map: { value: tex }, uDim: { value: 0 }, uVideo: { value: 0 }, uMediaScale: { value: new THREE.Vector2(1, 1) } },
          vertexShader: panelVert,
          fragmentShader: panelFrag,
          transparent: true,
          premultipliedAlpha: true,
          side: THREE.DoubleSide,
        });
        const m = new THREE.Mesh(geo, mat);
        scene.add(m);
        return { mesh: m, tex, video, videoTexture };
      });

      // only the film in front plays; the ones behind it pause (they load just enough to show a still frame,
      // and the painted card shows until then) and pick up again when they come to the front. films further
      // away than the next panel aren't loaded at all. this keeps the browser from decoding every 1080p film at once
      let front = -1;
      // a phone can refuse to start films on its own (e.g. iPhone Low Power Mode). then there's nothing to wait
      // for: no spinner, the card keeps showing the film's still, and a tap anywhere (pointerup below) tries again
      let blocked = false;
      const onPlaying = () => { blocked = false; };
      panels.forEach(({ video }) => video?.addEventListener("playing", onPlaying));
      const showVideos = (at: number) => {
        front = mod(Math.round(at));
        panels.forEach(({ video }, i) => {
          if (!video) return;
          const d = Math.abs(wrap(i - front));
          if (d > 1.5) { video.pause(); return; }
          if (d < 0.5) video.preload = "auto";
          else if (video.preload === "none") video.preload = "metadata";
          if (!video.getAttribute("src") && video.dataset.src) video.src = video.dataset.src;
          if (d < 0.5) {
            if (video.paused && !document.hidden) {
              void video.play().catch((e: unknown) => { if (e instanceof DOMException && e.name === "NotAllowedError") blocked = true; });
            }
          }
          else video.pause();
        });
      };
      const resumeVideos = () => {
        if (document.hidden) return;
        showVideos(pos.get());
      };
      resumeVideos();
      document.addEventListener("visibilitychange", resumeVideos);
      window.addEventListener("pointerup", resumeVideos);
      window.addEventListener("keydown", resumeVideos);

      // render the wall into a texture, then draw it through the lens
      const rt = new THREE.WebGLRenderTarget(1, 1, { samples: 2 });
      const post = new THREE.ShaderMaterial({
        uniforms: { tScene: { value: rt.texture }, uAb: { value: 0 } },
        vertexShader: "varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }",
        fragmentShader: postFrag,
        transparent: true,
      });
      const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), post);
      const postScene = new THREE.Scene();
      postScene.add(quad);
      const postCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

      const resize = () => {
        const { width, height } = host.getBoundingClientRect();
        if (!width || !height) return;
        const mobile = width < 700;
        // how much of the width the middle panel takes; on wide screens, capped so it stays ~60% of the height
        const share = mobile ? 0.84 : Math.min(0.66, (0.6 * height * 1.6) / width);
        const t = Math.tan(ARC / 2) / share; // tan of half the horizontal view
        camera.aspect = width / height;
        camera.fov = (2 * Math.atan(t / camera.aspect) * 180) / Math.PI;
        camera.updateProjectionMatrix();
        const dpr = Math.min(window.devicePixelRatio, 2, Math.sqrt(MAX_RENDER_PIXELS / (width * height)));
        renderer.setDrawingBufferSize(width, height, dpr);
        rt.setSize(renderer.domElement.width, renderer.domElement.height);
        setCard({ w: Math.round(width * share), h: Math.round(((PANEL_H / 2) * width) / t), mobile });
      };
      resize();
      const ro = new ResizeObserver(resize);
      ro.observe(host);

      let raf = 0;
      let visible = true;
      let wasLoading = false;
      const frame = () => {
        const at = pos.get();
        if (mod(Math.round(at)) !== front) showVideos(at);
        // spinner while the front film should be playing but hasn't got enough to play yet
        const fv = panels[front]?.video;
        const nowLoading = !!fv && !blocked && !document.hidden && (fv.paused || fv.readyState < HTMLMediaElement.HAVE_FUTURE_DATA);
        if (nowLoading !== wasLoading) { wasLoading = nowLoading; setLoading(nowLoading); }
        panels.forEach((panel, i) => {
          const { mesh, video, videoTexture } = panel;
          const d = wrap(i - at);
          mesh.visible = Math.abs(d) < 1.7;
          mesh.rotation.y = -d * STEP;
          const uniforms = mesh.material.uniforms;
          uniforms.uDim.value = Math.min(0.3, Math.abs(d) * 0.26);
          if (!video || !videoTexture) return;
          if (uniforms.map.value !== videoTexture && video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
            const ratio = (video.videoWidth / video.videoHeight) / 1.6;
            uniforms.uMediaScale.value.set(Math.min(1, 1 / ratio), Math.min(1, ratio));
            uniforms.map.value = videoTexture;
            uniforms.uVideo.value = 1;
            videoTexture.needsUpdate = true; // a paused film (behind the front one) still shows its frame
          }
        });
        post.uniforms.uAb.value = Math.min(0.012, Math.abs(pos.getVelocity()) * 0.004);
        renderer.setRenderTarget(rt);
        renderer.clear();
        renderer.render(scene, camera);
        renderer.setRenderTarget(null);
        renderer.clear();
        renderer.render(postScene, postCam);
        if (visible) raf = requestAnimationFrame(frame);
      };
      const io = new IntersectionObserver(([e]) => {
        visible = e.isIntersecting;
        cancelAnimationFrame(raf);
        if (visible) {
          resumeVideos();
          raf = requestAnimationFrame(frame);
        } else {
          panels.forEach(({ video }) => video?.pause()); // scrolled away: nothing plays off screen
        }
      });
      io.observe(host);

      cleanup = () => {
        cancelAnimationFrame(raf);
        io.disconnect();
        ro.disconnect();
        panels.forEach(({ video }) => video?.removeEventListener("playing", onPlaying));
        document.removeEventListener("visibilitychange", resumeVideos);
        window.removeEventListener("pointerup", resumeVideos);
        window.removeEventListener("keydown", resumeVideos);
        panels.forEach(({ mesh, tex, video, videoTexture }, i) => {
          if (video) {
            video.pause();
            video.removeAttribute("src");
            video.load();
            video.remove();
            videos.current.delete(items[i].key);
          }
          videoTexture?.dispose();
          tex.dispose();
          mesh.material.dispose();
        });
        geo.dispose();
        quad.geometry.dispose();
        post.dispose();
        rt.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    };

    // wait until the wall is within a screen of view before loading three.js
    const near = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      near.disconnect();
      start();
    }, { rootMargin: "100% 0px" });
    near.observe(sec);

    return () => { dead = true; near.disconnect(); cleanup(); };
  }, [pos]);

  // trackpad / horizontal wheel turns the wall; vertical scrolling is left alone
  useEffect(() => {
    const el = canvasBox.current?.parentElement;
    if (!el) return;
    let t: ReturnType<typeof setTimeout>;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      pos.stop();
      touch();
      pos.set(pos.get() + e.deltaX / 700);
      clearTimeout(t);
      t = setTimeout(() => animate(pos, Math.round(pos.get()), spring), 120);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => { el.removeEventListener("wheel", onWheel); clearTimeout(t); };
  }, [pos]);

  function onDown(e: React.PointerEvent) {
    if (e.button !== 0) return;
    pos.stop();
    touch();
    drag.current = { on: true, x: e.clientX, start: pos.get(), moved: false };
  }
  function onMove(e: React.PointerEvent) {
    const g = drag.current;
    if (!g.on) return;
    const dx = e.clientX - g.x;
    if (Math.abs(dx) > 6 && !g.moved) {
      g.moved = true;
      e.currentTarget.setPointerCapture(e.pointerId);
    }
    if (g.moved) pos.set(g.start - dx / ((card.w || 700) * 0.9));
  }
  function onUp() {
    const g = drag.current;
    if (!g.on) return;
    g.on = false;
    if (!g.moved) return;
    const v = pos.getVelocity(); // flick: carry some velocity, never more than two panels
    settle(Math.round(pos.get() + Math.max(-2, Math.min(2, v * 0.18))));
  }
  // a plain click beside the middle panel turns the wall that way
  function onClick(e: React.MouseEvent<HTMLDivElement>) {
    if (drag.current.moved) { e.preventDefault(); e.stopPropagation(); drag.current.moved = false; return; }
    const r = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - r.left - r.width / 2;
    if (Math.abs(x) > card.w / 2) go(Math.sign(x));
  }

  const cur = items[active];
  const hh = card.h / 2;

  // the menu's "Work" link: scroll so the carousel fills the screen (see the #work marker below). done here rather
  // than left to the browser's own jump, which lands short on phones. also fixes the landing when you arrive from
  // another page at /#work, once the carousel has measured itself.
  const landed = useRef(false);
  useEffect(() => {
    if (!card.w) return;
    const go = (smooth: boolean) => {
      const marker = document.getElementById("work");
      if (!marker) return;
      const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: marker.getBoundingClientRect().top + window.scrollY, behavior: smooth && !calm ? "smooth" : "instant" });
    };
    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest?.('a[href$="#work"]');
      if (!link || window.location.pathname !== "/" || e.metaKey || e.ctrlKey || e.shiftKey) return;
      e.preventDefault(); // (runs before the link's own handler, which then stands down)
      if (window.location.hash !== "#work") history.pushState(null, "", "#work");
      go(true);
    };
    document.addEventListener("click", onClick, true);
    if (!landed.current && window.location.hash === "#work") {
      landed.current = true;
      requestAnimationFrame(() => go(false));
    }
    return () => document.removeEventListener("click", onClick, true);
  }, [card.w, card.mobile]);

  return (
    // the wrapper only exists to hold the #work landing marker: it can't live inside the section, which clips
    // anything poking outside it (and the browser won't scroll to a clipped marker)
    <div className="relative">
      {/* where the menu's "Work" link lands, lined up so the carousel fills the screen exactly as it looks once
          you've scrolled into place (big project name on top, panel, counter). the wall is the last thing in the
          section, so on desktop that's one screen above its bottom; on phones (shorter wall) the screen is centred
          on the wall instead */}
      <span
        id="work"
        aria-hidden
        className="pointer-events-none absolute inset-x-0 h-px"
        style={{ bottom: card.mobile ? `calc(${(card.h + 300) / 2}px + 50svh - 1px)` : "calc(100svh - 1px)" }}
      />
    <section
      ref={section}
      aria-roledescription="carousel"
      aria-label="Selected work"
      className="relative overflow-hidden bg-[radial-gradient(120%_80%_at_50%_50%,#F8F5F1_0%,#EDE6EF_55%,#DED0E0_100%)]"
    >
      {/* a light transition in: the top eases in from the page colour above (the skills strip), no edge */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-paper to-transparent" />


      <div className="relative z-10 mx-auto -mb-8 max-w-[1280px] px-6 pt-20 sm:-mb-10 sm:px-12 sm:pt-28">
        <GiantTitle />
      </div>


      {/* the wall: parallax, rises more slowly than the page and lands exactly in place at the hold frame */}
      <motion.div
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        onClickCapture={onClick}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") { e.preventDefault(); go(1); }
          if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
        }}
        className="relative z-20 mt-4 cursor-grab touch-pan-y select-none active:cursor-grabbing"
        style={{ height: card.mobile ? card.h + 300 : "max(640px, 100svh)", y: calm ? 0 : card.mobile ? wallYSmall : wallY }}
      >
        {/* the wall's top and bottom edges fade into the section background, so there's no seam under the header */}
        <div ref={canvasBox} aria-hidden className="absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent,black_120px,black_calc(100%-120px),transparent)]" />

        {/* no WebGL: a flat card so the work is still there */}
        {!gl && (
          <div className="absolute left-1/2 top-1/2 flex aspect-[16/10] w-[70%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[14px]" style={{ background: cur.bg }}>
            {cur.video ? (
              <video ref={fallbackVideo} key={cur.video} poster={cur.img || undefined} muted loop playsInline autoPlay className="h-full w-full rounded-[inherit] object-cover">
                <source src={phoneVideoFor(cur.video)} type="video/mp4" media={PHONE_MEDIA} />
                <source src={cur.video} type="video/mp4" />
              </video>
            ) : (
              <span className="label text-mauve">[ {cur.name} — 16:10 image ]</span>
            )}
          </div>
        )}

        {/* the middle panel is a real link, sitting exactly over the glass */}
        {card.w > 0 && (
          cur.href ? (
            <Link
              href={cur.href}
              draggable={false}
              aria-label={`${cur.name} — view case study`}
              className="group absolute left-1/2 top-1/2 z-10 rounded-[14px]"
              onPointerEnter={() => (overMiddle.current = true)}
              onPointerLeave={() => (overMiddle.current = false)}
              style={{ width: card.w, height: card.h, marginLeft: -card.w / 2, marginTop: -hh }}
            >
              <span className="label absolute bottom-5 left-1/2 -translate-x-1/2 translate-y-2 rounded-full bg-paper/85 px-4 py-2 opacity-0 backdrop-blur transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
                View case study ↗
              </span>
            </Link>
          ) : (
            <span tabIndex={0} aria-label={cur.name} onPointerEnter={() => (overMiddle.current = true)} onPointerLeave={() => (overMiddle.current = false)} className="absolute left-1/2 top-1/2 z-10 rounded-[14px]" style={{ width: card.w, height: card.h, marginLeft: -card.w / 2, marginTop: -hh }} />
          )
        )}

        {/* loading ring over the middle panel while its film is on its way (the card shows the film's still meanwhile) */}
        {card.w > 0 && gl && (
          <div className="pointer-events-none absolute left-1/2 top-1/2 z-[11] grid place-items-center" style={{ width: card.w, height: card.h, marginLeft: -card.w / 2, marginTop: -hh }}>
            <Spinner show={loading} />
          </div>
        )}

        {/* huge name sitting just above the middle panel (clear of its curved top edge) */}
        <div className="pointer-events-none absolute inset-x-0 z-20 px-4 text-center" style={{ bottom: `calc(50% + ${hh}px + ${card.mobile ? 14 : 28}px)` }} aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={cur.key}
              initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -12, filter: "blur(8px)" }}
              transition={{ duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }}
            >
              <h3 className="font-serif text-[clamp(40px,5.5vw,92px)] uppercase leading-[0.85] tracking-tight">{cur.name}</h3>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* counter under the panel, with quiet arrows */}
        <div className="absolute inset-x-0 z-20 flex items-center justify-center gap-5" style={{ top: `calc(50% + ${hh}px + 18px)` }}>
          <button type="button" onClick={() => go(-1)} aria-label="Previous project" className="navlink inline-flex min-h-11 min-w-11 items-center justify-center font-serif text-xl text-mauve">←</button>
          <p className="label tabular-nums">{String(active + 1).padStart(2, "0")}/{String(N).padStart(2, "0")}</p>
          <button type="button" onClick={() => go(1)} aria-label="Next project" className="navlink inline-flex min-h-11 min-w-11 items-center justify-center font-serif text-xl text-mauve">→</button>
        </div>
      </motion.div>
    </section>
    </div>
  );
}
