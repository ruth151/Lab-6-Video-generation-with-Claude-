import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, staticFile, interpolate, useCurrentFrame } from "remotion";
import { Arrow, Grid, toScreen } from "../lib/Grid";
import { COLORS, IDENTITY, Mat, apply } from "../lib/matrix";

export const SCENE4_FPS = 30;
export const SCENE4_DURATION = Math.ceil((16.0 + 1) * SCENE4_FPS);

const SHEAR: Mat = [1, 1, 0, 1];
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const sec = (s: number) => Math.round(s * SCENE4_FPS);
const appear = (frame: number, s: number, len = 12) =>
  interpolate(frame, [sec(s), sec(s) + len], [0, 1], clamp);

const txt = (
  x: number,
  y: number,
  text: string,
  color: string,
  size = 56,
  opacity = 1,
  anchor: "start" | "middle" | "end" = "start",
) => (
  <text
    x={x}
    y={y}
    fill={color}
    fontSize={size}
    fontFamily="Georgia, serif"
    fontStyle="italic"
    textAnchor={anchor}
    opacity={opacity}
  >
    {text}
  </text>
);

export const Scene4Columns: React.FC = () => {
  const frame = useCurrentFrame();
  const m = SHEAR;

  const [ix, iy] = toScreen(...apply(m, 1, 0));
  const [jx, jy] = toScreen(...apply(m, 0, 1));
  const [ox, oy] = toScreen(0, 0);
  const [px, py] = toScreen(5, 2);
  const [tx, ty] = toScreen(3, 0);

  // pulse for emphasised arrows
  const pulse = (s: number, e: number) =>
    interpolate(frame, [sec(s), sec(s) + 10, sec(e) - 10, sec(e)], [0, 1, 1, 0.35], clamp);
  const iW = 7 + 5 * pulse(4.5, 7.5);
  const jW = 7 + 5 * pulse(7.94, 10.4);

  const aMat = appear(frame, 4.5);
  const col1 = appear(frame, 4.5);
  const col2 = appear(frame, 7.94);
  const a3i = appear(frame, 11.9);
  const a2j = appear(frame, 12.9);
  const aRes = appear(frame, 14.57);
  const aPt = appear(frame, 10.6);

  // matrix panel geometry
  const c1 = 195;
  const c2 = 345;
  const r1 = 440;
  const r2 = 530;

  // 2·ĵ arrow from (3,0) to (5,2)
  const jStart = toScreen(3, 0);

  return (
    <AbsoluteFill style={{ background: COLORS.bg }}>
      <Audio src={staticFile("audio/scene4.wav")} />
      <svg width={1920} height={1080}>
        <g opacity={0.25}>
          <Grid matrix={IDENTITY} />
        </g>
        <Grid matrix={m} />

        {/* new basis vectors */}
        <Arrow to={apply(m, 1, 0)} color={COLORS.ihat} width={iW} />
        <Arrow to={apply(m, 0, 1)} color={COLORS.jhat} width={jW} />
        {txt(ix + 14, iy + 62, "î", COLORS.ihat)}
        {txt(jx - 70, jy + 10, "ĵ", COLORS.jhat)}
        {txt(ix + 14, iy + 62, "", COLORS.ihat)}

        {/* intro: "track where î and ĵ land" */}
        {txt(960, 1030, "track where î and ĵ land", COLORS.text, 44,
          interpolate(frame, [sec(1.3), sec(1.3) + 12, sec(3.96), sec(3.96) + 12], [0, 1, 1, 0], clamp), "middle")}

        {/* matrix */}
        <g opacity={aMat}>
          <rect x={40} y={340} width={440} height={260} rx={20} fill="#121b3a" stroke={COLORS.grid} strokeWidth={2} />
          <rect x={c1 - 55} y={r1 - 62} width={110} height={170} rx={14} fill={COLORS.ihat} opacity={0.18 * col1} />
          <rect x={c2 - 55} y={r1 - 62} width={110} height={170} rx={14} fill={COLORS.jhat} opacity={0.18 * col2} />
          <text x={62} y={520} fill={COLORS.text} fontSize={190} fontFamily="Georgia, serif" opacity={0.7}>[</text>
          <text x={405} y={520} fill={COLORS.text} fontSize={190} fontFamily="Georgia, serif" opacity={0.7}>]</text>
          {[
            [c1, r1, "1", COLORS.ihat, col1],
            [c2, r1, "1", COLORS.jhat, col2],
            [c1, r2, "0", COLORS.ihat, col1],
            [c2, r2, "1", COLORS.jhat, col2],
          ].map(([x, y, s, color, o], k) => (
            <text key={k} x={x as number} y={y as number} fill={COLORS.text} fontSize={72}
              fontFamily="Georgia, serif" textAnchor="middle" opacity={0.55 + 0.45 * (o as number)}
              style={{ fill: (o as number) > 0.5 ? (color as string) : COLORS.text }}>
              {s as string}
            </text>
          ))}
        </g>
        {txt(c1, 645, "lands î", COLORS.ihat, 30, col1, "middle")}
        {txt(c2, 645, "lands ĵ", COLORS.jhat, 30, col2, "middle")}

        {/* point decomposition */}
        <line x1={ox} y1={oy} x2={tx} y2={ty} stroke={COLORS.ihat} strokeWidth={8}
          strokeDasharray="14 10" opacity={a3i} />
        {txt(tx - 100, ty + 135, "3 · î", COLORS.ihat, 52, a3i, "middle")}
        <g opacity={a2j}>
          <line x1={jStart[0]} y1={jStart[1]} x2={px} y2={py} stroke={COLORS.jhat} strokeWidth={8}
            strokeDasharray="14 10" />
        </g>
        {txt(px - 20, py + 150, "+ 2 · ĵ", COLORS.jhat, 52, a2j, "start")}
        <line x1={ox} y1={oy} x2={px} y2={py} stroke={COLORS.point} strokeWidth={5} opacity={aRes * 0.9} />

        <circle cx={ox} cy={oy} r={9} fill={COLORS.text} />
        <circle cx={px} cy={py} r={16} fill={COLORS.point} opacity={Math.max(aPt, 1 * (frame < sec(10.6) ? 1 : 1))} />
        {txt(px + 28, py - 14, "(5, 2)", COLORS.point, 52, aRes)}
      </svg>
    </AbsoluteFill>
  );
};
