import { browser, expect } from '@wdio/globals';
import { execFileSync } from 'node:child_process';
import { mkdtemp, mkdir, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
describe('Video Library with real integrated player',()=>{
 let root:string;
 before(async()=>{
  root=await mkdtemp(join(tmpdir(),'video-library-e2e-'));await mkdir(join(root,'第一章'));
  for(const name of ['02 练习.mp4','10 总结.mp4'])execFileSync('/opt/homebrew/bin/ffmpeg',['-v','error','-f','lavfi','-i','color=c=blue:s=320x180:d=8','-c:v','libx264','-pix_fmt','yuv420p','-y',join(root,'第一章',name)]);
 });
 after(async()=>{await rm(root,{recursive:true,force:true});});
 it('scans a folder, renders collection and reads actual durations',async()=>{
  await browser.executeObsidian(({app})=>app.commands.executeCommandById('video-player-ai:open-video-player'));
  await browser.$('button=Add playlist').click();
  await browser.$('.vl-path-input').setValue(root);
  await browser.$('button=Create playlist').click();
  await browser.waitUntil(async()=> (await browser.$$('.vl-row')).length===2);
  const result=await browser.executeObsidian(({app})=>{
   const lib=app.plugins.plugins['video-player-ai'].videoLibrary;
   const c=lib.data.collections[0];c.title='摄影入门';lib.refresh();
   return c.episodes.map(e=>({title:e.title,duration:e.duration}));
  });
  expect(result.map(e=>e.title)).toEqual(['02 练习','10 总结']);expect(result[0].duration).toBe(8);
  await expect(browser.$('.vl-chapter')).toBeDisplayed();
 });
 it('opens player, saves seek/pause, survives rescan and plugin reload, resumes',async()=>{
  await browser.executeObsidian(async({app})=>{
   const lib=app.plugins.plugins['video-player-ai'].videoLibrary;const player=app.plugins.plugins['video-player-ai'];player.settings.youtubeFfmpegCommand='/opt/homebrew/bin/ffmpeg';
   const c=lib.data.collections[0];await lib.play(c,c.episodes[0]);
  });
  await browser.waitUntil(async()=>browser.executeObsidian(({app})=>{
   const view=app.workspace.getLeavesOfType('video-player-ai-view').find(l=>l.view.containerEl.querySelector('video'))?.view;return view?.containerEl.querySelector('video')?.readyState>=2;
  }),{timeout:20000});
  await browser.executeObsidian(({app})=>{const lib=app.plugins.plugins['video-player-ai'].videoLibrary;lib.attachPlayers();const view=app.workspace.getLeavesOfType('video-player-ai-view').find(l=>l.view.containerEl.querySelector('video')).view;view.seekTo(3);});
  await browser.waitUntil(async()=>browser.executeObsidian(({app})=>app.plugins.plugins['video-player-ai'].videoLibrary.data.collections[0].episodes[0].position>=3));
  const result=await browser.executeObsidian(async({app})=>{
   let lib=app.plugins.plugins['video-player-ai'].videoLibrary;await lib.scan(lib.data.collections[0]);
   const view=app.workspace.getLeavesOfType('video-player-ai-view').find(l=>l.view.containerEl.querySelector('video')).view;view.seekTo(4);
   return lib.data.collections[0].episodes[0].status;
  });expect(result).toBe('watching');
  await browser.waitUntil(async()=>browser.executeObsidian(({app})=>app.plugins.plugins['video-player-ai'].videoLibrary.data.collections[0].episodes[0].position>=4));
  const resumed=await browser.executeObsidian(async({app})=>{
   let lib=app.plugins.plugins['video-player-ai'].videoLibrary;await lib.persist();await app.plugins.disablePlugin('video-player-ai');await app.plugins.enablePlugin('video-player-ai');lib=app.plugins.plugins['video-player-ai'].videoLibrary;
   await new Promise(r=>setTimeout(r,250));const c=lib.data.collections[0];await lib.play(c,c.episodes[0]);return {position:c.episodes[0].position};
  });expect(resumed.position).toBeCloseTo(4,0);
 });
 it('marks completion only at end, creates a note and renders final UI',async()=>{
  await browser.waitUntil(async()=>browser.executeObsidian(({app})=>app.workspace.getLeavesOfType('video-player-ai-view').find(l=>l.view.containerEl.querySelector('video'))?.view.containerEl.querySelector('video')?.readyState>=2));
  await browser.executeObsidian(({app})=>{const lib=app.plugins.plugins['video-player-ai'].videoLibrary;lib.attachPlayers();const view=app.workspace.getLeavesOfType('video-player-ai-view').find(l=>l.view.containerEl.querySelector('video')).view;view.seekTo(7.6);void view.containerEl.querySelector('video').play();});
  await browser.waitUntil(async()=>browser.executeObsidian(({app})=>app.plugins.plugins['video-player-ai'].videoLibrary.data.collections[0].episodes[0].status==='done'));
  const result=await browser.executeObsidian(async({app})=>{
   const lib=app.plugins.plugins['video-player-ai'].videoLibrary;const c=lib.data.collections[0];await lib.note(c,c.episodes[0]);await lib.open();const view=app.workspace.getLeavesOfType('video-library')[0].view;view.selected=c.id;view.render();return {note:c.episodes[0].notePath,done:c.episodes[0].status};
  });expect(result.note).toContain('Video Library Notes/');expect(result.done).toBe('done');
  await browser.waitUntil(async()=> (await browser.$$('.notice')).length===0,{timeout:15000});
  await mkdir('e2e-artifacts/video-library',{recursive:true});await browser.saveScreenshot('e2e-artifacts/video-library/library.png');
 });
 it('manually marks selected lessons watched, updates totals, persists and supports undo',async()=>{
  await (await browser.$$('.vl-select-video'))[1].click();
  await browser.$('button=Mark as watched').click();
  await browser.waitUntil(async()=>browser.executeObsidian(({app})=>{
   const el=app.workspace.getLeavesOfType('video-library')[0].view.contentEl;
   return el.querySelector('progress')?.value===2 && el.textContent.includes('Completed 2 / 2 videos');
  }));
  const saved=await browser.executeObsidian(async({app})=>{
   const lib=app.plugins.plugins['video-player-ai'].videoLibrary;await lib.persist();await lib.scan(lib.data.collections[0]);
   return JSON.parse(await app.vault.adapter.read(app.vault.configDir+'/plugins/video-player-ai/video-library.json')).collections[0].episodes.map(e=>e.status);
  });expect(saved).toEqual(['done','done']);
  await browser.$('button=Mark as unwatched').click();
  await browser.waitUntil(async()=>browser.executeObsidian(({app})=>app.workspace.getLeavesOfType('video-library')[0].view.contentEl.querySelector('progress')?.value===1));
  const statuses=await browser.executeObsidian(({app})=>app.plugins.plugins['video-player-ai'].videoLibrary.data.collections[0].episodes.map(e=>e.status));
  expect(statuses).toEqual(['done','new']);
  await browser.$('button=Mark watched').click();
  await browser.waitUntil(async()=>browser.executeObsidian(({app})=>app.workspace.getLeavesOfType('video-library')[0].view.contentEl.querySelector('progress')?.value===2));
  await browser.$('[aria-label="Select all videos"]').click();
  await browser.$('button=Mark as unwatched').click();
  await browser.waitUntil(async()=>browser.executeObsidian(({app})=>app.workspace.getLeavesOfType('video-library')[0].view.contentEl.querySelector('progress')?.value===0));
  await browser.$('button=Mark as watched').click();
  await browser.waitUntil(async()=>browser.executeObsidian(({app})=>app.workspace.getLeavesOfType('video-library')[0].view.contentEl.querySelector('progress')?.value===2));
 });

});
