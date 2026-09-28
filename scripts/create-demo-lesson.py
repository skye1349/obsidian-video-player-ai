from PIL import Image,ImageDraw,ImageFont
from pathlib import Path
import subprocess,math,sys
base=Path(sys.argv[1]).resolve();base.mkdir(parents=True,exist_ok=True)
font='/System/Library/Fonts/Avenir Next.ttc'
if not Path(font).exists():font='/System/Library/Fonts/Helvetica.ttc'
F=lambda n:ImageFont.truetype(font,n)
out=base/'Learn in three steps.mp4'
cmd=['ffmpeg','-v','error','-y','-f','rawvideo','-pix_fmt','rgb24','-s','1280x720','-r','24','-i','-','-an','-c:v','libx264','-preset','fast','-crf','18','-pix_fmt','yuv420p',str(out)]
p=subprocess.Popen(cmd,stdin=subprocess.PIPE)
steps=[('01','NOTICE','Choose one useful idea.','Pay attention to what surprises you.'),('02','EXPLAIN','Use your own words.','A simple explanation reveals what you understand.'),('03','RETURN','Revisit the idea tomorrow.','Small sessions build lasting knowledge.')]
for i in range(24*24):
 t=i/24;idx=min(2,int(t/8));num,title,sub,detail=steps[idx]
 im=Image.new('RGB',(1280,720),'#111426');d=ImageDraw.Draw(im)
 for y in range(720):d.line((0,y,1280,y),fill=(17+int(y/90),20+int(y/100),38+int(y/50)))
 d.text((76,58),'A BETTER WAY TO LEARN',font=F(20),fill='#aaa4d4')
 d.rounded_rectangle((76,175,190,289),28,fill='#8976ed');d.text((101,194),num,font=F(48),fill='white')
 d.text((225,182),title,font=F(60),fill='white')
 d.text((80,350),sub,font=F(43),fill='white')
 d.text((80,422),detail,font=F(26),fill='#c3c4d6')
 for k,st in enumerate(steps):
  x=80+k*400;d.rounded_rectangle((x,590,x+355,650),16,fill='#393252' if k==idx else '#212437')
  d.text((x+23,604),st[0]+'  '+st[1],font=F(22),fill='white' if k==idx else '#888ba5')
 d.rounded_rectangle((80,683,1200,687),2,fill='#303249')
 d.rounded_rectangle((80,683,80+int(1120*t/24),687),2,fill='#9c88ff')
 p.stdin.write(im.tobytes())
p.stdin.close();assert p.wait()==0
sub='''1
00:00:00,000 --> 00:00:07,900
Start by choosing one useful idea. Notice what surprises you.

2
00:00:08,000 --> 00:00:15,900
Explain that idea in your own words. A simple explanation reveals gaps in your understanding.

3
00:00:16,000 --> 00:00:23,900
Return to the idea tomorrow. Small sessions build lasting knowledge.
'''
out.with_suffix('.srt').write_text(sub)
out.with_name(out.stem+'.zh.vtt').write_text('WEBVTT\n\n00:00.000 --> 00:07.900\n选择一个有用的想法，留意让你好奇的地方。\n\n00:08.000 --> 00:15.900\n用自己的话解释，发现理解中的空白。\n\n00:16.000 --> 00:23.900\n明天再回顾，短时间练习也能积累知识。\n')
# Add the same original captions as a genuine embedded CC track.
tmp=out.with_name('embedded.mp4')
subprocess.run(['ffmpeg','-v','error','-y','-i',str(out),'-i',str(out.with_suffix('.srt')),'-map','0:v','-map','1:0','-c:v','copy','-c:s','mov_text','-metadata:s:s:0','language=eng',str(tmp)],check=True)
tmp.replace(out)
print(out)
