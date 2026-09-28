/** Optional real-app recording. Uses public sample content and the user's signed-in Codex CLI. */
import { browser, expect } from '@wdio/globals';
import { createServer, type Server } from 'node:http';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { AddressInfo } from 'node:net';

const output = process.env.DEMO_OUTPUT!;
const media = process.env.DEMO_MEDIA!;
const tracks = `WEBVTT\n\n00:00.000 --> 00:07.900\nStart by choosing one useful idea. Notice what surprises you.\n\n00:08.000 --> 00:15.900\nExplain that idea in your own words. A simple explanation reveals gaps in your understanding.\n\n00:16.000 --> 00:23.900\nReturn to the idea tomorrow. Small sessions build lasting knowledge.\n`;
let server: Server;
let base: string;
let frame = 0;
let start = 0;
let dir = '';
const timeline: Array<{ frame: number; seconds: number; cue: string }> = [];
async function mark(cue: string) { timeline.push({frame, seconds:(Date.now()-start)/1000, cue}); }
async function frames(seconds: number) {
  const end = Date.now() + seconds*1000;
  while (Date.now() < end) {
    await browser.saveScreenshot(join(dir, `frame-${String(frame++).padStart(5,'0')}.png`));
    await browser.pause(90);
  }
}
async function begin(name: string) {
  dir = join(output, name); await mkdir(dir, {recursive:true}); frame=0; start=Date.now(); timeline.length=0;
}
async function finish() { await writeFile(join(dir,'timeline.json'),JSON.stringify(timeline,null,2)); }
async function guest(code: string) {
  return browser.executeObsidian(async ({app},code) => {
    const w=app.workspace.getLeavesOfType('webviewer')[0].view.containerEl.querySelector('webview') as any;
    return w.executeJavaScript(code);
  },code);
}

describe('Record Web Viewer feature demos', function() {
  this.timeout(240000);
  before(async () => {
    const video = await readFile(media);
    server=createServer((req,res)=>{
      if(req.url==='/lesson.mp4'){
        const match=req.headers.range?.match(/bytes=(\d+)-(\d*)/);
        if(match){const a=Number(match[1]), b=match[2]?Math.min(Number(match[2]),video.length-1):video.length-1;res.writeHead(206,{'Content-Type':'video/mp4','Content-Range':`bytes ${a}-${b}/${video.length}`,'Content-Length':b-a+1,'Accept-Ranges':'bytes'});res.end(video.subarray(a,b+1));}
        else {res.writeHead(200,{'Content-Type':'video/mp4','Content-Length':video.length,'Accept-Ranges':'bytes'});res.end(video);}
        return;
      }
      if(req.url==='/captions.vtt'){res.writeHead(200,{'Content-Type':'text/vtt'});res.end(tracks);return;}
      res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});
      const videoPage=req.url==='/watch';
      res.end(`<!doctype html><html><head><title>${videoPage?'Learn in three steps':'Read with curiosity'}</title><style>
      *{box-sizing:border-box}body{margin:0;background:#171a24;color:#eef0f8;font-family:system-ui;padding:42px 48px;line-height:1.65}small{color:#b7a9f7;letter-spacing:2px;font-size:13px}h1{font-size:34px;line-height:1.2;margin:20px 0}p{font-size:22px;max-width:880px;color:#cfd3e4}#passage{color:#fff}video{width:100%;border-radius:12px;margin:12px 0 4px}footer{margin-top:40px;border-top:1px solid #393e50;padding-top:18px;color:#919cb7;font-size:13px}::selection{background:#615197;color:white}</style></head><body>
      <small>THE LEARNING NOTEBOOK · SAMPLE LESSON</small><h1>${videoPage?'Learn in three steps':'Read with curiosity'}</h1>
      ${videoPage?'<video controls loop muted preload="auto"><source src="/lesson.mp4" type="video/mp4"><track default kind="subtitles" srclang="en" label="English" src="/captions.vtt"></video><p>Notice. Explain. Return.</p>':'<p>Good reading begins with a question. What can this passage teach me?</p><p id="passage">Small sessions build lasting knowledge. Choose one useful idea and explain it in your own words.</p><p>Return tomorrow and notice what you remember.</p>'}
      <footer>Original demonstration material · Read and watch inside Obsidian</footer></body></html>`);
    });
    await new Promise<void>(resolve=>server.listen(0,'127.0.0.1',resolve));base=`http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    await browser.execute(() => { (window as any).require('@electron/remote').getCurrentWindow().setSize(1440,940); });
    await browser.executeObsidian(async ({app},base)=>{
      app.workspace.leftSplit.collapse();app.workspace.rightSplit.collapse();
      await app.internalPlugins.plugins.webviewer.enable();
      for(const id of ['ai-translator-by-taoye','video-player-ai']){
        const p=app.plugins.plugins[id]; Object.assign(p.settings,{aiBackend:'codex',modelSelection:'manual',model:'gpt-5.6-luna',reasoningEffort:'low',codexCommand:'',sourceLanguage:'en',targetLanguage:'zh-CN',sharedMemoryEnabled:false,autoTranslate:true,requireCommandForAutoTranslate:false,debounceMs:300});
      }
      const leaf=app.workspace.getLeaf('tab');await leaf.setViewState({type:'webviewer',active:true,state:{url:base+'/read'}});await app.workspace.revealLeaf(leaf);
    },base);
    await browser.waitUntil(async()=> {try{return Boolean(await guest('Boolean(document.querySelector("#passage") && window.__contextualReaderSelection)'));}catch{return false;}},{timeout:20000});
  });
  after(async()=> {if(server)await new Promise<void>(resolve=>server.close(()=>resolve()));});
  it('records webpage selection and the AI refinement result',async()=>{
    await begin('web-viewer-selection');await mark('SELECT · Highlight a passage in Web Viewer');await frames(2);
    await guest(`const r=document.createRange();r.selectNodeContents(document.querySelector('#passage'));getSelection().removeAllRanges();getSelection().addRange(r);`);
    await frames(3);
    await browser.saveScreenshot(join(output,'selection-check.png'));
    await browser.waitUntil(async()=>browser.execute(()=>Boolean(document.querySelector('.contextual-ai-reader-popover'))),{timeout:60000});
    await mark('READ · Instant translation beside the webpage');await frames(3);
    const refine=browser.$('button[aria-label^="Refine translation with"]');
    if(await refine.isExisting()){
      await mark('CLICK · Refine the passage with your AI backend');await refine.click();await frames(2);
      await browser.waitUntil(async()=>browser.execute(()=>{
        const p=document.querySelector('.contextual-ai-reader-popover');return Boolean(p && !p.classList.contains('is-loading') && !p.classList.contains('is-error') && /[\u4e00-\u9fff]/.test(p.textContent||''));
      }),{timeout:120000});
      await mark('RESULT · Read the AI translation in context');await frames(4);
    }
    await finish();
    await browser.saveScreenshot(join(output,'selection-final.png'));
    await writeFile(join(output,'selection-verification.json'),JSON.stringify(await browser.execute(()=>document.querySelector('.contextual-ai-reader-popover')?.textContent),null,2));
  });
  it('records connected captions, real AI translation and timestamp seeking',async()=>{
    await browser.executeObsidian(async({app},base)=>{
      app.plugins.plugins['ai-translator-by-taoye'].hidePopup();
      app.plugins.plugins['ai-translator-by-taoye'].settings.autoTranslate=false;
      const leaf=app.workspace.getLeavesOfType('webviewer')[0];await leaf.setViewState({type:'webviewer',active:true,state:{url:base+'/watch'}});await app.workspace.revealLeaf(leaf);
    },base);
    await browser.waitUntil(async()=>{try{return Boolean(await guest('document.querySelector("video")?.textTracks[0]?.cues?.length'));}catch{return false;}},{timeout:20000});
    await begin('web-viewer-subtitles');await mark('OPEN · Watch a captioned video in Web Viewer');await frames(2);
    await browser.executeObsidian(({app})=>app.commands.executeCommandById('command-palette:open'));
    await browser.$('.prompt-input').setValue('Translate video subtitles from Web Viewer');await frames(2);
    await browser.keys('Enter');await frames(3);
    await browser.waitUntil(async()=>browser.execute(()=>Boolean(document.querySelector('.youtube-reader-web-transcript .youtube-reader-segment'))));
    expect(await browser.$('.youtube-reader-web-transcript .youtube-reader-player').isExisting()).toBe(false);
    await mark('CLICK · Translate transcript with AI');
    await browser.$('button[aria-label="Translate transcript with AI"]').click();await frames(2);
    // Record a short progress shot, then omit provider waiting time in the edited export.
    await browser.waitUntil(async()=>browser.execute(()=>Boolean(document.querySelector('.youtube-reader-translation'))),{timeout:120000});
    await mark('READ · Bilingual captions, with no duplicate video');await frames(4);
    await mark('CLICK · A timestamp seeks the original webpage video');
    const times=await browser.$$('.youtube-reader-time');await times[1].click();await frames(4);
    await finish();await browser.saveScreenshot(join(output,'subtitles-check.png'));
    const result=await browser.executeObsidian(({app})=>{const v=app.workspace.getLeavesOfType('video-player-ai-view')[0].view as any;return {text:v.containerEl.textContent,data:v.getVideoData()};});
    await writeFile(join(output,'verification.json'),JSON.stringify(result,null,2));
  });
});
