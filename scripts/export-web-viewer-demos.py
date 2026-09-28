from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
import json,subprocess,sys
root=Path(sys.argv[1]).resolve()
out=root/'exports';out.mkdir(exist_ok=True)
font='/System/Library/Fonts/Avenir Next.ttc'
def f(n):return ImageFont.truetype(font,n)
def timestamp(t):
 ms=round(t*1000);return f'{ms//3600000:02}:{ms//60000%60:02}:{ms//1000%60:02},{ms%1000:03}'
for feature,title,steps in [
 ('web-viewer-selection','Translate a webpage in Obsidian',['Select a passage in Web Viewer.','Click the sparkle icon to refine it with AI.']),
 ('web-viewer-subtitles','Watch on the web. Read bilingual captions.',['Run Translate video subtitles from Web Viewer.','Translate, then click a timestamp to seek.'])]:
 folder=root/feature;raw=sorted(folder.glob('frame-*.png'));first=raw[0].stat().st_mtime
 raw=[p for p in raw if p.stat().st_mtime>=first]
 cues=json.loads((folder/'timeline.json').read_text())
 fps=6;intro=3
 card=Image.new('RGB',(1920,1080),'#0c111f');d=ImageDraw.Draw(card)
 d.rounded_rectangle((100,115,660,172),15,fill='#2a2249');d.text((125,126),'WEB VIEWER · NEW IN 1.1.0',font=f(28),fill='#b7a4ff')
 size=64
 while f(size).getlength(title)>1710:size-=2
 d.text((100,260),title,font=f(size),fill='#f2f5fc')
 for i,step in enumerate(steps):
  y=435+i*160;d.rounded_rectangle((100,y,166,y+66),15,fill='#a592fc');d.text((121,y+8),str(i+1),font=f(38),fill='#141628');d.text((205,y+10),step,font=f(40),fill='#e7ebf5')
 d.text((100,930),'Real Obsidian footage · Actual translation results · Waiting time shortened',font=f(27),fill='#94a2be')
 card.save(out/f'{feature}-poster.png')
 cmd=['ffmpeg','-v','error','-y','-f','rawvideo','-pix_fmt','rgb24','-s','1920x1080','-r',str(fps),'-i','-','-an','-c:v','libx264','-preset','fast','-crf','19','-pix_fmt','yuv420p','-movflags','+faststart',str(out/f'{feature}.mp4')]
 proc=subprocess.Popen(cmd,stdin=subprocess.PIPE)
 for _ in range(int(intro*fps)):proc.stdin.write(card.tobytes())
 for i,p in enumerate(raw):
  im=Image.new('RGB',(1920,1080),'#0c111f');screen=Image.open(p).convert('RGB').crop((0,0,2880,1452)).resize((1920,968),Image.Resampling.LANCZOS);im.paste(screen,(0,112));d=ImageDraw.Draw(im)
  current=max((c for c in cues if c['frame']<=i),key=lambda c:c['frame'])
  label=current['cue'];d.text((48,32),label,font=f(34),fill='#eef0fa')
  # Editorial click rings identify the real controls clicked in the recording.
  delta=i-current['frame']
  if label.startswith('CLICK') and delta<9:
   xy=(1660,193) if feature=='web-viewer-subtitles' and 'Translate' in label else (1050,112+527*2/3) if feature=='web-viewer-subtitles' else (683,112+850*2/3)
   # Coordinates taken from the app capture; timestamp control is at x~1040 / y~354 after scaling.
   if feature=='web-viewer-subtitles' and 'timestamp' in label:xy=(1040,112+523*2/3)
   if feature=='web-viewer-selection':xy=(683,112+858*2/3)
   x,y=xy;r=25+delta*2;d.ellipse((x-r,y-r,x+r,y+r),outline='#b49aff',width=4)
  proc.stdin.write(im.tobytes())
 proc.stdin.close();assert proc.wait()==0
 duration=intro+len(raw)/fps
 events=[(0,intro,title+'\n'+' '.join(steps))]+[(intro+c['frame']/fps,intro+(cues[j+1]['frame'] if j+1<len(cues) else len(raw))/fps,c['cue']) for j,c in enumerate(cues)]
 (out/f'{feature}.en.srt').write_text('\n\n'.join(f'{i+1}\n{timestamp(a)} --> {timestamp(b)}\n{text}' for i,(a,b,text) in enumerate(events))+'\n')
 subprocess.run(['ffmpeg','-v','error','-y','-i',str(out/f'{feature}.mp4'),'-filter_complex','fps=8,scale=1280:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=160[p];[b][p]paletteuse=dither=bayer:bayer_scale=3','-loop','0',str(out/f'{feature}.gif')],check=True)
 print(feature,'frames',len(raw),'seconds',round(duration,2),'gif MiB',round((out/f'{feature}.gif').stat().st_size/1024**2,2),flush=True)
