import { cp, mkdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'vite';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');

await rm(dist, { recursive: true, force: true });
await build({
  root,
  build: {
    outDir: path.join(dist, 'client'),
    emptyOutDir: false,
  },
});

await mkdir(path.join(dist, 'server'), { recursive: true });
await mkdir(path.join(dist, '.openai'), { recursive: true });
await Promise.all([
  cp(path.join(root, 'worker/sites-static.js'), path.join(dist, 'server/index.js')),
  cp(path.join(root, '.openai/hosting.json'), path.join(dist, '.openai/hosting.json')),
]);

console.log(`Sites build ready: ${dist}`);
