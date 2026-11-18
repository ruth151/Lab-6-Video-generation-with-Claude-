import React from "react";
import { AbsoluteFill } from "remotion";
import { COLORS } from "../lib/matrix";

export const SCENE5_FPS = 30;
export const SCENE5_DURATION = Math.round(16 * SCENE5_FPS);

export const Scene5Examples: React.FC = () => <AbsoluteFill style={{ background: COLORS.bg }} />;
