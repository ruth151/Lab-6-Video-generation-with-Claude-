import { Audio } from "@remotion/media";
import {
  AbsoluteFill,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const TEST_CLIP_FPS = 30;
export const TEST_CLIP_SECONDS = 5;
export const TEST_CLIP_DURATION = TEST_CLIP_FPS * TEST_CLIP_SECONDS; // 150 frames

export const TestClip: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const scale = spring({ frame, fps, config: { damping: 200 } });
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 15, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const seconds = (frame / fps).toFixed(1);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0f172a",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "sans-serif",
        color: "white",
        opacity: fadeOut,
      }}
    >
      <Audio src={staticFile("test-audio.wav")} />
      <div
        style={{
          fontSize: 180,
          fontWeight: 800,
          transform: `scale(${scale})`,
        }}
      >
        Test Clip
      </div>
      <div style={{ fontSize: 48, marginTop: 40, color: "#94a3b8" }}>
        {seconds}s / {TEST_CLIP_SECONDS}.0s
      </div>
    </AbsoluteFill>
  );
};
