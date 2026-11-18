"""Generate narration audio with Kokoro (ONNX) for the Remotion test clip.

Usage:
    python scripts/generate_tts.py [output_path]
"""

import sys
from pathlib import Path

import soundfile as sf
from kokoro_onnx import Kokoro

ROOT = Path(__file__).resolve().parent.parent
MODEL = ROOT / "models" / "kokoro-v1.0.int8.onnx"
VOICES = ROOT / "models" / "voices-v1.0.bin"
TEXT = "Hello, this is a test of the video and audio pipeline."

out = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / "public" / "test-audio.wav"
out.parent.mkdir(parents=True, exist_ok=True)

kokoro = Kokoro(str(MODEL), str(VOICES))
samples, sample_rate = kokoro.create(TEXT, voice="af_heart", speed=1.0, lang="en-us")
sf.write(out, samples, sample_rate)

print(f"Wrote {out} ({len(samples) / sample_rate:.2f}s @ {sample_rate} Hz)")
