import React from "react";
import { AbsoluteFill } from "remotion";
import { COLORS } from "../lib/matrix";

export const SCENE7_FPS = 30;
export const SCENE7_DURATION = Math.round(9.5 * SCENE7_FPS);

export const Scene7Outro: React.FC = () => <AbsoluteFill style={{ background: COLORS.bg }} />;
