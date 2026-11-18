import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, staticFile, Easing, interpolate, useCurrentFrame } from "remotion";
import { Arrow, Grid, toScreen } from "../lib/Grid";
import { COLORS, IDENTITY, Mat, apply, lerpMat } from "../lib/matrix";

export const SCENE6_FPS = 30;
export const SCENE6_DURATION = Math.ceil((13.16 + 1) * SCENE6_FPS);

const STRETCH: Mat = [2, 0, 0, 1];
const SQUASH: Mat = [1, 2, 0.5, 1];

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const sec = (s: number) => Math.round(s * SCENE6_FPS);
const appear = (frame: number, at: number) => interpolate(frame, [at, at + 12], [0, 1], clamp);

const txt = (
  x: number,
  y: number,
  text: string,
  color: string,
  size: number,
  opacity = 1,
  anchor: "start" | "middle" | "end" = "start",
  italic = false,
) => (
  <text
    x={x}
    y={y}
    fill={color}
    fontSize={size}
    fontFamily="Georgia, serif"
    fontStyle={italic ? "italic" : "normal"}
    textAnchor={anchor}
    opacity={opacity}
    stroke={COLORS.bg}
    strokeWidth={10}
    paintOrder="stroke"
  >
    {text}
  </text>
);

export const Scene6Determinant: React.FC = () => {
  const frame = useCurrentFrame();
  const ease = Easing.inOut(Easing.cubic);
  const t1 = interpolate(frame, [sec(3.04), sec(5.1)], [0, 1], { ...clamp, easing: ease });
  const t2 = interpolate(frame, [sec(6.9), sec(8.5)], [0, 1], { ...clamp, easing: ease });
  const m = t2 > 0 ? lerpMat(STRETCH, SQUASH, t2) : lerpMat(IDENTITY, STRETCH, t1);

  const det = m[0] * m[3] - m[1] * m[2];
  const pts = [apply(m, 0, 0), apply(m, 1, 0), apply(m, 1, 1), apply(m, 0, 1)]
    .map(([x, y]) => toScreen(x, y).join(","))
    .join(" ");
  const [ix, iy] = toScreen(...apply(m, 1, 0));
  const [jx, jy] = toScreen(...apply(m, 0, 1));

  const detOp = appear(frame, sec(5.6));
  const zeroOp = appear(frame, sec(8.5));
  const undoOp = appear(frame, sec(10.8));
  const stretchPhase = frame < sec(6.85);
  const arrowLabel = frame < sec(5.1) ? `area  1 → ${Math.abs(det) < 1.005 ? "1" : det.toFixed(1)}` : "area  1 → 2";

  return (
    <AbsoluteFill style={{ background: COLORS.bg }}>
      <Audio src={staticFile("audio/scene6.wav")} />
      <svg width={1920} height={1080}>
        <g opacity={0.25}>
          <Grid matrix={IDENTITY} />
        </g>
        <Grid matrix={m} />
        <polygon points={pts} fill={COLORS.point} fillOpacity={0.35} stroke={COLORS.point} strokeWidth={3} />

        <Arrow to={apply(m, 1, 0)} color={COLORS.ihat} />
        <Arrow to={apply(m, 0, 1)} color={COLORS.jhat} />
        {txt(ix + 14, iy + 62, "î", COLORS.ihat, 54, 1, "start", true)}
        {txt(jx - 70, jy - 4, "ĵ", COLORS.jhat, 54, 1, "start", true)}

        {txt(960, 130, "The determinant", COLORS.text, 76, appear(frame, 4), "middle")}
        {txt(960, 215, "how much the area changes", COLORS.axis, 46, appear(frame, sec(1.96)), "middle")}

        {/* stretch phase */}
        {stretchPhase && txt(120, 420, frame < sec(3.04) ? "area = 1" : arrowLabel, COLORS.point, 60, appear(frame, sec(2.61)))}
        {stretchPhase && txt(120, 520, "det = 2", COLORS.text, 84, detOp)}

        {/* squash phase */}
        {!stretchPhase && txt(120, 420, `area = ${Math.abs(det) < 0.05 ? "0" : Math.abs(det).toFixed(1)}`, COLORS.point, 60, 1)}
        {!stretchPhase && txt(120, 520, "det = 0", COLORS.jhat, 84, zeroOp)}
        {!stretchPhase && txt(120, 600, "flattened onto a line", COLORS.axis, 44, zeroOp)}
        {txt(960, 1020, "can't be undone", COLORS.text, 64, undoOp, "middle")}
      </svg>
    </AbsoluteFill>
  );
};
