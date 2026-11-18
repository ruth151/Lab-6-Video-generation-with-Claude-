# Video Generation Pipeline — Setup Report

**Date:** 2026-11-18
**Environment:** WSL2 · Ubuntu 24.04.2 LTS · kernel 5.15.167.4-microsoft-standard-WSL2
**Result:** ✅ `output.mp4` rendered with narration, exactly 5.0 s of video (150 frames @ 30 fps).

---

## 1. Installed dependencies and tools

| | Component | Version | How it was installed / where it lives |
|---|---|---|---|
| ✅ | Node.js | v26.13.1 (LTS) | Official tarball from nodejs.org → `~/.local/node` (PATH added to `~/.bashrc`) |
| ✅ | npm / npx | 11.20.0 | Bundled with Node.js |
| ✅ | Remotion (`remotion`, `@remotion/cli`) | 4.0.544 | `npx create-video@latest --yes --hello-world .` |
| ✅ | `@remotion/media` (for `<Audio>`) | 4.0.544 | `npx remotion add @remotion/media` |
| ✅ | React / React DOM | 19.3.1 | Part of the Remotion template |
| ✅ | Chrome Headless Shell | (Remotion-managed) | Downloaded automatically by Remotion on first render → `node_modules/.remotion/` |
| ✅ | ffmpeg / ffprobe (system) | 6.1.1-3ubuntu5 | `sudo apt install ffmpeg` → `/usr/bin/ffmpeg`, `/usr/bin/ffprobe` |
| ✅ | ffmpeg / ffprobe (Remotion) | bundled | Inside `@remotion/compositor-linux-x64-gnu`; Remotion uses this one internally for encoding |
| ✅ | Browser libs: `libnss3` 3.98, `libnspr4` 4.35, `libxss1` 1.2.3, `libasound2t64` 1.2.11 | Ubuntu noble packages | `sudo apt install` (system-wide) |
| ✅ | `python3-venv` 3.12.3, `python3-pip` 24.0 | Ubuntu noble packages | `sudo apt install` (system-wide) |
| ✅ | Browser libs already present | — | `libatk1.0-0t64`, `libatk-bridge2.0-0t64`, `libgbm1`, `libcups2t64`, `libxkbcommon0`, `libxcomposite1`, `libxdamage1`, `libxrandr2`, `libpango-1.0-0`, `libcairo2`, `libdrm2`, `libxfixes3` |
| ✅ | Remotion agent skills | — | `npx skills add remotion-dev/skills` → `.agents/skills/` (symlinked for Claude Code) |
| ✅ | Python | 3.12.3 | System |
| ✅ | Python venv + pip 26.3 | — | `~/.local/kokoro-venv` (bootstrapped with `get-pip.py`) |
| ✅ | kokoro-onnx | 0.6.1 | `pip install kokoro-onnx soundfile` (pulls onnxruntime 1.32.0, numpy 2.5.5, espeak-ng via `espeakng-loader`) |
| ✅ | soundfile | 0.14.0 | pip |
| ✅ | Kokoro model files | v1.0 | `models/kokoro-v1.0.int8.onnx` (92.4 MB) + `models/voices-v1.0.bin` (28.2 MB) = **~115 MB** |

## 2. Exact commands

### Audio generation
```bash
~/.local/kokoro-venv/bin/python scripts/generate_tts.py
# -> Wrote public/test-audio.wav (3.26s @ 24000 Hz)
```
`scripts/generate_tts.py` loads Kokoro (`af_heart` voice, `en-us`) and synthesizes:
> "Hello, this is a test of the video and audio pipeline."

### Video rendering
```bash
export PATH="$HOME/.local/node/bin:$PATH"
npx remotion render TestClip output.mp4
```

### Composition
- `src/TestClip.tsx` — dark background, "Test Clip" title with a spring scale-in, a running `x.xs / 5.0s` timer, a fade-out over the last 15 frames, and `<Audio src={staticFile("test-audio.wav")} />`.
- `src/Root.tsx` — registers `TestClip` with `fps = 30`, `durationInFrames = 30 × 5 = 150`, 1920×1080.

### Verification
```bash
ffprobe -v error \
  -show_entries format=duration,size,bit_rate:stream=index,codec_type,codec_name,width,height,r_frame_rate,nb_frames,sample_rate,channels,duration \
  -of default=nw=1 output.mp4
ffmpeg -hide_banner -nostats -i output.mp4 -vn -af volumedetect -f null -
```

## 3. Verification results

| Check | Result |
|---|---|
| File exists | ✅ `output.mp4` |
| File size | ✅ **323,882 bytes (~324 KB)** |
| Container duration | ✅ **5.013 s** |
| Video stream | ✅ H.264, 1920×1080, 30 fps, **150 frames, 5.000 s** |
| Audio stream | ✅ AAC, 48 kHz stereo, 5.013 s (AAC frame padding adds 13 ms) |
| Narration present | ✅ `volumedetect`: mean −24.6 dB, max −7.1 dB. Decoded audio RMS per second: 0.094 · 0.064 · 0.063 · 0.006 · 0.000 — speech in the first ~3.3 s, then silence, matching the 3.26 s TTS clip |
| Visual check | ✅ Frame at 2.5 s shows "Test Clip" and "2.5s / 5.0s" |

## 4. Issues encountered and resolutions

> **Final state:** after the first render, the user ran the `sudo apt install` command in a WSL shell. The video was then rendered again **without** `LD_LIBRARY_PATH`, using only system libraries (`ldd` on Chrome: 0 missing libs). The output was the same: 323,882 bytes, 150 frames, 5.000 s video. The workarounds below are kept for the record.

1. **No passwordless `sudo`** — `sudo apt install …` needs an interactive password, which an autonomous agent can't supply.
   - *Node.js:* installed from the official nodejs.org tarball into `~/.local/node`.
   - *Browser libraries:* the 4 missing packages (`libnss3`, `libnspr4`, `libxss1`, `libasound2t64`) were fetched with `apt-get download` (no root needed), extracted with `dpkg-deb -x`, and exposed to Chrome via `LD_LIBRARY_PATH`. Without them, `ldd` on `chrome-headless-shell` reports `libnss3.so => not found`.
   - *ffmpeg:* not installed system-wide. Remotion 4 ships its own ffmpeg/ffprobe, so rendering and verification use `npx remotion ffmpeg` / `npx remotion ffprobe`. (A static ffmpeg download from GitHub was blocked by the agent's permission policy, so the Remotion-bundled binaries were used instead.)
   - **Resolved properly afterwards:** the user ran this in an interactive WSL shell:
     ```bash
     sudo apt update && sudo apt install -y ffmpeg libnss3 libnspr4 libxss1 libasound2t64 python3-venv python3-pip
     ```
     `LD_LIBRARY_PATH` is no longer needed.
   - *Gotcha:* running this through Claude Code's `!` prefix fails (`sudo: a terminal is required to read the password`) because there is no TTY. Running it in Windows PowerShell also fails: there, `sudo` is Windows' own sudo (*"Sudo is disabled on this machine"*). It has to run inside the Ubuntu shell (type `wsl` first).
2. **`python3-venv` / `pip` not installed** — `python3 -m venv` failed (no `ensurepip`). Fixed by creating the venv with `--without-pip` and bootstrapping pip with the official `get-pip.py`.
3. **`volumedetect` filter missing** in Remotion's slimmed-down ffmpeg build. At first I checked that the audio wasn't silent by decoding it and measuring RMS with numpy. After the system ffmpeg was installed, I ran `volumedetect` directly.
4. **Template vs. "modify default composition"** — the Hello World template's `HelloWorld` composition is already 150 frames @ 30 fps. A dedicated `TestClip` composition was added next to it, with the 5-second length calculated from FPS (`TEST_CLIP_FPS * TEST_CLIP_SECONDS`), so the template examples still work.
5. **Repo hygiene** — added `models/` (~115 MB) and `output.mp4` to `.gitignore`.
