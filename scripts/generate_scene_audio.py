"""Generate one narration WAV per scene with Kokoro (af_heart, en-us).

Reads scripts/narration.json ({"scene1": "text", ...}) and writes
public/audio/<key>.wav, printing each duration.

Usage:
    python scripts/generate_scene_audio.py            # all scenes
    python scripts/generate_scene_audio.py 2 3 4      # only these scenes
"""

import json
import sys
from pathlib import Path

import soundfile as sf
from kokoro_onnx import Kokoro

ROOT = Path(__file__).resolve().parent.parent
MODEL = ROOT / "models" / "kokoro-v1.0.int8.onnx"
VOICES = ROOT / "models" / "voices-v1.0.bin"
NARRATION = ROOT / "scripts" / "narration.json"
OUT_DIR = ROOT / "public" / "audio"
VOICE = "hm_omega"  # Hindi male voice reading English text, for a distinctive accent

narration = json.loads(NARRATION.read_text(encoding="utf-8"))
keys = [f"scene{n}" for n in sys.argv[1:]] or list(narration)

OUT_DIR.mkdir(parents=True, exist_ok=True)
kokoro = Kokoro(str(MODEL), str(VOICES))

for key in keys:
    samples, rate = kokoro.create(narration[key], voice=VOICE, speed=1.0, lang="en-us")
    out = OUT_DIR / f"{key}.wav"
    sf.write(out, samples, rate)
    print(f"{out.name}: {len(samples) / rate:.2f}s")
