import { Audio } from "@remotion/media";
import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
} from "remotion";
import { Grid, toScreen } from "../lib/Grid";
import { COLORS, IDENTITY, Mat, lerpMat } from "../lib/matrix";

export const SCENE1_FPS = 30;
export const SCENE1_DURATION = Math.ceil((11.05 + 1) * SCENE1_FPS);

const fade = (frame: number, start: number, len = 15) =>
  interpolate(frame, [start, start + len], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

// Pixel-art ship, nose up. Legend: W white hull, B blue, R red, Y yellow flame.
const SHIP = [
  "......W......",
  "......W......",
  ".....WWW.....",
  ".....WBW.....",
  ".....WBW.....",
  "....WWBWW....",
  "..R.WWWWW.R..",
  ".RR.WWWWW.RR.",
  "RRRWWWWWWWRRR",
  "RR.W.WWW.W.RR",
  "R..W..Y..W..R",
  ".....YYY.....",
  "......Y......",
];
const PX = 12;
const SHIP_COLORS: Record<string, string> = {
  W: "#e8ecf8",
  B: "#5bc0ff",
  R: "#ff6b6b",
  Y: "#ffd166",
};

const Ship: React.FC<{ x: number; y: number; deg: number }> = ({ x, y, deg }) => {
  const w = SHIP[0].length * PX;
  const h = SHIP.length * PX;
  return (
    <g transform={`translate(${x} ${y}) rotate(${-deg})`}>
      {SHIP.flatMap((row, r) =>
        row.split("").map((c, i) =>
          c === "." ? null : (
            <rect key={`${r}-${i}`} x={i * PX - w / 2} y={r * PX - h / 2} width={PX} height={PX} fill={SHIP_COLORS[c]} />
          ),
        ),
      )}
    </g>
  );
};

const THETA = 40; // degrees

export const Scene1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const shipTurn = spring({ frame: frame - 45, fps, config: { damping: 18 } });
  const gridTurn = spring({ frame: frame - 95, fps, config: { damping: 22, mass: 1.4 } });
  const th = (THETA * Math.PI) / 180;
  const c = Math.cos(th);
  const s = Math.sin(th);
  const R: Mat = [c, -s, s, c];
  const matrix = lerpMat(IDENTITY, R, gridTurn);

  // ship sits at math (2, 1); the grid matrix carries it along
  const [m0, m1] = [matrix[0] * 2 + matrix[1] * 1, matrix[2] * 2 + matrix[3] * 1];
  const [sx, sy] = toScreen(m0, m1);
  const shipDeg = THETA * shipTurn + THETA * gridTurn;

  const keyPress = interpolate(frame, [28, 34, 44], [0, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const keyOpacity = fade(frame, 8) * (1 - fade(frame, 66));
  const matOpacity = fade(frame, 246, 30);
  const qIn = fade(frame, 186, 10);
  const qOpacity = qIn * (1 - fade(frame, 228, 10));
  const qScale = 0.7 + 0.3 * spring({ frame: frame - 186, fps, config: { damping: 10 } });
  const f = (v: number) => v.toFixed(2).replace("-0.00", "0.00");
  const matCells = [f(c), f(-s), f(s), f(c)];
  const caption = fade(frame, 100, 15) * (1 - fade(frame, 168, 12));

  return (
    <>
      <AbsoluteFill style={{ background: COLORS.bg }}>
        <svg width={1920} height={1080}>
          <Grid matrix={matrix} />
          <g opacity={fade(frame, 0, 25)}>
            <Ship x={sx} y={sy} deg={shipDeg} />
          </g>
      
          {/* ROTATE key prompt */}
          <g opacity={keyOpacity} transform={`translate(260 ${900 + keyPress * 6})`}>
            <rect x={0} y={0} width={330} height={100} rx={18} fill={keyPress > 0.5 ? COLORS.point : "#1b2750"} stroke={COLORS.axis} strokeWidth={4} />
            <text x={165} y={66} textAnchor="middle" fontSize={50} fontWeight={700} fontFamily="Consolas, monospace" fill={keyPress > 0.5 ? COLORS.bg : COLORS.text}>
              ROTATE
            </text>
          </g>
      
          <g opacity={caption}>
            <text x={960} y={110} textAnchor="middle" fontSize={56} fontFamily="Georgia, serif" fontStyle="italic" fill={COLORS.text}>
              the whole grid turns, not just the ship
            </text>
          </g>
      
          <g opacity={qOpacity} transform={`translate(960 230) scale(${qScale})`}>
            <text x={0} y={0} textAnchor="middle" fontSize={200} fontWeight={700} fontFamily="Georgia, serif" fill={COLORS.point}>
              ?
            </text>
          </g>

          {/* matrix hint */}
          <g opacity={matOpacity} transform="translate(1330 780)">
            <rect x={-40} y={-20} width={470} height={260} rx={24} fill={COLORS.bg} stroke={COLORS.grid} strokeWidth={3} />
            <path d="M 20 0 H 0 V 220 H 20" fill="none" stroke={COLORS.text} strokeWidth={5} />
            <path d="M 350 0 H 370 V 220 H 350" fill="none" stroke={COLORS.text} strokeWidth={5} />
            {matCells.map((t, i) => (
              <text
                key={i}
                x={i % 2 === 0 ? 100 : 270}
                y={i < 2 ? 85 : 185}
                textAnchor="middle"
                fontSize={60}
                fontFamily="Georgia, serif"
                fill={i % 2 === 0 ? COLORS.ihat : COLORS.jhat}
              >
                {t}
              </text>
            ))}
          </g>
        </svg>
      </AbsoluteFill>
      <Audio src={staticFile("audio/scene1.wav")} />
    </>
  );
};
