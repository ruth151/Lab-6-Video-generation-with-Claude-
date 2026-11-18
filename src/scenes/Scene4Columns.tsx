import React from "react";
import { AbsoluteFill } from "remotion";
import { COLORS } from "../lib/matrix";

export const SCENE4_FPS = 30;
export const SCENE4_DURATION = Math.round(17 * SCENE4_FPS);

export const Scene4Columns: React.FC = () => <AbsoluteFill style={{ background: COLORS.bg }} />;
