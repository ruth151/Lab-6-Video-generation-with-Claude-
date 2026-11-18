export type Mat = readonly [number, number, number, number]; // [a, b, c, d] = [[a, b], [c, d]]
export const IDENTITY: Mat = [1, 0, 0, 1];

export const apply = (m: Mat, x: number, y: number): [number, number] => [
  m[0] * x + m[1] * y,
  m[2] * x + m[3] * y,
];

export const lerpMat = (from: Mat, to: Mat, t: number): Mat => [
  from[0] + (to[0] - from[0]) * t,
  from[1] + (to[1] - from[1]) * t,
  from[2] + (to[2] - from[2]) * t,
  from[3] + (to[3] - from[3]) * t,
];

export const COLORS = {
  bg: "#0b1226",
  grid: "#2b3a67",
  axis: "#8a97c0",
  ihat: "#5bd68a",
  jhat: "#ff6b6b",
  point: "#ffd166",
  text: "#e8ecf8",
};
