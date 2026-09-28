import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm, rename, symlink } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { applyProgress, scanFolder, mergeScan, nextEpisode, probeDuration, episodePath, Collection, Episode } from '../../src/video-library/library';
const episode = (path='01.mp4'):Episode=>({id:path,path,title:path,size:10,mtime:1,position:0,status:'new'});
const collection = (episodes:Episode[]):Collection=>({id:'a',title:'课程',kind:'课程',root:'/tmp/videos',episodes});
test('recursive natural ordering, ignores hidden files and symlink cycles',async()=>{
 const root=await mkdtemp(join(tmpdir(),'library-test-'));
 try {
  await mkdir(join(root,'第一章'));await mkdir(join(root,'.hidden'));
  for(const path of ['第一章/10.mp4','第一章/2.mp4','.hidden/1.mp4','notes.txt'])await writeFile(join(root,path),'');
  await symlink(root,join(root,'第一章','loop'));
  const found=await scanFolder(root);assert.deepEqual(found.map(e=>e.path),['第一章/2.mp4','第一章/10.mp4']);
 }finally{await rm(root,{recursive:true,force:true});}
});
test('rescan preserves progress, missing records, note links and custom order',()=>{
 const a={...episode('2.mp4'),position:23,status:'watching' as const,notePath:'notes/a.md',duration:100};
 const b=episode('10.mp4');
 const result=mergeScan([b,a],[episode('2.mp4'),episode('3.mp4')],true);
 assert.equal(result[0].id,b.id);assert.equal(result[0].missing,true);
 assert.equal(result[1].position,23);assert.equal(result[1].notePath,'notes/a.md');assert.equal(result[1].duration,100);
 assert.equal(result[2].path,'3.mp4');
 const restored=mergeScan(result,[episode('10.mp4'),episode('2.mp4')]);assert.equal(restored.find(e=>e.id===b.id)?.missing,false);
});
test('relocation keeps relative identities, failures do not erase data',async()=>{
 const root=await mkdtemp(join(tmpdir(),'library-test-'));const moved=root+'-moved';
 try{await writeFile(join(root,'1.mp4'),'');const before=await scanFolder(root);before[0].position=45;
 await rename(root,moved);await assert.rejects(scanFolder(root));const after=mergeScan(before,await scanFolder(moved));assert.equal(after[0].position,45);assert.equal(after[0].id,before[0].id);
 }finally{await rm(moved,{recursive:true,force:true});await rm(root,{recursive:true,force:true});}
});
test('seeking near end is not completion; ended completes and invalid times cannot corrupt state',()=>{
 const e=episode();applyProgress(e,99,100);assert.equal(e.status,'watching');applyProgress(e,100,100,true);assert.equal(e.status,'done');
 applyProgress(e,NaN,Infinity);assert.equal(e.position,100);applyProgress(e,10,100);assert.equal(e.status,'done');
});
test('continue picks last in-progress available video then first unfinished',()=>{
 const a={...episode('1.mp4'),status:'done' as const};const b={...episode('2.mp4'),status:'watching' as const,lastWatched:2};
 const c={...episode('3.mp4'),status:'watching' as const,lastWatched:3,missing:true};assert.equal(nextEpisode(collection([a,b,c]))?.id,b.id);
 b.status='done' as any;assert.equal(nextEpisode(collection([a,b,c])),undefined);
});
test('duration failures remain unknown and path escape is rejected',async()=>{
 assert.equal(await probeDuration('/does-not-exist','/does-not-exist'),undefined);
 assert.throws(()=>episodePath(collection([]),episode('../outside.mp4')));
});
