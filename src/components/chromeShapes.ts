// the four traced chrome shapes (blob, star, geometric, flower), shared by the cursor/corner object and the marquee
// beads. public/models/chrome-morph.bin: "CMRF" | u32 version | u32 shapes | u32 verts | f32 scale | int16 xyz.
// every shape sits on the same welded icosahedron, so vertex k means the same direction in all of them.
import type * as ThreeNS from "three";

export const DETAIL = 48; // sphere detail; must match the traced file

export type ChromeShapes = {
  index: number[];
  dirs: Float32Array; // unit direction of each vertex on the shared sphere
  shapes: Float32Array[]; // positions per shape
  normals: Float32Array[]; // normals per shape
};

let cached: Promise<ChromeShapes | null> | null = null;

// fetched and parsed once per page, however many things ask for it
export function loadChromeShapes(THREE: typeof ThreeNS): Promise<ChromeShapes | null> {
  cached ??= (async () => {
    const res = await fetch("/models/chrome-morph.bin").catch(() => null);
    if (!res?.ok) return null;
    const buf = await res.arrayBuffer();

    const { verts, index } = mergeVerts(new THREE.IcosahedronGeometry(1, DETAIL).getAttribute("position").array as Float32Array);
    const dirs = verts.slice();
    for (let i = 0; i < dirs.length; i += 3) {
      const l = Math.hypot(dirs[i], dirs[i + 1], dirs[i + 2]);
      dirs[i] /= l; dirs[i + 1] /= l; dirs[i + 2] /= l;
    }

    const head = new DataView(buf, 0, 20);
    const count = head.getUint32(8, true), nv = head.getUint32(12, true), scale = head.getFloat32(16, true);
    if (nv !== dirs.length / 3) { console.warn("chrome shapes: traced file doesn't match the sphere"); return null; }
    const raw = new Int16Array(buf, 20, count * nv * 3);
    const shapes: Float32Array[] = [];
    for (let k = 0; k < count; k++) {
      const s = new Float32Array(nv * 3);
      for (let i = 0; i < s.length; i++) s[i] = (raw[k * nv * 3 + i] / 32767) * scale;
      shapes.push(s);
    }
    const normals = shapes.map((p) => {
      const g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.BufferAttribute(p, 3));
      g.setIndex(index);
      g.computeVertexNormals();
      const out = (g.getAttribute("normal").array as Float32Array).slice();
      g.dispose();
      return out;
    });
    return { index, dirs, shapes, normals };
  })();
  return cached;
}

// the polished chrome both use
export function chromeMaterial(THREE: typeof ThreeNS) {
  return new THREE.MeshPhysicalMaterial({
    color: 0xf2f2f5, metalness: 1, roughness: 0.06,
    clearcoat: 1, clearcoatRoughness: 0.05, iridescence: 0.15,
  });
}

// the icosahedron comes non-indexed: weld duplicate vertices so neighbours share them (same as when traced)
function mergeVerts(pos: Float32Array) {
  const map = new Map<string, number>();
  const verts: number[] = [];
  const index: number[] = [];
  for (let i = 0; i < pos.length; i += 3) {
    const key = `${pos[i].toFixed(5)},${pos[i + 1].toFixed(5)},${pos[i + 2].toFixed(5)}`;
    let id = map.get(key);
    if (id === undefined) { id = verts.length / 3; map.set(key, id); verts.push(pos[i], pos[i + 1], pos[i + 2]); }
    index.push(id);
  }
  return { verts: new Float32Array(verts), index };
}
