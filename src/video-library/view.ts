import { App, Component, ItemView, Modal, Notice, Plugin, Setting, TFile, WorkspaceLeaf } from 'obsidian';
import { access } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { basename, dirname } from 'node:path';
import { randomUUID } from 'node:crypto';
import { Collection, Episode, Library, applyProgress, canonicalFolder, episodePath, formatTime, ensureSources, inspectVideo, mergeFiles, mergeSource, rescanSources, nextEpisode, probeDuration, scanFolder } from './library';

const VIEW = 'video-library';
type Player = {openLocalVideoPlayer?: (path:string, start?:number)=>Promise<void>};
type PlayerView = ItemView & {getVideoData?:()=>{localPath?:string}; getCurrentTime?:()=>number};
const errorText = (e:unknown) => e instanceof Error ? e.message : String(e);

export default class VideoLibrary extends Component {
  constructor(private host:Plugin) {super();}
  get app() {return this.host.app;}
  private get dataPath() {return `${this.app.vault.configDir}/plugins/${this.host.manifest.id}/video-library.json`;}
  private async loadData():Promise<unknown> {return await this.app.vault.adapter.exists(this.dataPath) ? JSON.parse(await this.app.vault.adapter.read(this.dataPath)) as unknown : null;}
  private async saveData(data:Library) {await this.app.vault.adapter.write(this.dataPath,JSON.stringify(data,null,2));}

  data: Library = {version:1, collections:[], ffprobe: ['/opt/homebrew/bin/ffprobe','/usr/local/bin/ffprobe','/usr/bin/ffprobe'].find(p=>existsSync(p)) ?? 'ffprobe'};
  busy = new Set<string>();
  private saveQueue = Promise.resolve();
  private dirty = false;
  private disposed = false;
  private bindings = new Map<HTMLVideoElement,()=>void>();
  onload() {void this.initialize().catch(e=>new Notice(`Could not load playlists: ${errorText(e)}`));}
  private async initialize() {
    const saved = await this.loadData();
    if (saved && typeof saved==='object' && 'version' in saved && saved.version===1 && 'collections' in saved && Array.isArray(saved.collections)) this.data=saved as Library;
    for(const collection of this.data.collections)ensureSources(collection);
    if(this.disposed)return;
    this.registerEvent(this.app.vault.on('rename',(file,oldPath)=>{
      for(const c of this.data.collections) for(const e of c.episodes) if(e.notePath===oldPath || e.notePath?.startsWith(oldPath+'/')) {e.notePath=file.path+e.notePath.slice(oldPath.length);this.dirty=true;}
    }));
    this.host.registerView(VIEW, leaf=>new LibraryView(leaf,this));
    this.host.addRibbonIcon('library-big','Playlists',()=>{void this.open();});
    this.host.addCommand({id:'open-library',name:'Open playlists',callback:()=>{void this.open();}});
    this.host.addCommand({id:'add-folder',name:'Add playlist from folder',callback:()=>this.folderModal()});
    this.host.addCommand({id:'create-empty-playlist',name:'Create empty playlist',callback:()=>this.createEmptyModal()});

    this.registerInterval(window.setInterval(()=>this.attachPlayers(),1000));
    this.registerInterval(window.setInterval(()=>{if(this.dirty) void this.persist();},5000));
    this.registerEvent(this.app.workspace.on('layout-change',()=>this.attachPlayers()));
    this.app.workspace.onLayoutReady(()=>this.attachPlayers());
  }
  onunload() {
    this.disposed = true;
    for (const cleanup of this.bindings.values()) cleanup();
    this.bindings.clear();
    if(this.dirty) void this.persist();
  }
  async open() {
    const leaf = this.app.workspace.getLeavesOfType(VIEW)[0] ?? this.app.workspace.getLeaf('tab');
    await leaf.setViewState({type:VIEW,active:true});
    await this.app.workspace.revealLeaf(leaf);
  }
  persist(): Promise<void> {
    this.dirty = false;
    const snapshot = structuredClone(this.data);
    this.saveQueue = this.saveQueue.catch(()=>{}).then(()=>this.saveData(snapshot)).catch(e=>{
      this.dirty = true; new Notice(`Could not save progress: ${errorText(e)}`);
    });
    return this.saveQueue;
  }
  refresh() {
    for(const leaf of this.app.workspace.getLeavesOfType(VIEW)) if(leaf.view instanceof LibraryView) leaf.view.render();
  }
  private detachPlayers() {
    for(const cleanup of this.bindings.values())cleanup();
    this.bindings.clear();
  }
  async showCollection(collection:Collection) {
    await this.open();
    const view=this.app.workspace.getLeavesOfType(VIEW)[0]?.view;
    if(view instanceof LibraryView){view.selected=collection.id;view.render();}
  }
  createEmptyModal() {
    new PlaylistNameModal(this.app,async title=>{
      const item:Collection={id:randomUUID(),title,kind:'Other',root:'',sources:[],episodes:[]};
      this.data.collections.push(item);await this.persist();await this.showCollection(item);
    }).open();
  }
  folderModal(collection?:Collection, sourceId?:string) {
    const source=collection ? ensureSources(collection).find(s=>s.id===sourceId) : undefined;
    new FolderModal(this.app,source?.root??'',async input=>{
      const root=await canonicalFolder(input);
      const item=collection??{id:randomUUID(),root:'',title:basename(root),kind:'Course',sources:[],episodes:[]};
      await this.addFolder(item,root,sourceId);
      if(!collection){this.data.collections.push(item);await this.persist();}
      await this.showCollection(item);
    },source?'Locate folder':collection?'Add folder':'Add playlist',source?'Save folder':collection?'Add folder':'Create playlist').open();
  }
  filesModal(collection:Collection) {
    new VideoFilesModal(this.app,paths=>this.addFiles(collection,paths)).open();
  }
  private async updateCollection(collection:Collection, change:()=>Promise<void>) {
    if(this.busy.has(collection.id))throw new Error('This playlist is being updated. Please try again when it finishes.');
    this.busy.add(collection.id);this.refresh();
    // Flush live playback before replacing episode objects during a scan.
    this.detachPlayers();
    try {
      ensureSources(collection);await change();this.detachPlayers();
      await this.persist();this.attachPlayers();this.refresh();
      const pending=collection.episodes.filter(e=>!e.missing && e.duration===undefined && !collection.sources?.find(s=>s.id===e.sourceId)?.unavailable);
      let cursor=0;
      await Promise.all(Array.from({length:Math.min(3,pending.length)},async()=>{
        while(cursor<pending.length && !this.disposed){
          const e=pending[cursor++];e.duration=await probeDuration(episodePath(collection,e),this.data.ffprobe);this.dirty=true;
        }
      }));
      await this.persist();
    } finally {this.busy.delete(collection.id);this.attachPlayers();this.refresh();}
  }
  async addFolder(collection:Collection, input:string, sourceId?:string) {
    await this.updateCollection(collection,async()=>{
      const root=await canonicalFolder(input);
      const sources=ensureSources(collection);
      if(sources.some(s=>s.id!==sourceId && s.root===root))throw new Error('This folder is already in this playlist.');
      const found=await scanFolder(root);
      const existing=sources.find(s=>s.id===sourceId);
      if(sourceId && !existing)throw new Error('Source folder no longer exists.');
      const source=existing??{id:randomUUID(),root};
      // Do not silently replace another video's progress when relocating a source.
      if(existing && existing.root!==root){
        const otherPaths=new Set(collection.episodes.filter(e=>e.sourceId!==source.id).map(e=>episodePath(collection,e)));
        const prospective={...collection,sources:sources.map(s=>s.id===source.id?{...s,root}:s)};
        if(collection.episodes.filter(e=>e.sourceId===source.id).some(e=>otherPaths.has(episodePath(prospective,e))))throw new Error('This folder would overlap videos already in the playlist.');
      }
      source.root=root;source.unavailable=false;
      if(!existing)sources.push(source);
      mergeSource(collection,source,found);
      collection.root=sources[0]?.root??'';
      collection.unavailable=sources.some(s=>s.unavailable);collection.scannedAt=Date.now();
      new Notice(`Folder added: ${basename(root)}`);
    });
  }
  async addFiles(collection:Collection, inputs:string[]) {
    await this.updateCollection(collection,async()=>{
      if(!inputs.length)throw new Error('Choose at least one video.');
      // Validate the whole batch before mutating the playlist.
      const found:Episode[]=[];
      for(const input of inputs)found.push(await inspectVideo(input));
      const added=mergeFiles(collection,found);
      new Notice(`${added} video${added===1?'':'s'} added${found.length>added?'; duplicates skipped':''}.`);
    });
  }
  async scan(collection:Collection) {
    await this.updateCollection(collection,async()=>{
      const unavailable=await rescanSources(collection);
      new Notice(unavailable.length ? `Rescan finished. ${unavailable.length} folder(s) unavailable; saved progress was kept.` : 'Playlist updated.');
    });
  }
  async play(collection:Collection, episode:Episode) {
    const player=this.host as Plugin & Player;
    if(typeof player.openLocalVideoPlayer!=='function') throw new Error('The player is currently unavailable.');
    const path=episodePath(collection,episode);
    await access(path);
    episode.missing=false;
    await player.openLocalVideoPlayer(path,episode.status==='done'?0:episode.position);
    this.attachPlayers();
  }
  private attachPlayers() {
    if(this.disposed) return;
    const active=new Set<HTMLVideoElement>();
    this.app.workspace.iterateAllLeaves(leaf=>{
      const view=leaf.view as PlayerView;
      const path=view.getVideoData?.()?.localPath;
      if(!path) return;
      let match: {collection:Collection;episode:Episode}|undefined;
      for(const collection of this.data.collections) {
        const episode=collection.episodes.find(e=>episodePath(collection,e)===path);
        if(episode) {match={collection,episode};break;}
      }
      if(!match) return;
      const video=view.containerEl.querySelector('video');
      if(!video) return;
      active.add(video);
      if(this.bindings.has(video)) return;
      const {collection,episode}=match;
      const update=(ended=false)=>{
        if(video.readyState<1) return;
        for(const c of this.data.collections)for(const e of c.episodes)if(episodePath(c,e)===path && applyProgress(e,video.currentTime,video.duration,ended))this.dirty=true;
      };
      const time=()=>update();
      const flush=()=>{update();if(this.dirty) void this.persist();this.refresh();};
      const ended=()=>{
        update(true);void this.persist();this.refresh();
        const next=collection.episodes.slice(collection.episodes.indexOf(episode)+1).find(e=>!e.missing && e.status!=='done');
        const message=document.createDocumentFragment();
        message.createEl('span',{text:`Watched: ${episode.title}`});
        if(next) message.createEl('button',{text:'Play next'}).onclick=()=>{void this.play(collection,next).catch(e=>new Notice(errorText(e)));};
        new Notice(message,10000);
      };
      video.addEventListener('timeupdate',time);video.addEventListener('pause',flush);video.addEventListener('seeked',flush);video.addEventListener('ended',ended);
      this.bindings.set(video,()=>{
        update();video.removeEventListener('timeupdate',time);video.removeEventListener('pause',flush);video.removeEventListener('seeked',flush);video.removeEventListener('ended',ended);
      });
    });
    for(const [video,cleanup] of this.bindings) if(!active.has(video)) {cleanup();this.bindings.delete(video);}
  }
  async markWatched(collection:Collection, ids:ReadonlySet<string>, watched=true) {
    for(const episode of collection.episodes) {
      if(!ids.has(episode.id)) continue;
      episode.status=watched ? 'done' : 'new';
      // Historical completion does not invent a playback position or recent activity.
      if(!watched) {episode.position=0;episode.lastWatched=undefined;}
    }
    this.refresh();
    await this.persist();
  }
  async note(collection:Collection,episode:Episode) {
    let file=episode.notePath ? this.app.vault.getAbstractFileByPath(episode.notePath) : null;
    if(!(file instanceof TFile)) {
      const folder='Video Library Notes';
      if(!this.app.vault.getAbstractFileByPath(folder)) await this.app.vault.createFolder(folder);
      const safe=(s:string)=>s.replace(/[\\/:*?"<>|#[\]]/g,'-').slice(0,70);
      const stem=`${folder}/${safe(collection.title)} - ${safe(episode.title)} - ${episode.id.slice(0,8)}`;
      let path=`${stem}.md`, suffix=1;
      while(this.app.vault.getAbstractFileByPath(path)) path=`${stem}-${suffix++}.md`;
      file=await this.app.vault.create(path,`# ${episode.title}\n\nPlaylist: ${collection.title}\n\nVideo: \`${episode.path}\`\n\nDuration: ${formatTime(episode.duration)}\n\n## Notes\n\n`);
      episode.notePath=path;await this.persist();
    }
    if(file instanceof TFile) await this.app.workspace.getLeaf('tab').openFile(file);
  }
}

class LibraryView extends ItemView {
  selected?:string;
  query='';
  private checked = new Set<string>();
  constructor(leaf:WorkspaceLeaf,private plugin:VideoLibrary){super(leaf);}
  getViewType(){return VIEW;}
  getDisplayText(){return 'Playlists';}
  getIcon(){return 'library-big';}
  async onOpen(){this.render();}
  private button(parent:HTMLElement,text:string,action:()=>unknown,cls?:string) {
    const b=parent.createEl('button',{text,cls});
    b.onclick=()=>{Promise.resolve().then(action).catch(e=>new Notice(errorText(e)));};return b;
  }
  render() {
    const el=this.contentEl; const scroll=el.scrollTop;el.empty();el.addClass('vl');
    const collection=this.plugin.data.collections.find(c=>c.id===this.selected);
    const head=el.createDiv({cls:'vl-header'});
    const title=head.createDiv();title.createDiv({text:'LOCAL VIDEO PLAYLISTS',cls:'vl-eyebrow'});
    title.createEl('h1',{text:collection?.title??'My playlists'});
    title.createEl('p',{text:collection?'Your videos, viewing progress, and notes in one place.':'Organize videos from any location and pick up where you left off.',cls:'vl-muted'});
    const actions=head.createDiv({cls:'vl-toolbar'});
    this.button(actions,'＋ Add playlist',()=>this.plugin.folderModal(),'mod-cta');
    this.button(actions,'Create empty playlist',()=>this.plugin.createEmptyModal());
    if(collection) this.renderCollection(el,collection);
    else this.renderShelf(el);
    el.scrollTop=scroll;
  }
  private renderShelf(el:HTMLElement) {
    const all=this.plugin.data.collections;
    const recent=all.flatMap(c=>c.episodes.filter(e=>e.lastWatched&&!e.missing).map(e=>({c,e}))).sort((a,b)=>(b.e.lastWatched??0)-(a.e.lastWatched??0))[0];
    if(recent){
      const panel=el.createDiv({cls:'vl-resume'});panel.createDiv({text:'Recently watched',cls:'vl-eyebrow'});
      panel.createEl('h2',{text:recent.c.title});panel.createEl('p',{text:`${recent.e.title} · ${formatTime(recent.e.position)}`});
      this.button(panel,'Continue watching',()=>this.plugin.play(recent.c,nextEpisode(recent.c)??recent.e),'mod-cta');
    }
    const search=el.createEl('input',{type:'search',placeholder:'Search playlists…',cls:'vl-search'});search.value=this.query;
    const grid=el.createDiv({cls:'vl-grid'});
    const cards=()=>{
      grid.empty();
      for(const c of all.filter(c=>c.title.toLocaleLowerCase().includes(this.query.toLocaleLowerCase()))) {
        const card=grid.createDiv({cls:'vl-card'});
        card.createDiv({text:c.kind,cls:'vl-tag'});
        this.button(card,c.title,()=>{this.selected=c.id;this.render();},'vl-title');
        this.stats(card,c);
        const next=nextEpisode(c);
        card.createEl('p',{text:next?`Up next: ${next.title}`:c.episodes.length?'All watched':'No videos yet',cls:'vl-muted'});
        if(c.unavailable)card.createEl('p',{text:'Folder unavailable',cls:'vl-warning'});
        if(next)this.button(card,'Continue watching',()=>this.plugin.play(c,next));
        this.button(card,'View playlist',()=>{this.selected=c.id;this.render();});
      }
      if(!grid.childElementCount)grid.createEl('p',{text:all.length?'No matching playlists.':'No playlists yet. Start with a folder or create an empty playlist and add videos from any location.',cls:'vl-empty'});
    };
    search.oninput=()=>{this.query=search.value;cards();};cards();
    const settings=el.createEl('details',{cls:'vl-chapter'});settings.createEl('summary',{text:'Duration settings'});
    new Setting(settings).setName('ffprobe path').setDesc('Read durations automatically. Unavailable durations are filled in during playback.').addText(t=>t.setValue(this.plugin.data.ffprobe).onChange(v=>{this.plugin.data.ffprobe=v.trim()||'ffprobe';void this.plugin.persist();}));
  }
  private stats(el:HTMLElement,c:Collection) {
    const existing=c.episodes.filter(e=>!e.missing), done=existing.filter(e=>e.status==='done').length;
    const unknown=existing.filter(e=>e.duration===undefined).length;
    el.createEl('p',{text:`${existing.length} videos · ${unknown?'Known duration':'Total duration'} ${formatTime(existing.reduce((n,e)=>n+(e.duration??0),0))}${unknown?` · ${unknown} durations unknown`:''}`});
    const progress=el.createEl('progress');progress.max=existing.length||1;progress.value=done;progress.setAttribute('aria-label','Playlist completion');
    el.createDiv({text:`Completed ${done} / ${existing.length} videos`,cls:'vl-muted'});
  }
  private renderCollection(el:HTMLElement,c:Collection) {
    const validIds=new Set(c.episodes.map(e=>e.id));
    this.checked=new Set([...this.checked].filter(id=>validIds.has(id)));
    const toolbar=el.createDiv({cls:'vl-toolbar'});
    this.button(toolbar,'← All playlists',()=>{this.selected=undefined;this.render();});
    const scanning=this.plugin.busy.has(c.id);
    this.button(toolbar,scanning?'Scanning…':'Rescan',()=>this.plugin.scan(c)).disabled=scanning;
    this.button(toolbar,'Add folder',()=>this.plugin.folderModal(c)).disabled=scanning;
    this.button(toolbar,'Add videos',()=>this.plugin.filesModal(c),'mod-cta').disabled=scanning;
    this.button(toolbar,'Edit playlist',()=>new EditModal(this.app,c,async()=>{await this.plugin.persist();this.render();}).open());
    this.button(toolbar,'Remove playlist',()=>new ConfirmModal(this.app,'Remove this playlist and its progress? Your video and note files will be kept.',async()=>{
      this.plugin.data.collections=this.plugin.data.collections.filter(x=>x.id!==c.id);await this.plugin.persist();this.selected=undefined;this.render();
    }).open()).disabled=scanning;
    for(const source of ensureSources(c)) {
      const row=el.createDiv({cls:'vl-source'});
      row.createSpan({text:source.root+(source.unavailable?' · Unavailable':''),cls:'vl-path'});
      this.button(row,'Locate folder',()=>this.plugin.folderModal(c,source.id)).disabled=scanning;
    }
    this.stats(el,c);
    if(c.unavailable)el.createEl('p',{text:'Folder unavailable. Reconnect it and try again, or locate the folder.',cls:'vl-warning'});
    if(scanning)el.createEl('p',{text:'Reading videos and durations… You can browse other playlists while this runs.',cls:'vl-muted'});
    const next=nextEpisode(c);if(next)this.button(el,`Continue watching · ${next.title}`,()=>this.plugin.play(c,next),'mod-cta');
    if(!c.episodes.length)el.createEl('p',{text:'No videos yet. Use Add videos or Add folder to build this playlist from any location.',cls:'vl-empty'});
    if(c.episodes.length) {
      const bulk=el.createDiv({cls:'vl-toolbar vl-bulk'});
      const label=bulk.createEl('label',{cls:'vl-select-all'});
      const selectAll=label.createEl('input',{type:'checkbox',attr:{'aria-label':'Select all videos'}});
      selectAll.checked=this.checked.size===c.episodes.length;
      selectAll.indeterminate=this.checked.size>0 && !selectAll.checked;
      label.createSpan({text:'Select all'});
      selectAll.onchange=()=>{this.checked=selectAll.checked?new Set(c.episodes.map(e=>e.id)):new Set();this.render();};
      bulk.createSpan({text:`${this.checked.size} selected`,cls:'vl-muted',attr:{'aria-live':'polite'}});
      this.button(bulk,'Mark as watched',()=>this.plugin.markWatched(c,this.checked),'mod-cta').disabled=!this.checked.size;
      this.button(bulk,'Mark as unwatched',()=>this.plugin.markWatched(c,this.checked,false)).disabled=!this.checked.size;
    }
    const groupKey=(e:Episode)=>e.absolutePath?'manual':`${e.sourceId??'primary'}:${dirname(e.path)}`;
    const groups=new Map<string,Episode[]>();
    for(const e of c.episodes){const key=groupKey(e);const items=groups.get(key)??[];items.push(e);groups.set(key,items);}
    for(const [chapter,episodes] of groups) {
      const details=el.createEl('details',{cls:'vl-chapter'});details.open=true;
      const first=episodes[0];const source=c.sources?.find(s=>s.id===first.sourceId);
      const folder=dirname(first.path);
      const label=first.absolutePath?'Added videos':`${source?basename(source.root):'Videos'}${folder!=='.'?' / '+folder:''}`;
      details.createEl('summary',{text:`${label} · ${episodes.length} videos`});
      for(const e of episodes){
        const row=details.createDiv({cls:'vl-row'});
        const check=row.createEl('input',{type:'checkbox',cls:'vl-select-video',attr:{'aria-label':`Select ${e.title}`}});
        check.checked=this.checked.has(e.id);
        check.onchange=()=>{if(check.checked)this.checked.add(e.id);else this.checked.delete(e.id);this.render();};
        const info=row.createDiv({cls:'vl-episode'});this.button(info,e.title,()=>this.plugin.play(c,e),'vl-episode-title').disabled=!!e.missing;
        info.title=episodePath(c,e);
        if(e.absolutePath)info.createDiv({text:dirname(e.absolutePath),cls:'vl-path'});
        info.createDiv({text:`${formatTime(e.duration)}${e.position?` · Resume at ${formatTime(e.position)}`:''}${e.missing?' · File missing':''}`,cls:'vl-muted'});
        const status=row.createEl('select',{attr:{'aria-label':`${e.title} watch status`}});
        for(const [value,text] of [['new','Not started'],['watching','In progress'],['done','Watched']])status.createEl('option',{value,text});
        status.value=e.status;status.onchange=()=>{e.status=status.value as Episode['status'];if(e.status==='new'){e.position=0;e.lastWatched=undefined;}void this.plugin.persist();this.render();};
        this.button(row,e.status==='done'?'Watched':'Mark watched',()=>this.plugin.markWatched(c,new Set([e.id])),'vl-mark-watched').disabled=e.status==='done';
        this.button(row,e.notePath?'Open note':'Add note',()=>this.plugin.note(c,e));
        const idx=c.episodes.indexOf(e);
        const move=(offset:number)=>{const target=c.episodes[idx+offset];if(!target||groupKey(target)!==chapter)return;[c.episodes[idx],c.episodes[idx+offset]]=[target,e];c.manualOrder=true;void this.plugin.persist();this.render();};
        this.button(row,'↑',()=>move(-1)).setAttribute('aria-label',`${e.title} Move up`);
        this.button(row,'↓',()=>move(1)).setAttribute('aria-label',`${e.title} Move down`);
      }
    }
  }
}
class FolderModal extends Modal {
  constructor(app:App,private initial:string,private submit:(path:string)=>Promise<void>,private label='Add playlist',private action='Create playlist'){super(app);}
  onOpen(){
    this.titleEl.setText(this.label);
    this.contentEl.createEl('p',{text:'Choose any local folder. Subfolders become chapters. Videos stay in their original location.'});
    const input=this.contentEl.createEl('input',{type:'text',placeholder:'/Users/you/Videos/My playlist',cls:'vl-path-input'});input.value=this.initial;
    const browse=this.contentEl.createEl('button',{text:'Choose folder…'});
    browse.onclick=()=>{
      const picker=document.createElement('input');picker.type='file';picker.setAttribute('webkitdirectory','');
      picker.onchange=()=>{
        const file=picker.files?.[0];if(!file)return;
        const electron=(window as Window & {require?:(id:string)=>{webUtils?:{getPathForFile:(f:File)=>string}}}).require?.('electron');
        const path=electron?.webUtils?.getPathForFile(file) || (file as File & {path?:string}).path;
        if(!path){new Notice('Could not read the folder path. Please paste its absolute path.');return;}
        const relative=file.webkitRelativePath.split('/');let root=path;
        for(let i=1;i<relative.length;i++)root=dirname(root);
        input.value=root;
      };picker.click();
    };
    const error=this.contentEl.createEl('p',{cls:'vl-warning'});
    const add=this.contentEl.createEl('button',{text:this.action,cls:'mod-cta'});
    add.onclick=async()=>{add.disabled=true;error.setText('Scanning…');try{await this.submit(input.value);this.close();}catch(e){error.setText(errorText(e));add.disabled=false;}};
    input.focus();
  }
}
class ConfirmModal extends Modal {
  constructor(app:App,private text:string,private action:()=>Promise<void>){super(app);}
  onOpen(){this.contentEl.createEl('p',{text:this.text});const b=this.contentEl.createEl('button',{text:'Remove playlist',cls:'mod-warning'});b.onclick=()=>{void this.action().then(()=>this.close()).catch(e=>new Notice(errorText(e)));};}
}
class EditModal extends Modal {
  constructor(app:App,private c:Collection,private save:()=>Promise<void>){super(app);}
  onOpen(){let title=this.c.title,kind=this.c.kind;this.titleEl.setText('Edit playlist');new Setting(this.contentEl).setName('Name').addText(t=>t.setValue(title).onChange(v=>title=v));new Setting(this.contentEl).setName('Type').addDropdown(d=>d.addOptions({'Course':'Course','TV series':'TV series','Documentary':'Documentary','Other':'Other'}).setValue(kind).onChange(v=>kind=v));new Setting(this.contentEl).addButton(b=>b.setButtonText('Save').setCta().onClick(async()=>{if(!title.trim())return;this.c.title=title.trim();this.c.kind=kind;await this.save();this.close();}));}
}

class PlaylistNameModal extends Modal {
  constructor(app:App,private submit:(title:string)=>Promise<void>){super(app);}
  onOpen(){
    this.titleEl.setText('Create empty playlist');
    const input=this.contentEl.createEl('input',{type:'text',cls:'vl-path-input',placeholder:'Playlist name',attr:{'aria-label':'Playlist name'}});
    const error=this.contentEl.createEl('p',{cls:'vl-warning'});
    const button=this.contentEl.createEl('button',{text:'Create playlist',cls:'mod-cta'});
    button.onclick=async()=>{
      if(!input.value.trim()){error.setText('Enter a playlist name.');return;}
      button.disabled=true;
      try{await this.submit(input.value.trim());this.close();}catch(e){error.setText(errorText(e));button.disabled=false;}
    };
    input.focus();
  }
}
class VideoFilesModal extends Modal {
  constructor(app:App,private submit:(paths:string[])=>Promise<void>){super(app);}
  onOpen(){
    this.titleEl.setText('Add videos');
    this.contentEl.createEl('p',{text:'Select videos from any location. You can choose files several times, or paste one absolute file path per line. Original files are not moved.'});
    const paths=this.contentEl.createEl('textarea',{cls:'vl-video-paths',attr:{'aria-label':'Video file paths',rows:'6'},placeholder:'/path/to/lesson.mp4\n/another/folder/bonus.mp4'});
    const error=this.contentEl.createEl('p',{cls:'vl-warning'});
    const browse=this.contentEl.createEl('button',{text:'Choose videos…'});
    browse.onclick=()=>{
      const picker=this.contentEl.createEl('input',{type:'file',attr:{multiple:'',accept:'.mp4,.m4v,.mov,.webm,.mkv,.avi,.ogv,.ogg,.mpeg,.mpg,.ts,.m2ts',hidden:''}});
      picker.onchange=()=>{
        const electron=(window as Window & {require?:(id:string)=>{webUtils?:{getPathForFile:(f:File)=>string}}}).require?.('electron');
        const picked=Array.from(picker.files??[]).map(file=>electron?.webUtils?.getPathForFile(file)||(file as File & {path?:string}).path);
        if(picked.some(p=>!p)){error.setText('Could not read a file path. Please paste its absolute path.');picker.remove();return;}
        paths.value=[...new Set([...paths.value.split('\n').filter(p=>p.trim()),...picked.filter((p):p is string=>!!p)])].join('\n');
        picker.remove();
      };picker.click();
    };
    const button=this.contentEl.createEl('button',{text:'Add videos',cls:'mod-cta'});
    button.onclick=async()=>{
      button.disabled=true;error.setText('Adding videos…');
      try{await this.submit(paths.value.split('\n').map(p=>p.trim()).filter(Boolean));this.close();}
      catch(e){error.setText(errorText(e));button.disabled=false;}
    };
  }
}
