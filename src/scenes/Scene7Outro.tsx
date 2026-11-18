import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, staticFile, Easing, interpolate, useCurrentFrame } from "remotion";
import { Arrow, Grid, toScreen } from "../lib/Grid";
import { COLORS, IDENTITY, Mat, apply, lerpMat } from "../lib/matrix";

export const SCENE7_FPS = 30;
export const SCENE7_DURATION = Math.ceil((8.75 + 1.5) * SCENE7_FPS); // narration 8.75 s + tail

const FINAL: Mat = [1, 1, 0, 1];
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const FONT = "Georgia, serif";

export const Scene7Outro: React.FC = () => {
  const frame = useCurrentFrame();

  // grid + arrows land at "Where do the two basis arrows land?" (4.11 s = frame 123)
  const t = interpolate(frame, [123, 180], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const m = lerpMat(IDENTITY, FINAL, t);
  const gridIn = interpolate(frame, [115, 135], [0, 1], clamp);
  const arrowsIn = interpolate(frame, [120, 135], [0, 1], clamp);

  const boxIn = interpolate(frame, [8, 36], [0, 1], clamp);
  const colorT = interpolate(frame, [87, 105], [0, 1], clamp); // "It's a recipe."
  const textIn = interpolate(frame, [192, 220], [0, 1], clamp);

  const mix = (c: string) => (colorT > 0.5 ? c : COLORS.text);
  const entries: [string, string, number, number, string][] = [
    ["a", "", 0, 0, COLORS.ihat],
    ["c", "", 0, 1, COLORS.ihat],
    ["b", "", 1, 0, COLORS.jhat],
    ["d", "", 1, 1, COLORS.jhat],
  ];

  const bx = 120, by = 390, bw = 400, bh = 300;
  const [ix, iy] = toScreen(...apply(m, 1, 0));
  const [jx, jy] = toScreen(...apply(m, 0, 1));

  return (
    <AbsoluteFill style={{ background: COLORS.bg }}>
      <Audio src={staticFile("audio/scene7.wav")} />
      <svg width={1920} height={1080}>
        <g opacity={gridIn}>
          <g opacity={0.25}>
            <Grid matrix={IDENTITY} />
          </g>
          <Grid matrix={m} />
        </g>
        <g opacity={arrowsIn}>
          <Arrow to={apply(m, 1, 0)} color={COLORS.ihat} />
          <Arrow to={apply(m, 0, 1)} color={COLORS.jhat} />
          <text x={ix + 8} y={iy + 60} fill={COLORS.ihat} fontSize={56} fontFamily={FONT} fontStyle="italic">î</text>
          <text x={jx - 70} y={jy + 10} fill={COLORS.jhat} fontSize={56} fontFamily={FONT} fontStyle="italic">ĵ</text>
        </g>

        {/* matrix panel */}
        <g opacity={boxIn}>
          <rect x={bx - 40} y={by - 60} width={bw + 80} height={bh + 120} rx={24} fill={COLORS.bg} />
          {/* brackets */}
          <path d={`M ${bx + 30} ${by} H ${bx} V ${by + bh} H ${bx + 30}`} fill="none" stroke={COLORS.text} strokeWidth={6} />
          <path d={`M ${bx + bw - 30} ${by} H ${bx + bw} V ${by + bh} H ${bx + bw - 30}`} fill="none" stroke={COLORS.text} strokeWidth={6} />
          {entries.map(([s, , col, row, c]) => (
            <text
              key={s}
              x={bx + 110 + col * 180}
              y={by + 105 + row * 120}
              textAnchor="middle"
              fill={mix(c)}
              fontSize={96}
              fontFamily={FONT}
              fontStyle="italic"
            >
              {s}
            </text>
          ))}
          <text x={bx + 110} y={by + bh + 50} textAnchor="middle" fill={COLORS.ihat} fontSize={40} fontFamily={FONT} opacity={colorT}>
            where î lands
          </text>
          <text x={bx + 290} y={by - 20} textAnchor="middle" fill={COLORS.jhat} fontSize={40} fontFamily={FONT} opacity={colorT}>
            where ĵ lands
          </text>
        </g>

        {/* closing line */}
        <g opacity={textIn}>
          <rect x={360} y={920} width={1200} height={110} rx={20} fill={COLORS.bg} />
          <text x={960} y={993} textAnchor="middle" fill={COLORS.text} fontSize={64} fontFamily={FONT}>
            A matrix = where{" "}
            <tspan fill={COLORS.ihat} fontStyle="italic">î</tspan> and{" "}
            <tspan fill={COLORS.jhat} fontStyle="italic">ĵ</tspan> land
          </text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
