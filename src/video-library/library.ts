import { readdir, realpath, stat } from 'node:fs/promises';
import { basename, extname, isAbsolute, join, relative, resolve } from 'node:path';
import { randomUUID } from 'node:crypto';
import { execFile } from 'node:child_process';

export interface Episode {
  sourceId?: string; absolutePath?: string;
  id: string; path: string; title: string; size: number; mtime: number;
  duration?: number; position: number; status: 'new' | 'watching' | 'done';
  missing?: boolean; lastWatched?: number; notePath?: string;
}
export interface FolderSource { id: string; root: string; unavailable?: boolean }
export interface Collection {
  sources?: FolderSource[];
  id: string; title: string; root: string; kind: string; episodes: Episode[];
  unavailable?: boolean; scannedAt?: number; manualOrder?: boolean;
}
export interface Library { version: 1; collections: Collection[]; ffprobe: string }
export const VIDEO = /\.(mp4|m4v|mov|webm|mkv|avi|ogv|ogg|mpeg|mpg|ts|m2ts)$/i;
const natural = new Intl.Collator(undefined, {numeric:true, sensitivity:'base'});
export function formatTime(seconds?: number): string {
  if (seconds === undefined || !Number.isFinite(seconds)) return 'Duration unknown';
  const s = Math.max(0, Math.floor(seconds));
  return s >= 3600 ? `${Math.floor(s/3600)}:${String(Math.floor(s/60)%60).padStart(2,'0')}:${String(s%60).padStart(2,'0')}` : `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;
}
export function nextEpisode(collection: Collection): Episode | undefined {
  const available = collection.episodes.filter(e => !e.missing);
  return available.filter(e => e.status === 'watching').sort((a,b)=>(b.lastWatched??0)-(a.lastWatched??0))[0] ?? available.find(e=>e.status !== 'done');
}
export function applyProgress(episode: Episode, position: number, duration: number, ended = false): boolean {
  if (!Number.isFinite(position) || position < 0) return false;
  const validDuration = Number.isFinite(duration) && duration > 0;
  const next = validDuration ? Math.min(position,duration) : position;
  const status = ended ? 'done' : episode.status === 'done' ? 'done' : next > 0 ? 'watching' : episode.status;
  const changed = episode.position !== next || episode.status !== status || (validDuration && episode.duration !== duration);
  if (changed) {
    episode.position = next; episode.status = status;
    if (validDuration) episode.duration = duration;
    episode.lastWatched = Date.now();
  }
  return changed;
}
export async function scanFolder(root: string): Promise<Episode[]> {
  if (!isAbsolute(root)) throw new Error('Enter the absolute path to a folder.');
  if (!(await stat(root)).isDirectory()) throw new Error('Choose a folder.');
  const episodes: Episode[] = [];
  async function walk(directory: string) {
    for (const entry of await readdir(directory,{withFileTypes:true})) {
      if (entry.name.startsWith('.')) continue;
      const path = join(directory,entry.name);
      if (entry.isDirectory()) await walk(path);
      else if (entry.isFile() && VIDEO.test(entry.name)) {
        const info = await stat(path);
        episodes.push({id:randomUUID(),path:relative(root,path),title:basename(path,extname(path)),size:info.size,mtime:info.mtimeMs,position:0,status:'new'});
      }
    }
  }
  await walk(root);
  return episodes.sort((a,b)=>natural.compare(a.path,b.path));
}
// Exact relative paths survive root relocation. Missing records stay recoverable;
// file sizes alone never establish identity after a rename.
export function mergeScan(previous: Episode[], found: Episode[], manual = false): Episode[] {
  const old = new Map(previous.map(e=>[e.path,e]));
  const merged = found.map(e=> {
    const prior = old.get(e.path);
    if (!prior) return e;
    old.delete(e.path);
    const changed = prior.size !== e.size || prior.mtime !== e.mtime;
    return {...prior,size:e.size,mtime:e.mtime,missing:false,duration:changed ? undefined : prior.duration};
  });
  merged.push(...[...old.values()].map(e=>({...e,missing:true})));
  if (manual) {
    const order = new Map(previous.map((e,i)=>[e.id,i]));
    merged.sort((a,b)=>(order.get(a.id)??Infinity)-(order.get(b.id)??Infinity));
  } else merged.sort((a,b)=>natural.compare(a.path,b.path));
  return merged;
}
export async function canonicalFolder(input:string): Promise<string> {
  const root = await realpath(input.trim().replace(/^"(.*)"$/,'$1'));
  if (!(await stat(root)).isDirectory()) throw new Error('Choose a folder.');
  return root;
}
// Older playlists retain their IDs, order, notes and progress. The old root remains
// as a compatibility field; source IDs determine ownership for all new scans.
export function ensureSources(collection: Collection): FolderSource[] {
  if (!collection.sources) {
    collection.sources = collection.root ? [{id:'primary', root:collection.root}] : [];
    for (const episode of collection.episodes) {
      if (!episode.absolutePath && !episode.sourceId && collection.root) episode.sourceId='primary';
    }
  }
  return collection.sources;
}
export function episodePath(collection: Collection, episode: Episode): string {
  if (episode.absolutePath) {
    if (!isAbsolute(episode.absolutePath)) throw new Error('Expected an absolute video path.');
    return episode.absolutePath;
  }
  const root = episode.sourceId ? collection.sources?.find(s=>s.id===episode.sourceId)?.root : collection.root;
  if (!root) throw new Error('The video folder is not configured.');
  const path = resolve(root,episode.path);
  const rel = relative(root,path);
  if (rel === '..' || rel.startsWith('../') || rel.startsWith('..\\') || isAbsolute(rel)) throw new Error('The video path is outside its source folder.');
  return path;
}
export async function inspectVideo(input: string): Promise<Episode> {
  const path=await realpath(input.trim().replace(/^"(.*)"$/,'$1'));
  const info=await stat(path);
  if (!info.isFile() || !VIDEO.test(path)) throw new Error(`Choose a supported video file: ${basename(path)}`);
  return {id:randomUUID(),absolutePath:path,path:basename(path),title:basename(path,extname(path)),size:info.size,mtime:info.mtimeMs,position:0,status:'new'};
}
export function mergeFiles(collection:Collection, found:Episode[]): number {
  const paths=new Map(collection.episodes.map(e=>[episodePath(collection,e),e]));
  let added=0;
  for (const file of found) {
    const path=episodePath(collection,file);
    const previous=paths.get(path);
    if(previous) {
      if(previous.size!==file.size || previous.mtime!==file.mtime) previous.duration=undefined;
      previous.size=file.size;previous.mtime=file.mtime;previous.missing=false;
    } else {collection.episodes.push(file);paths.set(path,file);added++;}
  }
  return added;
}
export function mergeSource(collection:Collection, source:FolderSource, found:Episode[]): void {
  const other=collection.episodes.filter(e=>e.sourceId!==source.id);
  const paths=new Set(other.map(e=>episodePath(collection,e)));
  const candidates=found.map(e=>({...e,sourceId:source.id})).filter(e=>!paths.has(episodePath(collection,e)));
  const merged=mergeScan(collection.episodes.filter(e=>e.sourceId===source.id),candidates,collection.manualOrder);
  // Keep source groups in place when refreshing; append new groups at the end.
  const first=collection.episodes.findIndex(e=>e.sourceId===source.id);
  const index=first<0?other.length:collection.episodes.slice(0,first).filter(e=>e.sourceId!==source.id).length;
  other.splice(index,0,...merged);collection.episodes=other;
}
export async function rescanSources(collection:Collection):Promise<string[]> {
  const errors:string[]=[];
  for(const source of ensureSources(collection)) {
    try {mergeSource(collection,source,await scanFolder(source.root));source.unavailable=false;}
    catch {source.unavailable=true;errors.push(source.root);}
  }
  for(const episode of collection.episodes.filter(e=>e.absolutePath)) {
    try {
      const info=await stat(episodePath(collection,episode));
      episode.missing=!info.isFile();
      if(episode.size!==info.size || episode.mtime!==info.mtimeMs)episode.duration=undefined;
      episode.size=info.size;episode.mtime=info.mtimeMs;
    } catch {episode.missing=true;}
  }
  collection.unavailable=collection.sources?.some(s=>s.unavailable)??false;
  collection.scannedAt=Date.now();
  return errors;
}
export async function probeDuration(path: string, command: string): Promise<number | undefined> {
  return new Promise(resolve => execFile(command,['-v','error','-show_entries','format=duration','-of','default=noprint_wrappers=1:nokey=1',path],{timeout:10000,maxBuffer:64*1024},(error,stdout)=> {
    const n = Number(stdout.trim()); resolve(!error && Number.isFinite(n) && n > 0 ? n : undefined);
  }));
}
