import React from "react";
import { AbsoluteFill } from "remotion";
import { COLORS } from "../lib/matrix";

export const SCENE6_FPS = 30;
export const SCENE6_DURATION = Math.round(14 * SCENE6_FPS);

export const Scene6Determinant: React.FC = () => <AbsoluteFill style={{ background: COLORS.bg }} />;
