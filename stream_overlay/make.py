import sys, math, colorsys, subprocess, os
from PIL import Image, ImageDraw, ImageFont, ImageFilter
SRC="/root/.claude/uploads/00f38a8b-0a5b-5b17-a4d8-959bacdf30df/c3b73f6f-image.png"
NAME=sys.argv[1] if len(sys.argv)>1 else "YOUR NAME"
SUB=sys.argv[2] if len(sys.argv)>2 else "LIVE STREAM"
OUT=os.path.dirname(os.path.abspath(__file__))
FPS,DUR=30,4; N=FPS*DUR
base=Image.open(SRC).convert("RGB"); W,H=base.size
W-=W%2; H-=H%2; base=base.resize((W,H))
F="/usr/share/fonts/opentype/inter/InterDisplay-Bold.otf"
fn=ImageFont.truetype(F,int(H*0.06)); fs=ImageFont.truetype(F,int(H*0.028)); fl=ImageFont.truetype(F,int(H*0.03))
def grad(t,off):  # neon purple<->blue
    h=(0.62+0.17*(0.5+0.5*math.sin(2*math.pi*(t+off))))
    return tuple(int(c*255) for c in colorsys.hsv_to_rgb(h,0.85,1))
def perim(t,m,w,h):
    # point on rectangle perimeter, t in 0..1
    P=2*(w+h); d=(t%1)*P
    if d<w: return (m+d,m)
    d-=w
    if d<h: return (m+w,m+d)
    d-=h
    if d<w: return (m+w-d,m+h)
    d-=w; return (m,m+h-d)
os.makedirs("/tmp/fr",exist_ok=True)
m=int(H*0.025); bw,bh=W-2*m,H-2*m
for i in range(N):
    t=i/N
    # slow zoom
    z=1+0.03*t; cw,ch=W/z,H/z
    fr=base.crop((int((W-cw)/2),int((H-ch)/2),int((W+cw)/2),int((H+ch)/2))).resize((W,H),Image.LANCZOS)
    # vignette
    ov=Image.new("RGBA",(W,H),(0,0,0,0)); d=ImageDraw.Draw(ov)
    glow=Image.new("RGBA",(W,H),(0,0,0,0)); g=ImageDraw.Draw(glow)
    # frame segments with animated gradient
    S=240
    for k in range(S):
        a=k/S; b=(k+1.5)/S
        p1=perim(a,m,bw,bh); p2=perim(b,m,bw,bh)
        c=grad(a,-t)
        g.line([p1,p2],fill=c+(255,),width=int(H*0.012))
        d.line([p1,p2],fill=c+(255,),width=int(H*0.005))
    # moving bright comet
    for j in range(40):
        p=perim(t*2-j*0.002,m,bw,bh); r=int(H*0.012*(1-j/40))+1
        g.ellipse([p[0]-r*2,p[1]-r*2,p[0]+r*2,p[1]+r*2],fill=(255,255,255,int(255*(1-j/40))))
    glow=glow.filter(ImageFilter.GaussianBlur(H*0.012))
    fr=Image.alpha_composite(fr.convert("RGBA"),glow); fr=Image.alpha_composite(fr,ov)
    d=ImageDraw.Draw(fr)
    # name plate slides in (ease-out) first 0.6s
    e=min(1,i/(FPS*0.6)); e=1-(1-e)**3
    pw=int(W*0.34); ph=int(H*0.14); x=int(m*2+ (e-1)*(pw+m*3)); y=int(H-m*2-ph)
    plate=Image.new("RGBA",(pw,ph),(0,0,0,0)); pd=ImageDraw.Draw(plate)
    pd.rounded_rectangle([0,0,pw-1,ph-1],radius=int(ph*0.25),fill=(12,10,30,205),outline=grad(0,-t)+(255,),width=3)
    pd.rounded_rectangle([0,0,int(ph*0.12),ph-1],radius=4,fill=grad(0.5,-t)+(255,))
    pd.text((int(ph*0.3),int(ph*0.12)),NAME,font=fn,fill=(255,255,255,255))
    pd.text((int(ph*0.3),int(ph*0.62)),SUB,font=fs,fill=grad(0.2,-t)+(255,))
    fr.alpha_composite(plate,(x,y))
    # LIVE badge pulsing
    pulse=0.5+0.5*math.sin(2*math.pi*t*2)
    bx,by=int(m*2),int(m*2); bwid=int(W*0.1); bhei=int(H*0.065)
    d.rounded_rectangle([bx,by,bx+bwid,by+bhei],radius=bhei//3,fill=(225,30,60,255))
    r=int(bhei*0.14+pulse*3); cx,cy=bx+int(bhei*0.4),by+bhei//2
    d.ellipse([cx-r,cy-r,cx+r,cy+r],fill=(255,255,255,255))
    d.text((bx+int(bhei*0.75),by+bhei//2),"LIVE",font=fl,fill=(255,255,255,255),anchor="lm")
    fr.convert("RGB").save(f"/tmp/fr/{i:03d}.png")
subprocess.run(f'ffmpeg -y -loglevel error -framerate {FPS} -i /tmp/fr/%03d.png -c:v libx264 -pix_fmt yuv420p -crf 17 {OUT}/stream_overlay.mp4',shell=True,check=True)
subprocess.run(f'ffmpeg -y -loglevel error -framerate {FPS} -i /tmp/fr/%03d.png -vf "fps=20,scale=720:-1:flags=lanczos,split[a][b];[a]palettegen[p];[b][p]paletteuse" -loop 0 {OUT}/stream_overlay.gif',shell=True,check=True)
Image.open("/tmp/fr/045.png").save(f"{OUT}/preview.png")
