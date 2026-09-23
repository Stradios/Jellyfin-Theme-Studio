#!/usr/bin/env node
import { mkdir, writeFile, readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { buildSite } from "./build-site.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const srcDir = resolve(process.cwd(), process.argv[2] || "perchance");
const outDir = resolve(process.cwd(), process.argv[3] || ".");

const generatorHtml = await readFile(join(srcDir, "index.html"), "utf8");
const generatorPjs = await readFile(join(srcDir, "main.pjs"), "utf8");
const iconSvg = await readFile(join(here, "assets", "icon.svg"), "utf8");

const files = buildSite({ generatorHtml, generatorPjs, iconSvg });
for (const [rel, content] of Object.entries(files)) {
  const target = join(outDir, rel);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, content);
  console.log("wrote " + rel + " (" + Buffer.byteLength(content) + " bytes)");
}
