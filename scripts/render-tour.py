"""Render an original stylized architectural gym flythrough. Requires Pillow + ffmpeg.
No external footage, models, or likenesses are used. This is a demo asset, not real venue footage.
"""
import math, subprocess
from pathlib import Path
from PIL import Image,ImageDraw,ImageFilter
W,H=768,432
out=Path(__file__).resolve().parents[1]/'public';out.mkdir(exist_ok=True)
boxes=[]
def box(x,y,z,w,h,d,color): boxes.append((x,y,z,w,h,d,color))
# Room and architectural light bars
box(0,-.22,9,12,.3,28,(28,27,26));box(-6,2.5,9,.15,5,28,(24,24,25));box(6,2.5,9,.15,5,28,(24,24,25))
for z in range(-3,22,3):
 box(0,5,z,12,.12,.15,(38,38,39));box(-5.7,3.6,z,.09,.06,2.5,(255,85,25));box(5.7,3.6,z,.09,.06,2.5,(255,85,25))
for z in [2,6,10,14,18]:
 for x in [-3.8,3.8]:
  # Rack uprights and crossbar
  for dx in [-.8,.8]:box(x+dx,1.35,z,.13,2.7,.13,(91,93,94));box(x+dx,.12,z,.24,.15,1.7,(51,52,53))
  box(x,2.65,z,1.8,.12,.13,(100,103,105));box(x,1.65,z+.25,2.5,.08,.08,(170,172,173))
  for dx in [-1,1]:box(x+dx,1.65,z+.25,.22,.7,.7,(51,52,53))
  box(x,.5,z+.6,.7,.16,1.5,(225,70,22));box(x,.25,z+.6,.15,.5,.8,(70,71,72))
# Strength-zone center stations
for z in [11,16]:box(0,.5,z,1.1,.15,2,(28,29,30));box(0,.2,z,.6,.4,1.5,(75,77,79))
def frame(t):
 # continuous entrance -> equipment -> strength -> wide reveal
 camz=-8+t*21;camx=math.sin(t*math.pi*2)*.7;camy=1.8+max(0,(t-.75)*4)*1.7
 yaw=math.sin(t*math.pi)*.07
 im=Image.new('RGB',(W,H),(8,8,8));dr=ImageDraw.Draw(im)
 faces=[]
 def project(p):
  x,y,z=p;x-=camx;y-=camy;z-=camz
  x,z=x*math.cos(yaw)-z*math.sin(yaw),x*math.sin(yaw)+z*math.cos(yaw)
  if z<.25:return None
  return (W/2+x/z*440,H*.5-y/z*440)
 for x,y,z,w,h,d,col in boxes:
  verts=[(x+sx*w/2,y+sy*h/2,z+sz*d/2) for sx,sy,sz in [(-1,-1,-1),(1,-1,-1),(1,1,-1),(-1,1,-1),(-1,-1,1),(1,-1,1),(1,1,1),(-1,1,1)]]
  for inds,shade in [([0,1,2,3],.8),([4,5,6,7],.7),([0,4,7,3],.6),([1,5,6,2],.9),([3,2,6,7],1.0)]:
   ps=[project(verts[i]) for i in inds]
   if None in ps:continue
   depth=sum(verts[i][2]-camz for i in inds)/4
   fog=max(.22,1-depth/44);color=tuple(int(c*shade*fog) for c in col)
   faces.append((depth,ps,color))
 for _,ps,col in sorted(faces,reverse=True,key=lambda a:a[0]):dr.polygon(ps,fill=col)
 glow=im.filter(ImageFilter.GaussianBlur(12));from PIL import ImageChops
 im=ImageChops.add(im,glow,scale=1.5)
 return im
p=subprocess.Popen(['ffmpeg','-y','-f','rawvideo','-pix_fmt','rgb24','-s',f'{W}x{H}','-r','24','-i','-','-c:v','libx264','-crf','21','-g','6','-keyint_min','6','-sc_threshold','0','-pix_fmt','yuv420p','-movflags','+faststart','-an',str(out/'gym-tour.mp4')],stdin=subprocess.PIPE,stderr=subprocess.DEVNULL)
for i in range(288):
 im=frame(i/287)
 if i==50:im.save(out/'tour-poster.webp',quality=85)
 p.stdin.write(im.tobytes())
p.stdin.close();assert p.wait()==0
print('Generated',out/'gym-tour.mp4')
