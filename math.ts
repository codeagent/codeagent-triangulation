export const floor = Math.floor;
export const min = Math.min;
export const max = Math.max;
export const sqrt = Math.sqrt;
export const abs = Math.abs;
export const sign = Math.sign;
export const cos = Math.cos;
export const sin = Math.sin;
export const tan = Math.tan;
export const PI = Math.PI;
export const clamp = (t: number, from: number, to: number) =>
  max(from, min(to, t));
export const lerp = (a: number, b: number, t: number) => a * (1.0 - t) + b * t;
export const random = Math.random;
export const rangeRandom = (from: number, to: number) =>
  lerp(from, to, random());
export const EPS = 1.0e-6;

/**
 * vec2
 */
export type vec2 = [number, number];
export const mult = (v: vec2, scalar: number): vec2 => [
  v[0] * scalar,
  v[1] * scalar
];
export const add = (a: vec2, b: vec2): vec2 => [a[0] + b[0], a[1] + b[1]];
export const sub = (a: vec2, b: vec2): vec2 => [a[0] - b[0], a[1] - b[1]];
export const length = (a: vec2): number => sqrt(a[0] ** 2 + a[1] ** 2);
export const distance = (a: vec2, b: vec2): number => length(sub(a, b));
export const normalize = (v: vec2): vec2 => mult(v, 1.0 / length(v));
export const dot = (a: vec2, b: vec2): number => a[0] * b[0] + a[1] * b[1];
export const angle = (a: vec2, b: vec2): number =>
  (dot(normalize(a), normalize(b)) - 1.0) * -0.5 * PI;
export const cross = (a: vec2, b: vec2): number => -a[0] * b[1] + b[0] * a[1];
export const lerpvec2 = (a: vec2, b: vec2, t: number): vec2 => [
  lerp(a[0], b[0], t),
  lerp(a[1], b[1], t)
];
export const circleRandom = (): vec2 => {
  const angle = random() * 2.0 * PI;
  return [cos(angle), sin(angle)];
};
export const sangle = (a: vec2, b: vec2): number =>
  angle(a, b) * sign(cross(a, b));

/**
 * Misc
 */
export type Polygon = vec2[];

export interface Circle {
  center: vec2;
  radius: number;
}

export type Edge = [vec2, vec2];

export interface Triangle {
  p0: vec2;
  p1: vec2;
  p2: vec2;
}

export const getBoundingCirle = (p0: vec2, p1: vec2, p2: vec2): Circle => {
  let n0 = sub(p1, p0);
  n0 = [n0[1], -n0[0]];

  let n1 = sub(p2, p1);
  n1 = [n1[1], -n1[0]];

  const line0 = createLine(lerpvec2(p0, p1, 0.5), n0);
  const line1 = createLine(lerpvec2(p2, p1, 0.5), n1);
  const center = getIntersection(line0, line1);

  return {
    center,
    radius: length(sub(p0, center))
  };
};

export const contains = (circle: Circle, point: vec2): boolean =>
  length(sub(point, circle.center)) <= circle.radius;

export type line = [number, number, number];

export const createLine = (p: vec2, dir: vec2): line => [
  dir[1],
  -dir[0],
  -p[0] * dir[1] + p[1] * dir[0]
];

export const getIntersection = (line0: line, line1: line): vec2 => {
  const det = line0[0] * line1[1] - line0[1] * line1[0];

  return [
    (line1[2] * line0[1] - line0[2] * line1[1]) / det,
    (line0[2] * line1[0] - line1[2] * line0[0]) / det
  ];
};
