"""Render English cues above unaltered Obsidian captures; export GIF, MP4, and SRT."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageOps
import json, subprocess, sys
root=Path(sys.argv[1]).resolve();out=root/'exports';out.mkdir(exist_ok=True)
frames=sorted((root/'frames').glob('frame-*.png'))
cues=json.loads((root/'frames/timeline.json').read_text())
font='/System/Library/Fonts/Avenir Next.ttc'
def f(size):return ImageFont.truetype(font,size)
def timestamp(t):
 ms=round(t*1000);return f'{ms//3600000:02}:{ms//60000%60:02}:{ms//1000%60:02},{ms%1000:03}'
fps=5;intro=2;width=1440;height=1100
card=Image.new('RGB',(width,height),'#111320');draw=ImageDraw.Draw(card)
draw.text((90,180),'VIDEO PLAYER · NEW IN 1.2.0',font=f(25),fill='#b9a4ff')
draw.text((90,310),'One folder. One playlist.',font=f(62),fill='#f4f4fb')
for i,line in enumerate(['Add your local video folder.','Mark lessons you have already watched.','Continue where you left off.']):
 draw.text((94,490+i*90),str(i+1)+'.  '+line,font=f(36),fill='#e2e0ef')
draw.text((90,960),'Real Obsidian footage · Original sample videos · No AI account needed',font=f(23),fill='#a5a4b6')
card.save(out/'local-playlists-poster.png')
proc=subprocess.Popen(['ffmpeg','-v','error','-y','-f','rawvideo','-pix_fmt','rgb24','-s',f'{width}x{height}','-r',str(fps),'-i','-','-an','-c:v','libx264','-preset','fast','-crf','19','-pix_fmt','yuv420p','-movflags','+faststart',str(out/'local-playlists.mp4')],stdin=subprocess.PIPE)
for _ in range(intro*fps):proc.stdin.write(card.tobytes())
for i,p in enumerate(frames):
 canvas=Image.new('RGB',(width,height),'#111320')
 shot=ImageOps.contain(Image.open(p).convert('RGB'),(width,height-100),Image.Resampling.LANCZOS)
 canvas.paste(shot,((width-shot.width)//2,100))
 cue=max((c for c in cues if c['frame']<=i),key=lambda c:c['frame'])['cue']
 size=29
 while f(size).getlength(cue)>width-70:size-=1
 ImageDraw.Draw(canvas).text((35,32),cue,font=f(size),fill='#f0ecff')
 proc.stdin.write(canvas.tobytes())
 if i in [15,70,110,135]:canvas.save(out/f'preview-{i}.png')
proc.stdin.close();assert proc.wait()==0
subprocess.run(['ffmpeg','-v','error','-y','-i',str(out/'local-playlists.mp4'),'-filter_complex','fps=5,scale=1200:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=160[p];[b][p]paletteuse=dither=bayer:bayer_scale=3','-loop','0',str(out/'local-playlists.gif')],check=True)
events=[(0,intro,'One folder. One playlist.\nAdd a folder, mark watched lessons, and continue watching.')]+[(intro+c['frame']/fps,intro+(cues[j+1]['frame'] if j+1<len(cues) else len(frames))/fps,c['cue']) for j,c in enumerate(cues)]
(out/'local-playlists.en.srt').write_text('\n\n'.join(f'{i+1}\n{timestamp(a)} --> {timestamp(b)}\n{text}' for i,(a,b,text) in enumerate(events))+'\n')
print('Exported',len(frames),'real frames;',intro+len(frames)/fps,'seconds; GIF',round((out/'local-playlists.gif').stat().st_size/1024**2,2),'MiB')
