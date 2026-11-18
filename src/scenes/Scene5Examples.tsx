import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, staticFile, Easing, interpolate, useCurrentFrame } from "remotion";
import { COLORS, IDENTITY, Mat, lerpMat } from "../lib/matrix";

export const SCENE5_FPS = 30;
export const SCENE5_DURATION = Math.ceil((14.72 + 1) * SCENE5_FPS);

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

type Sprite = { rows: string[]; colors: Record<string, string> };

const SHIP: Sprite = {
  rows: [
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
  ],
  colors: { W: "#e8ecf8", B: "#5bc0ff", R: "#ff6b6b", Y: "#ffd166" },
};
const MUSHROOM: Sprite = {
  rows: [
    "....RRRRR....",
    "..RRRWWWRRR..",
    ".RRWWWRRRWWR.",
    "RRRWWWRRRWWRR",
    "RRRRRRRRRRRRR",
    "RWWRRRRRRRWWR",
    ".....SSS.....",
    "....SSSSS....",
    "....SSSSS....",
    "....SSSSS....",
    ".....SSS.....",
  ],
  colors: { R: "#ff6b6b", W: "#e8ecf8", S: "#ffe3b0" },
};
const HERO: Sprite = {
  rows: [
    "...HHHHH...",
    "..HHHHHHH..",
    "..HSSSSSG..",
    "..HSESSSG..",
    "..SSSSSSS..",
    "...SSMSS...",
    "..BBBBBBB..",
    ".SBBBBBBBS.",
    ".SBBYYYBBS.",
    "..BBBBBBB..",
    "..PP...PP..",
    "..PP...PP..",
    ".KKK...KKK.",
  ],
  colors: { H: "#8a5a2b", S: "#ffd0a0", G: "#ffd0a0", E: "#0b1226", M: "#c0504d", B: "#5bc0ff", Y: "#ffd166", P: "#3b4a8a", K: "#e8ecf8" },
};
const TREE: Sprite = {
  rows: [
    "....GGG....",
    "..GGGGGGG..",
    ".GGLGGGLGG.",
    "GGGGGGGGGGG",
    "GGLGGGGGLGG",
    ".GGGGGGGGG.",
    "..GGGLGGG..",
    "....TTT....",
    "....TTT....",
    "....TTT....",
    "....TTT....",
    "..DDTTTDD..",
  ],
  colors: { G: "#2fa84f", L: "#5bd68a", T: "#8a5a2b", D: "#3d8f3d" },
};

const PX = 11;
const UNIT = 44; // px per grid unit inside a panel
const PW = 400;
const PH = 400;

const SpriteArt: React.FC<{ s: Sprite }> = ({ s }) => {
  const w = s.rows[0].length * PX;
  const h = s.rows.length * PX;
  return (
    <>
      {s.rows.flatMap((row, r) =>
        row.split("").map((c, i) =>
          c === "." ? null : (
            <rect key={`${r}-${i}`} x={i * PX - w / 2} y={r * PX - h / 2} width={PX + 0.5} height={PX + 0.5} fill={s.colors[c]} />
          ),
        ),
      )}
    </>
  );
};

const c40 = Math.cos((40 * Math.PI) / 180);
const s40 = Math.sin((40 * Math.PI) / 180);

type PanelDef = {
  name: string;
  game: string;
  sprite: Sprite;
  m: Mat;
  entries: [string, string, string, string];
  start: number; // seconds, panel appears
  go: number; // seconds, animation starts
};

const PANELS: PanelDef[] = [
  { name: "Rotation", game: "character turning / aiming", sprite: SHIP, m: [c40, -s40, s40, c40], entries: ["cos θ", "−sin θ", "sin θ", "cos θ"], start: 3.09, go: 3.3 },
  { name: "Scale", game: "power-up grows", sprite: MUSHROOM, m: [1.8, 0, 0, 1.8], entries: ["2", "0", "0", "2"], start: 5.15, go: 5.35 },
  { name: "Flip", game: "facing left or right", sprite: HERO, m: [-1, 0, 0, 1], entries: ["−1", "0", "0", "1"], start: 7.26, go: 7.55 },
  { name: "Shear", game: "grass swaying in the wind", sprite: TREE, m: [1, 0.6, 0, 1], entries: ["1", "0.5", "0", "1"], start: 9.73, go: 10.65 },
];

const Panel: React.FC<{ def: PanelDef; x: number; frame: number }> = ({ def, x, frame }) => {
  const fps = SCENE5_FPS;
  const appear = interpolate(frame, [def.start * fps, def.start * fps + 12], [0, 1], clamp);
  const t = interpolate(frame, [def.go * fps, def.go * fps + 40], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const m = lerpMat(IDENTITY, def.m, t);
  // math (y up) -> SVG matrix(a, b, c, d): [m0, -m2, -m1, m3]
  const tf = `matrix(${m[0]} ${-m[2]} ${-m[1]} ${m[3]} 0 0)`;
  const lines: React.ReactNode[] = [];
  for (let i = -12; i <= 12; i++) {
    const axis = i === 0;
    const p = { stroke: axis ? COLORS.axis : COLORS.grid, strokeWidth: axis ? 2.5 : 1.2, vectorEffect: "non-scaling-stroke" as const };
    lines.push(<line key={`v${i}`} x1={i * UNIT} y1={-12 * UNIT} x2={i * UNIT} y2={12 * UNIT} {...p} />);
    lines.push(<line key={`h${i}`} x1={-12 * UNIT} y1={i * UNIT} x2={12 * UNIT} y2={i * UNIT} {...p} />);
  }
  const isRot = def.name === "Rotation";
  const cellStyle: React.CSSProperties = { textAlign: "center", minWidth: 110 };
  return (
    <div style={{ position: "absolute", left: x, top: 190, width: PW, opacity: appear, transform: `translateY(${(1 - appear) * 20}px)` }}>
      <div style={{ textAlign: "center", fontSize: 50, color: COLORS.point, fontFamily: "Georgia, serif", height: 64 }}>{def.name}</div>
      <svg width={PW} height={PH} style={{ border: `3px solid ${COLORS.axis}`, borderRadius: 16, background: "#0e1733", display: "block" }}>
        <defs>
          <clipPath id={`clip-${def.name}`}>
            <rect width={PW} height={PH} rx={14} />
          </clipPath>
        </defs>
        <g clipPath={`url(#clip-${def.name})`}>
          <g transform={`translate(${PW / 2} ${PH / 2})`}>
            <g transform={tf}>
              {lines}
              <SpriteArt s={def.sprite} />
            </g>
          </g>
        </g>
      </svg>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: 22, fontFamily: "Georgia, serif", color: COLORS.text }}>
        <div style={{ fontSize: 110, fontWeight: 100, lineHeight: 1, marginRight: 6 }}>[</div>
        <div style={{ display: "grid", gridTemplateColumns: "auto auto", gap: "6px 22px", fontSize: isRot ? 40 : 46, fontStyle: "italic" }}>
          {def.entries.map((e, i) => (
            <div key={i} style={cellStyle}>{e}</div>
          ))}
        </div>
        <div style={{ fontSize: 110, fontWeight: 100, lineHeight: 1, marginLeft: 6 }}>]</div>
      </div>
      <div style={{ textAlign: "center", marginTop: 14, fontSize: 31, whiteSpace: "nowrap", color: COLORS.ihat, fontFamily: "Georgia, serif" }}>{def.game}</div>
    </div>
  );
};

export const Scene5Examples: React.FC = () => {
  const frame = useCurrentFrame();
  const title = interpolate(frame, [0, 20], [0, 1], clamp);
  const gap = 40;
  const left = (1920 - (4 * PW + 3 * gap)) / 2;
  return (
    <AbsoluteFill style={{ background: COLORS.bg }}>
      <Audio src={staticFile("audio/scene5.wav")} />
      <div style={{ position: "absolute", top: 50, width: "100%", textAlign: "center", fontSize: 64, color: COLORS.text, fontFamily: "Georgia, serif", opacity: title }}>
        Change the four numbers, get a different effect
      </div>
      {PANELS.map((p, i) => (
        <Panel key={p.name} def={p} x={left + i * (PW + gap)} frame={frame} />
      ))}
      <div style={{ position: "absolute", bottom: 50, width: "100%", textAlign: "center", fontSize: 48, color: COLORS.text, fontFamily: "Georgia, serif", fontStyle: "italic", opacity: interpolate(frame, [12.75 * 30, 12.75 * 30 + 15], [0, 1], clamp) }}>
        Same idea, different columns.
      </div>
    </AbsoluteFill>
  );
};
