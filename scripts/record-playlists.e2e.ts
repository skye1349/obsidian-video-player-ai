/** Real-app Playlist demonstration using original sample videos, without AI calls. */
import { browser, expect } from '@wdio/globals';
import { mkdir, copyFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
const output=process.env.DEMO_OUTPUT!;
const folder=process.env.DEMO_FOLDER!;
const media=process.env.DEMO_MEDIA!;
let frame=0;
const cues:Array<{frame:number;cue:string}>=[];
async function capture(seconds:number){
 for(let i=0;i<seconds*5;i++){await browser.saveScreenshot(join(output,`frame-${String(frame++).padStart(5,'0')}.png`));await browser.pause(140);}
}
function mark(cue:string){cues.push({frame,cue});}
async function click(selector:string){
 const element=await browser.$(selector);await element.scrollIntoView({block:'nearest'});
 await browser.execute((selector)=>{
  const el=document.querySelector(selector);if(!el)return;
  const r=el.getBoundingClientRect();const marker=document.createElement('div');
  marker.id='demo-click';Object.assign(marker.style,{position:'fixed',left:`${r.left+r.width/2-23}px`,top:`${r.top+r.height/2-23}px`,width:'46px',height:'46px',border:'3px solid #b8a1ff',borderRadius:'50%',pointerEvents:'none',zIndex:'99999',boxShadow:'0 0 0 7px #b8a1ff33'});document.body.append(marker);
 },selector);
 await capture(0.4);await element.click();await capture(0.6);
 await browser.execute(()=>document.getElementById('demo-click')?.remove());
}
describe('Record local playlists',function(){
 this.timeout(180000);
 before(async()=>{
  await mkdir(output,{recursive:true});await mkdir(join(folder,'01 Foundations'),{recursive:true});
  for(const name of ['01 Notice','02 Explain','03 Return','04 Practice'])await copyFile(media,join(folder,'01 Foundations',name+'.mp4'));
  await browser.execute(()=>{(window as any).require('@electron/remote').getCurrentWindow().setSize(1440,1000);});
  await browser.executeObsidian(({app})=>{
   app.workspace.leftSplit.collapse();app.workspace.rightSplit.collapse();
   const p=app.plugins.plugins['video-player-ai'];p.settings.youtubeFfmpegCommand='/opt/homebrew/bin/ffmpeg';p.settings.sourceLanguage='en';p.settings.sharedMemoryEnabled=false;
   app.commands.executeCommandById('video-player-ai:open-video-player');
  });
 });
 it('records folder import, watched progress, playback and resume',async()=>{
  mark('ONE FOLDER, ONE PLAYLIST · Start in Video Player');await capture(2);
  await browser.$('button=Add playlist').click();
  await browser.$('.vl-path-input').setValue(folder);
  mark('ADD · Choose a folder or paste its path');await capture(3);
  await click('.modal .mod-cta');
  await browser.waitUntil(async()=> (await browser.$$('.vl-row')).length===4);
  mark('ORGANIZE · Chapters, natural order, and durations — automatically');await capture(3);
  mark('SELECT · Already watched lessons 1, 2, and 3?');
  for(const title of ['01 Notice','02 Explain','03 Return'])await click(`[aria-label="Select ${title}"]`);
  await capture(1);
  mark('MARK AS WATCHED · Count past lessons toward your progress');await click('.vl-bulk .mod-cta');
  await expect(browser.$('.vl progress')).toHaveAttribute('value','3');await capture(3);
  mark('CONTINUE · Pick up the next unfinished lesson');await click('.vl>.mod-cta');
  await browser.waitUntil(async()=>browser.execute(()=>!!document.querySelector<HTMLVideoElement>('.youtube-reader-player video')?.readyState));
  await browser.execute(()=>{const v=document.querySelector<HTMLVideoElement>('.youtube-reader-player video')!;v.muted=true;void v.play();});await capture(3);
  await browser.execute(()=>document.querySelector<HTMLVideoElement>('.youtube-reader-player video')?.pause());
  mark('REMEMBER · Playback progress is saved automatically');await click('[aria-label="Back to playlists"]');await capture(3);
  mark('YOUR PLAYLISTS · All folders, one place');await browser.$('button=← All playlists').click();await capture(3);
  await writeFile(join(output,'timeline.json'),JSON.stringify(cues,null,2));
  await writeFile(join(output,'verification.json'),JSON.stringify(await browser.executeObsidian(({app})=>{
   const c=app.plugins.plugins['video-player-ai'].videoLibrary.data.collections[0];return {count:c.episodes.length,statuses:c.episodes.map(e=>e.status),resume:c.episodes[3].position};
  }),null,2));
 });
});
