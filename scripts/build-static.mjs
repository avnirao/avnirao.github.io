// Builds the site into `docs/` so GitHub Pages can serve it with
// "Deploy from a branch" (main / /docs). Run via: bun run build:static
//
// Produces (all committed to the repo):
//   docs/index.html   - the root file GitHub Pages serves
//   docs/404.html     - same shell, so deep links / refreshes work
//   docs/assets/      - hashed JS + CSS
//   docs/.nojekyll    - stops Jekyll from stripping asset folders
//
// It intentionally does NOT write to the repo root: a root-level `assets/`
// folder gets swept into the normal app build and breaks it.
import { cp, rm, mkdir, rename, copyFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const source = path.join(root, "dist-static", "client");
const target = path.join(root, "docs");

if (!existsSync(source)) {
  console.error(`[static] Missing build output at ${source}. Did the vite build fail?`);
  process.exit(1);
}

await rm(target, { recursive: true, force: true });
await mkdir(target, { recursive: true });
await cp(source, target, { recursive: true });

const shell = path.join(target, "_shell.html");
const indexHtml = path.join(target, "index.html");

if (existsSync(shell)) {
  await rename(shell, indexHtml);
} else if (!existsSync(indexHtml)) {
  console.error("[static] No _shell.html or index.html was produced.");
  process.exit(1);
}

await copyFile(indexHtml, path.join(target, "404.html"));
await writeFile(path.join(target, ".nojekyll"), "");

await rm(path.join(root, "dist-static"), { recursive: true, force: true });

console.log("[static] docs/ ready for GitHub Pages (index.html, 404.html, .nojekyll)");
