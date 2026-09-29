/** Real-app Playlist demonstration using original sample videos, without AI calls. */
import { browser, expect } from '@wdio/globals';
import { mkdir, copyFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
const output=process.env.DEMO_OUTPUT!;
const folder=process.env.DEMO_FOLDER!;
const media=process.env.DEMO_MEDIA!;
const extras=[join(folder,'..','Downloads','Bonus.mp4'),join(folder,'..','Workshop','Extra.mp4')];
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
  for(const path of extras){await mkdir(join(path,'..'),{recursive:true});await copyFile(media,path);}
  await browser.execute(()=>{(window as any).require('@electron/remote').getCurrentWindow().setSize(1440,1000);});
  await browser.executeObsidian(({app})=>{
   app.workspace.leftSplit.collapse();app.workspace.rightSplit.collapse();
   const p=app.plugins.plugins['video-player-ai'];p.settings.youtubeFfmpegCommand='/opt/homebrew/bin/ffmpeg';p.settings.sourceLanguage='en';p.settings.sharedMemoryEnabled=false;
   app.commands.executeCommandById('video-player-ai:open-video-player');
  });
 });
 it('records folders, multiple locations, empty playlists, and progress',async()=>{
  mark('ONE PLAYLIST, ANY LOCATION · Start in Video Player');await capture(2);
  await browser.$('button=Add playlist').click();
  await browser.$('.vl-path-input').setValue(folder);
  mark('ADD · Choose a folder or paste its path');await capture(3);
  await click('.modal .mod-cta');
  await browser.waitUntil(async()=> (await browser.$$('.vl-row')).length===4);
  mark('ORGANIZE · Chapters, natural order, and durations — automatically');await capture(3);
  mark('ADD VIDEOS · Bring files from other locations into this playlist');
  await browser.$('button=Add videos').click();await browser.$('.vl-video-paths').setValue(extras.join('\n'));await capture(3);
  await click('.modal .mod-cta');await browser.waitUntil(async()=>(await browser.$$('.vl-row')).length===6);await capture(3);
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
  mark('START EMPTY · A playlist does not need a folder');await browser.$('button=← All playlists').click();
  await browser.$('.vl-header').$('button=Create empty playlist').click();await browser.$('[aria-label="Playlist name"]').setValue('My video collection');await capture(2);await click('.modal .mod-cta');
  await browser.$('button=Add videos').click();await browser.$('.vl-video-paths').setValue(extras.join('\n'));
  mark('BUILD YOUR OWN · Add videos from anywhere, whenever you like');await capture(2);await click('.modal .mod-cta');
  await browser.waitUntil(async()=>(await browser.$$('.vl-row')).length===2);await capture(3);
  mark('YOUR PLAYLISTS · Folders and handpicked videos, together');await browser.$('button=← All playlists').click();await capture(3);
  await writeFile(join(output,'timeline.json'),JSON.stringify(cues,null,2));
  await writeFile(join(output,'verification.json'),JSON.stringify(await browser.executeObsidian(({app})=>{
   return app.plugins.plugins['video-player-ai'].videoLibrary.data.collections.map(c=>({name:c.title,count:c.episodes.length,sources:c.sources?.length,manual:c.episodes.filter(e=>e.absolutePath).length,statuses:c.episodes.map(e=>e.status),positions:c.episodes.map(e=>e.position)}));
  }),null,2));
 });
});
