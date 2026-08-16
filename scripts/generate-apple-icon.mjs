/**
 * Rasterises src/app/icon.svg into the 180x180 apple-icon.png that iOS needs
 * (Apple touch icons cannot be SVG).
 *
 * One-off dev script — run it by hand and commit the PNG. Deliberately NOT part
 * of `npm run build`: sharp is only present as a transitive optional dependency
 * of Next, so a build that relied on it would break on a clean install.
 *
 *   node scripts/generate-apple-icon.mjs
 */
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const SIZE = 180;
const src = fileURLToPath(new URL("../src/app/icon.svg", import.meta.url));
const out = fileURLToPath(new URL("../src/app/apple-icon.png", import.meta.url));

const svg = await readFile(src, "utf8");

// The viewBox is what actually drives the scaling, so pinning width/height on
// the root element upscales as clean vector rather than a blurry bitmap.
const sized = svg.replace(
  "<svg xmlns",
  `<svg width="${SIZE}" height="${SIZE}" xmlns`,
);

const png = await sharp(Buffer.from(sized)).png().toBuffer();
await writeFile(out, png);

const { width, height } = await sharp(png).metadata();
console.log(`wrote ${out} (${width}x${height})`);
