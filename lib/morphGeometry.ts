/** Dependency-free software projection for an isolated visual experiment.
 * Canvas 2D only: no WebGL, external assets, reusable generator, or license grant.
 */
export type Point3 = { x: number; y: number; z: number };
export const clamp01 = (value: number): number => Math.max(0, Math.min(1, value));
const signedPow = (n: number, exp: number): number => Math.sign(n) * Math.pow(Math.abs(n), exp);

/** t=0: rounded cube; t=1: sphere. Uses a superellipsoid. */
export function surfacePoint(longitude: number, latitude: number, t: number): Point3 {
  const exp = 0.33 + 0.67 * clamp01(t);
  const vertical = signedPow(Math.cos(latitude), exp);
  return {
    x: signedPow(Math.cos(longitude), exp) * vertical,
    y: signedPow(Math.sin(longitude), exp) * vertical,
    z: signedPow(Math.sin(latitude), exp),
  };
}

export function rotatePoint({ x, y, z }: Point3, yaw: number, pitch: number): Point3 {
  const cy = Math.cos(yaw), sy = Math.sin(yaw);
  const cp = Math.cos(pitch), sp = Math.sin(pitch);
  const a = x * cy + z * sy;
  const b = -x * sy + z * cy;
  return { x: a, y: y * cp - b * sp, z: y * sp + b * cp };
}

function normal(a: Point3, b: Point3, c: Point3): Point3 {
  const ax = b.x - a.x, ay = b.y - a.y, az = b.z - a.z;
  const bx = c.x - a.x, by = c.y - a.y, bz = c.z - a.z;
  const x = ay * bz - az * by, y = az * bx - ax * bz, z = ax * by - ay * bx;
  const len = Math.hypot(x, y, z) || 1;
  return { x: x / len, y: y / len, z: z / len };
}

/** Low mesh density and bounded DPR keep work manageable on mobile devices. */
export function drawMorph(
  ctx: CanvasRenderingContext2D, width: number, height: number,
  morph: number, yaw: number, pitch: number,
): void {
  ctx.clearRect(0, 0, width, height);
  const lonCount = 32, latCount = 16;
  const vertices: Point3[][] = [];
  for (let row = 0; row <= latCount; row++) {
    const lat = -Math.PI / 2 + row * Math.PI / latCount;
    const ring: Point3[] = [];
    for (let col = 0; col <= lonCount; col++) {
      ring.push(rotatePoint(surfacePoint(col * 2 * Math.PI / lonCount, lat, morph), yaw, pitch));
    }
    vertices.push(ring);
  }
  const focal = Math.min(width, height) * 0.95;
  const project = ({ x, y, z }: Point3) => ({
    x: width / 2 + focal * x / (3.4 - z),
    y: height / 2 - focal * y / (3.4 - z),
  });
  type Face = { a: Point3; b: Point3; c: Point3; depth: number; light: number };
  const faces: Face[] = [];
  const append = (a: Point3, b: Point3, c: Point3) => {
    const n = normal(a, b, c);
    // Two-sided shading avoids winding/degenerate pole artifacts.
    const light = Math.abs(n.x * -0.45 + n.y * 0.65 + n.z * 0.62);
    faces.push({ a, b, c, depth: (a.z + b.z + c.z) / 3, light });
  };
  for (let i = 0; i < latCount; i++) {
    for (let j = 0; j < lonCount; j++) {
      const a = vertices[i][j], b = vertices[i + 1][j];
      const c = vertices[i + 1][j + 1], d = vertices[i][j + 1];
      append(a, b, c);
      append(a, c, d);
    }
  }
  faces.sort((a, b) => a.depth - b.depth);
  for (const face of faces) {
    const a = project(face.a), b = project(face.b), c = project(face.c);
    const shade = Math.round(52 + 127 * Math.min(1, face.light));
    ctx.fillStyle = `rgb(${shade}, ${shade + 8}, ${shade - 7})`;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.lineTo(c.x, c.y);
    ctx.closePath();
    ctx.fill();
  }
}