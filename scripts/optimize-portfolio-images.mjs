import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const files = [1, 2, 3].map((n) => path.join(root, "public", "images", `portfolio-column-${n}.jpg`));

for (const file of files) {
  try {
    const metadata = await sharp(file).metadata();
    if (!metadata.width || metadata.width <= 256) {
      console.log(`[portfolio] skip ${path.basename(file)} (${metadata.width ?? "unknown"}px wide)`);
      continue;
    }

    const temp = `${file}.optimized`;
    await sharp(file)
      .resize({ width: 256, withoutEnlargement: true })
      .jpeg({ quality: 72, progressive: true })
      .toFile(temp);

    await fs.rename(temp, file);
    const optimized = await sharp(file).metadata();
    console.log(`[portfolio] ${path.basename(file)}: ${metadata.width}x${metadata.height} -> ${optimized.width}x${optimized.height}`);
  } catch (error) {
    console.warn(`[portfolio] unable to optimize ${path.basename(file)}; keeping original`, error);
  }
}
