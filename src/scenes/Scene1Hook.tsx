import React from "react";
import { AbsoluteFill } from "remotion";
import { COLORS } from "../lib/matrix";

export const SCENE1_FPS = 30;
export const SCENE1_DURATION = 13 * SCENE1_FPS;

export const Scene1Hook: React.FC = () => <AbsoluteFill style={{ background: COLORS.bg }} />;
