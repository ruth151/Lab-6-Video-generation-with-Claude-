import { Audio } from "@remotion/media";
import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  staticFile,
} from "remotion";
import { Arrow, Grid, toScreen } from "../lib/Grid";
import { COLORS, IDENTITY } from "../lib/matrix";

export const SCENE2_FPS = 30;
export const SCENE2_DURATION = Math.ceil((13.08 + 1) * SCENE2_FPS); // narration 13.08 s + tail

const fade = (frame: number, start: number, len = 15) =>
  interpolate(frame, [start, start + len], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const label = (x: number, y: number, text: string, color: string, size = 56) => (
  <text x={x} y={y} fill={color} fontSize={size} fontFamily="Georgia, serif" fontStyle="italic">
    {text}
  </text>
);

export const Scene2Basis: React.FC = () => {
  const frame = useCurrentFrame();
  const [ix, iy] = toScreen(1, 0);
  const [jx, jy] = toScreen(0, 1);
  const [px, py] = toScreen(3, 2);
  const [ox, oy] = toScreen(0, 0);
  const [x3, y3] = toScreen(3, 0);

  return (
    <>
      <AbsoluteFill style={{ background: COLORS.bg }}>
      <Audio src={staticFile("audio/scene2.wav")} />
        <svg width={1920} height={1080}>
          <Grid matrix={IDENTITY} />
      
          {/* i-hat */}
          <g opacity={fade(frame, 168)}>
            <Arrow to={[1, 0]} color={COLORS.ihat} />
            {label(ix - 30, iy - 25, "î", COLORS.ihat)}
          </g>
          {/* j-hat */}
          <g opacity={fade(frame, 232)}>
            <Arrow to={[0, 1]} color={COLORS.jhat} />
            {label(jx - 55, jy + 10, "ĵ", COLORS.jhat)}
          </g>
      
          {/* 3 steps along i-hat, then 2 along j-hat */}
          <g opacity={fade(frame, 322)}>
            <line x1={ox} y1={oy} x2={x3} y2={y3} stroke={COLORS.ihat} strokeWidth={7} strokeDasharray="14 10" />
            {label((ox + x3) / 2 - 50, oy + 80, "3 × î", COLORS.ihat, 48)}
          </g>
          <g opacity={fade(frame, 372)}>
            <line x1={x3} y1={y3} x2={px} y2={py} stroke={COLORS.jhat} strokeWidth={7} strokeDasharray="14 10" />
            {label(x3 + 25, (y3 + py) / 2, "2 × ĵ", COLORS.jhat, 48)}
          </g>
          <g opacity={fade(frame, 268)}>
            <circle cx={px} cy={py} r={16} fill={COLORS.point} />
            {label(px + 28, py - 14, "(3, 2)", COLORS.point, 52)}
          </g>
        </svg>
      </AbsoluteFill>
    </>
  );
};
