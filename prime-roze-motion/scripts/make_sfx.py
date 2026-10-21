"""Synthesize the motion-graphics sound effects (no music) into public/sfx.

usage: python3 scripts/make_sfx.py <public_dir>
"""
import sys
import wave
from pathlib import Path

import numpy as np

SR = 48000
out = Path(sys.argv[1]) / "sfx"
out.mkdir(parents=True, exist_ok=True)
rng = np.random.default_rng(7)


def save(name, x, gain=0.9):
    x = x / (np.abs(x).max() + 1e-9) * gain
    st = np.stack([x, x], -1) if x.ndim == 1 else x
    with wave.open(str(out / f"{name}.wav"), "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((st * 32767).astype(np.int16).tobytes())


def t(d):
    return np.arange(int(SR * d)) / SR


def sweep_noise(d, f0, f1, q=0.35):
    """Noise through a resonant band-pass whose centre glides from f0 to f1."""
    n = rng.standard_normal(len(t(d)))
    fc = np.geomspace(f0, f1, len(n))
    y = np.zeros_like(n)
    lp = bp = 0.0
    for i, s in enumerate(n):
        f = 2 * np.sin(np.pi * fc[i] / SR)
        hp = s - lp - q * bp
        bp += f * hp
        lp += f * bp
        y[i] = bp
    return y


def env(n, a, r):
    e = np.ones(n)
    na, nr = int(a * SR), int(r * SR)
    e[:na] = np.linspace(0, 1, na) ** 2
    e[-nr:] *= np.linspace(1, 0, nr) ** 2
    return e


def pan(x, l2r=True):
    p = np.linspace(0, 1, len(x)) if l2r else np.linspace(1, 0, len(x))
    return np.stack([x * np.cos(p * np.pi / 2), x * np.sin(p * np.pi / 2)], -1)


# whoosh: rising then falling band-pass sweep, panned across the stereo field
d = 0.7
w = sweep_noise(d, 300, 4000) * np.sin(np.pi * np.linspace(0, 1, len(t(d)))) ** 2.5
save("whoosh", pan(w))
save("whoosh-back", pan(sweep_noise(d, 3500, 250) * np.sin(np.pi * np.linspace(0, 1, len(t(d)))) ** 2.5, False))

# swish: short and bright, for text pops
d = 0.28
save("swish", sweep_noise(d, 1500, 7000, 0.5) * np.sin(np.pi * np.linspace(0, 1, len(t(d)))) ** 3, 0.7)

# impact: sub drop + noise transient + long tail
d = 1.6
tt = t(d)
sub = np.sin(2 * np.pi * (55 * tt - 18 * tt ** 2 / 2)) * np.exp(-tt * 3.2)
crack = rng.standard_normal(len(tt)) * np.exp(-tt * 38)
tail = sweep_noise(d, 900, 120, 0.8) * np.exp(-tt * 2.5) * 0.4
save("impact", sub * 1.0 + crack * 0.35 + tail)

# riser: noise + detuned saw climbing into the hit
d = 1.4
tt = t(d)
f = np.geomspace(120, 1400, len(tt))
ph = 2 * np.pi * np.cumsum(f) / SR
saw = sum(np.sin(k * ph * (1 + 0.004 * j)) / k for k in range(1, 6) for j in (-1, 1))
r = (saw * 0.25 + sweep_noise(d, 400, 9000, 0.6)) * np.linspace(0, 1, len(tt)) ** 2.2
r[-int(0.03 * SR):] *= np.linspace(1, 0, int(0.03 * SR))
save("riser", r, 0.75)

# shimmer: bell-like gold sparkle
d = 1.8
tt = t(d)
sh = sum(np.sin(2 * np.pi * f0 * tt + 0.3 * np.sin(2 * np.pi * 6 * tt)) * np.exp(-tt * (2 + i))
         for i, f0 in enumerate([1318.5, 1975.5, 2637.0, 3951.1, 5274.0]))
sh *= env(len(tt), 0.005, 0.4)
save("shimmer", sh, 0.6)

# tick: tiny click for the counter
d = 0.05
tt = t(d)
save("tick", np.sin(2 * np.pi * 2400 * tt) * np.exp(-tt * 140) + rng.standard_normal(len(tt)) * np.exp(-tt * 400) * 0.3, 0.5)

# pop: soft bubble pop for chips / badges
d = 0.18
tt = t(d)
save("pop", np.sin(2 * np.pi * np.cumsum(np.geomspace(900, 300, len(tt))) / SR) * np.exp(-tt * 30), 0.6)
print(sorted(p.name for p in out.iterdir()))
