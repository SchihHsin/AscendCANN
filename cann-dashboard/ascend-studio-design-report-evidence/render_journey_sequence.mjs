import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createAvatar } from '@dicebear/core';
import { personas } from '@dicebear/collection';

const here = dirname(fileURLToPath(import.meta.url));
const packageDir = resolve(here, 'node_modules/beautiful-mermaid');
const libraryPath = resolve(packageDir, 'dist/index.js');
const libraryOutput = resolve(packageDir, 'dist/ascend-report-layout.js');
let librarySource = readFileSync(libraryPath, 'utf8');

// beautiful-mermaid exposes the sequence layout constants only inside its renderer;
// tune spacing and label size in a generated copy while leaving the installed package untouched.
const layoutTuning = [
  ['actorGap: 140,', 'actorGap: 94,'],
  ['messageRowHeight: 40,', 'messageRowHeight: 140,'],
  ['edgeLabel: 11,', 'edgeLabel: 26,'],
];
for (const [from, to] of layoutTuning) {
  if (!librarySource.includes(from)) throw new Error(`beautiful-mermaid layout token not found: ${from}`);
  librarySource = librarySource.replace(from, to);
}
writeFileSync(libraryOutput, librarySource);

const { renderMermaidSVG } = await import(`${pathToFileURL(libraryOutput).href}?v=${Date.now()}`);
const source = readFileSync(resolve(here, 'journey-sequence.mmd'), 'utf8');
const svg = renderMermaidSVG(source, {
  bg: '#ffffff',
  fg: '#354052',
  line: '#9aa5b5',
  accent: '#6563b7',
  muted: '#657184',
  surface: '#f7f8fb',
  border: '#d9dee7',
  font: 'Arial',
  transparent: true,
  padding: 24,
});
writeFileSync(resolve(here, 'journey-sequence.svg'), svg);

const avatar = (seed, clothingColor) => createAvatar(personas, {
  seed,
  backgroundColor: ['e8edf7'],
  clothingColor: [clothingColor],
  eyes: ['open'],
  hair: ['shortCombover'],
  mouth: ['smile'],
  facialHairProbability: 0,
  radius: 50,
}).toString();
writeFileSync(resolve(here, 'persona-task.svg'), avatar('ascend-task-developer', '4c82bd'));
writeFileSync(resolve(here, 'persona-learning.svg'), avatar('ascend-learning-developer', '8872bd'));

console.log('Rendered the unified role sequence and two developer avatars.');
