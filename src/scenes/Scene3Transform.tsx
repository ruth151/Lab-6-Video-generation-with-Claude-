import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, staticFile, Easing, interpolate, useCurrentFrame } from "remotion";
import { Arrow, Grid, toScreen } from "../lib/Grid";
import { COLORS, IDENTITY, Mat, apply, lerpMat } from "../lib/matrix";

export const SCENE3_FPS = 30;
export const SCENE3_DURATION = Math.ceil(13.76 * SCENE3_FPS); // narration 12.76 s + tail

const SHEAR: Mat = [1, 1, 0, 1];

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const fade = (frame: number, start: number, end: number, len = 15) =>
  interpolate(frame, [start, start + len, end - len, end], [0, 1, 1, 0], clamp);

const label = (x: number, y: number, text: string, color: string, size = 56) => (
  <text x={x} y={y} fill={color} fontSize={size} fontFamily="Georgia, serif" fontStyle="italic">
    {text}
  </text>
);

const caption = (text: string, opacity: number) => (
  <text
    x={960}
    y={1030}
    textAnchor="middle"
    fill={COLORS.text}
    fontSize={44}
    fontFamily="Georgia, serif"
    opacity={opacity}
  >
    {text}
  </text>
);

export const Scene3Transform: React.FC = () => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [63, 365], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const m = lerpMat(IDENTITY, SHEAR, t);

  const [ix, iy] = toScreen(...apply(m, 1, 0));
  const [jx, jy] = toScreen(...apply(m, 0, 1));
  const [px, py] = toScreen(...apply(m, 3, 2));
  const [ox, oy] = toScreen(0, 0);
  const [gx, gy] = toScreen(3, 2);

  return (
    <AbsoluteFill style={{ background: COLORS.bg }}>
      <Audio src={staticFile("audio/scene3.wav")} />
      <svg width={1920} height={1080}>
        <g opacity={0.25}>
          <Grid matrix={IDENTITY} />
        </g>
        <Grid matrix={m} />

        {/* ghost of the original point */}
        <circle cx={gx} cy={gy} r={12} fill="none" stroke={COLORS.point} strokeWidth={3} opacity={0.4 * t} />

        <Arrow to={apply(m, 1, 0)} color={COLORS.ihat} />
        {label(ix + 8, iy + 60, "î", COLORS.ihat)}
        <Arrow to={apply(m, 0, 1)} color={COLORS.jhat} />
        {label(jx - 70, jy + 10, "ĵ", COLORS.jhat)}

        <circle cx={ox} cy={oy} r={9} fill={COLORS.text} />
        <circle cx={px} cy={py} r={16} fill={COLORS.point} />
        {label(px + 28, py - 14, t > 0.98 ? "(5, 2)" : "(3, 2)", COLORS.point, 52)}

        {caption("origin stays fixed", fade(frame, 147, 187))}
        {caption("grid lines stay straight and evenly spaced", fade(frame, 200, 273))}
      </svg>
    </AbsoluteFill>
  );
};
