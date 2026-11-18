import React from "react";
import { AbsoluteFill } from "remotion";
import { COLORS } from "../lib/matrix";

export const SCENE3_FPS = 30;
export const SCENE3_DURATION = 13 * SCENE3_FPS;

export const Scene3Transform: React.FC = () => <AbsoluteFill style={{ background: COLORS.bg }} />;
