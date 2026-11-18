import React from "react";
import { Mat, apply, COLORS } from "./matrix";

export const W = 1920;
export const H = 1080;
export const UNIT = 90; // pixels per grid unit

// math coords -> screen coords (y up)
export const toScreen = (x: number, y: number): [number, number] => [
  W / 2 + x * UNIT,
  H / 2 - y * UNIT,
];

export const Arrow: React.FC<{
  to: [number, number];
  color: string;
  width?: number;
}> = ({ to, color, width = 7 }) => {
  const [x0, y0] = toScreen(0, 0);
  const [x1, y1] = toScreen(to[0], to[1]);
  const ang = Math.atan2(y1 - y0, x1 - x0);
  const head = 26;
  const p = (a: number): string =>
    `${x1 - head * Math.cos(ang + a)},${y1 - head * Math.sin(ang + a)}`;
  return (
    <g>
      <line x1={x0} y1={y0} x2={x1} y2={y1} stroke={color} strokeWidth={width} strokeLinecap="round" />
      <polygon points={`${x1},${y1} ${p(0.4)} ${p(-0.4)}`} fill={color} />
    </g>
  );
};

// Draws the plane's grid lines after applying matrix m.
export const Grid: React.FC<{ matrix: Mat; range?: number }> = ({
  matrix,
  range = 14,
}) => {
  const lines: React.ReactNode[] = [];
  for (let i = -range; i <= range; i++) {
    const axis = i === 0;
    const stroke = axis ? COLORS.axis : COLORS.grid;
    const sw = axis ? 3 : 1.5;
    const [ax, ay] = toScreen(...apply(matrix, i, -range));
    const [bx, by] = toScreen(...apply(matrix, i, range));
    lines.push(<line key={`v${i}`} x1={ax} y1={ay} x2={bx} y2={by} stroke={stroke} strokeWidth={sw} />);
    const [cx, cy] = toScreen(...apply(matrix, -range, i));
    const [dx, dy] = toScreen(...apply(matrix, range, i));
    lines.push(<line key={`h${i}`} x1={cx} y1={cy} x2={dx} y2={dy} stroke={stroke} strokeWidth={sw} />);
  }
  return <>{lines}</>;
};
