import { readdir, realpath, stat } from 'node:fs/promises';
import { basename, extname, isAbsolute, join, relative, resolve } from 'node:path';
import { randomUUID } from 'node:crypto';
import { execFile } from 'node:child_process';

export interface Episode {
  id: string; path: string; title: string; size: number; mtime: number;
  duration?: number; position: number; status: 'new' | 'watching' | 'done';
  missing?: boolean; lastWatched?: number; notePath?: string;
}
export interface Collection {
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
export function episodePath(collection: Collection, episode: Episode): string {
  const path = resolve(collection.root,episode.path);
  const rel = relative(collection.root,path);
  if (rel === '..' || rel.startsWith('../') || rel.startsWith('..\\') || isAbsolute(rel)) throw new Error('The video path is outside the playlist folder.');
  return path;
}
export async function probeDuration(path: string, command: string): Promise<number | undefined> {
  return new Promise(resolve => execFile(command,['-v','error','-show_entries','format=duration','-of','default=noprint_wrappers=1:nokey=1',path],{timeout:10000,maxBuffer:64*1024},(error,stdout)=> {
    const n = Number(stdout.trim()); resolve(!error && Number.isFinite(n) && n > 0 ? n : undefined);
  }));
}
