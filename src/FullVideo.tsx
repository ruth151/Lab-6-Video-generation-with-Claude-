import React from "react";
import { Series } from "remotion";
import { Scene1Hook, SCENE1_DURATION } from "./scenes/Scene1Hook";
import { Scene2Basis, SCENE2_DURATION } from "./scenes/Scene2Basis";
import { Scene3Transform, SCENE3_DURATION } from "./scenes/Scene3Transform";
import { Scene4Columns, SCENE4_DURATION } from "./scenes/Scene4Columns";
import { Scene5Examples, SCENE5_DURATION } from "./scenes/Scene5Examples";
import { Scene6Determinant, SCENE6_DURATION } from "./scenes/Scene6Determinant";
import { Scene7Outro, SCENE7_DURATION } from "./scenes/Scene7Outro";

export const FULL_FPS = 30;

const SCENES: { C: React.FC; frames: number }[] = [
  { C: Scene1Hook, frames: SCENE1_DURATION },
  { C: Scene2Basis, frames: SCENE2_DURATION },
  { C: Scene3Transform, frames: SCENE3_DURATION },
  { C: Scene4Columns, frames: SCENE4_DURATION },
  { C: Scene5Examples, frames: SCENE5_DURATION },
  { C: Scene6Determinant, frames: SCENE6_DURATION },
  { C: Scene7Outro, frames: SCENE7_DURATION },
];

export const FULL_DURATION = SCENES.reduce((a, s) => a + s.frames, 0);

export const FullVideo: React.FC = () => (
  <Series>
    {SCENES.map(({ C, frames }, i) => (
      <Series.Sequence key={i} durationInFrames={frames}>
        <C />
      </Series.Sequence>
    ))}
  </Series>
);
