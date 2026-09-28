/** Obsidian installs its DOM helpers in each workspace window, including popouts. */
interface Window {
  createEl: typeof createEl;
  createDiv: typeof createDiv;
  createSpan: typeof createSpan;
}
