// Copies MapLibre's ES modules to public/vendor, where the map loads them natively instead of from the bundle.
// The main module and its web worker both import the shared chunk, so the browser downloads it only once.
// Runs before `npm run dev` and `npm run build`; the folder name carries the version for long-term caching.
import { copyFile, mkdir, readFile, rm } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';

const require = createRequire(import.meta.url);
const packageJson = require.resolve('maplibre-gl/package.json');
const { version } = JSON.parse(await readFile(packageJson, 'utf8'));
const source = path.join(path.dirname(packageJson), 'dist');
const vendor = path.join(import.meta.dirname, '..', 'public', 'vendor');
const target = path.join(vendor, `maplibre-gl@${version}`);

await rm(vendor, { recursive: true, force: true });
await mkdir(target, { recursive: true });

for (const file of ['maplibre-gl.mjs', 'maplibre-gl-shared.mjs', 'maplibre-gl-worker.mjs']) {
  await copyFile(path.join(source, file), path.join(target, file));
}

console.info(`Copied MapLibre ${version} to ${path.relative(process.cwd(), target)}`);
