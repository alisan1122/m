import subprocess, sys
S = sys.argv[1]
# (start, end, face_zoom)
segs = [(26.2, 27.9, True),   # hook teaser
        (7.0, 15.9, False), (15.9, 18.6, True), (18.6, 20.9, False),
        (21.9, 23.9, False), (24.4, 26.0, False), (26.0, 28.2, True)]
FACE_N = "crop=576:325:0:0"
FACE_Z = "crop=412:232:34:74"
GAME = "crop=480:431:48:325"
f, cat = [], ""
for i, (a, b, z) in enumerate(segs):
    d = b - a
    flash = ",fade=in:st=0:d=0.18:color=white" if i == 1 else ""
    f.append(f"[0:v]trim={a}:{b},setpts=PTS-STARTPTS,split[f{i}][g{i}]")
    f.append(f"[f{i}]{FACE_Z if z else FACE_N},scale=1080:609:flags=lanczos,setsar=1[F{i}]")
    f.append(f"[g{i}]{GAME},scale=1080:970:flags=lanczos,setsar=1[G{i}]")
    f.append(f"color=c=0x0b0b0f:s=1080x1920:r=30:d={d}[bg{i}]")
    f.append(f"[bg{i}][F{i}]overlay=0:341[t{i}];[t{i}][G{i}]overlay=0:950:shortest=1{flash}[v{i}]")
    f.append(f"[0:a]atrim={a}:{b},asetpts=PTS-STARTPTS,afade=t=in:d=0.03,afade=t=out:st={d-0.04}:d=0.04[a{i}]")
    cat += f"[v{i}][a{i}]"
f.append(f"{cat}concat=n={len(segs)}:v=1:a=1[cv][ca]")
f.append(f"movie={S}/t_hook.png[h];movie={S}/t_main.png[m];[cv][h]overlay=0:0:enable='lt(t,1.7)'[c1];[c1][m]overlay=0:0:enable='gte(t,1.7)'[ov]")
f.append("[ca]loudnorm=I=-14:TP=-1.5:LRA=11[oa]")
subprocess.run(["ffmpeg", "-nostdin", "-v", "error", "-y", "-i", f"{S}/in.mp4",
    "-filter_complex", ";".join(f), "-map", "[ov]", "-map", "[oa]",
    "-c:v", "libx264", "-preset", "slow", "-crf", "18", "-pix_fmt", "yuv420p",
    "-c:a", "aac", "-b:a", "192k", "-ar", "44100", "-movflags", "+faststart",
    f"{S}/montage.mp4"], check=True)
