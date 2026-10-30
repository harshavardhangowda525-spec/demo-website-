import { cpSync, mkdirSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const staging = join(root, '.pages-build');
const output = join(root, 'out');
// Build an isolated copy: server-only API source remains intact for Node hosting.
rmSync(staging, { recursive: true, force: true });
mkdirSync(staging, { recursive: true });
for (const name of ['app', 'components', 'lib', 'public', 'package.json', 'tsconfig.json', 'next.config.ts', 'postcss.config.mjs']) {
  cpSync(join(root, name), join(staging, name), { recursive: true });
}
rmSync(join(staging, 'app/api'), { recursive: true, force: true });
symlinkSync(join(root, 'node_modules'), join(staging, 'node_modules'), 'dir');
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '/demo-website-';
if (!/^\/[a-zA-Z0-9._-]+$/.test(basePath)) throw new Error('Invalid GitHub Pages project path');
const result = spawnSync(process.execPath, [join(root, 'node_modules/next/dist/bin/next'), 'build'], {
  cwd: staging, stdio: 'inherit',
  env: { ...process.env, PAGES_BUILD: 'true', NEXT_PUBLIC_STATIC_PREVIEW: 'true', NEXT_PUBLIC_BASE_PATH: basePath },
});
if (result.status !== 0) process.exit(result.status || 1);
rmSync(output, { recursive: true, force: true });
cpSync(join(staging, 'out'), output, { recursive: true });
writeFileSync(join(output, '.nojekyll'), '');
console.log(`GitHub Pages export ready: ${output} (base path ${basePath})`);
