# How a 2×2 Matrix Transforms 2D Space

A ~98-second narrated explainer video, built entirely in code with [Remotion](https://www.remotion.dev/) (React) and offline text-to-speech ([Kokoro](https://github.com/thewh1teagle/kokoro-onnx)). It was made in a 90-minute lab on building with AI coding agents.

**Takeaway:** a 2×2 matrix is a recipe that says where the two basis vectors land, and every other point in the plane moves along with them.

## What the video covers

| # | Scene | Idea |
|---|---|---|
| 1 | Hook | A game character turns, and the whole grid turns with it |
| 2 | Basis | Every point is built from î and ĵ |
| 3 | Transformation | The grid shears; the origin stays fixed and grid lines stay straight |
| 4 | Columns | The matrix columns are where î and ĵ land |
| 5 | Game examples | Rotation, scale, flip and shear in pixel-art game sprites |
| 6 | Determinant | Area scaling, and what det = 0 means |
| 7 | Wrap-up | A matrix = where î and ĵ land |

The full script is in [`SCRIPT.md`](SCRIPT.md). All visuals are SVG drawn in code. No AI-generated images are used.

## Tech stack

- **Remotion 4** + React 19 + TypeScript for the animation (one file per scene)
- **Kokoro (kokoro-onnx)** for free, local narration (voice `hm_omega`)
- **ffmpeg** for encoding
- **Claude Code** wrote most of the code, including parallel sub-agents that built and retimed one scene each

## Requirements

- Node.js 20.19+ (or 22.13+ / 24+) and npm
- ffmpeg (`sudo apt install ffmpeg` or `brew install ffmpeg`)
- Python 3.10+ (only to regenerate the narration)
- On Linux/WSL, the libraries Chrome needs: `sudo apt install libnss3 libnspr4 libxss1 libasound2t64`

## Run it

```bash
npm install
npx remotion studio                       # live preview at http://localhost:3000
npx remotion render FullVideo out/render-01.mp4
```

The narration WAVs are already in `public/audio/`, so the video renders without Python. Pick `FullVideo` in the Studio sidebar for the whole video, or a single `Scene…` composition to preview one scene.

### Regenerate the narration (optional)

```bash
python3 -m venv .venv && source .venv/bin/activate
pip install kokoro-onnx soundfile
mkdir -p models && cd models
curl -LO https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/kokoro-v1.0.int8.onnx
curl -LO https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/voices-v1.0.bin
cd ..
python scripts/generate_scene_audio.py     # all scenes, or: ... 2 3 4
```

Narration text lives in `scripts/narration.json`. Scene lengths are set from the audio durations, so after changing the text or voice, re-check the timing in each scene file.

## Project structure

```
src/
  FullVideo.tsx          all scenes in order
  Root.tsx               composition registry
  lib/
    matrix.ts            2×2 matrix helpers, interpolation, color palette
    Grid.tsx             grid and arrows drawn through any matrix
  scenes/
    Scene1Hook.tsx … Scene7Outro.tsx
public/audio/            per-scene narration (scene1.wav … scene7.wav)
scripts/                 Kokoro narration generator + narration.json
SCRIPT.md                scene-by-scene script
```

## Notes

- Built as a lab project: [`setup_report.md`](setup_report.md) documents the environment setup and a 5-second test clip.
- Kokoro model files (~120 MB) are not in the repo; the commands above download them.
