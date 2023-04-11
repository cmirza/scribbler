import chokidar from "chokidar";
import { invalidateCache, cacheDir } from "./cache";
import { extractMetadata } from "./metadata";
import path from "path";
import fs from "fs-extra";
import slugify from "slugify";

const postsDir = path.join(__dirname, "..", "..", "posts");
const fileToSlugMap: { [filePath: string]: string } = {};

async function updateFileToSlugMap(filePath: string) {
  const content = await fs.readFile(filePath, "utf-8");
  const metadata = extractMetadata(content);
  if (metadata.title) {
    const slug = slugify(metadata.title, { lower: true, strict: true });
    fileToSlugMap[filePath] = slug;
  } else {
    console.log(`Skipping empty or invalid file: ${filePath}`);
  }
}

async function initializeFileToSlugMap() {
  const files = await fs.readdir(postsDir);
  for (const file of files) {
    const filePath = path.join(postsDir, file);
    const stat = await fs.stat(filePath);
    if (stat.isFile()) {
      await updateFileToSlugMap(filePath);
    }
  }
}

export async function watchForChanges() {
  await initializeFileToSlugMap();

  const watcher = chokidar.watch(`${postsDir}/**/*.md`, {
    persistent: true,
    ignoreInitial: true,
  });

  watcher.on("all", async (event, filePath) => {
    if (event === "add" || event === "change") {
      const oldSlug = fileToSlugMap[filePath];
      await updateFileToSlugMap(filePath);
      const newSlug = fileToSlugMap[filePath];

      if (event === "change" && oldSlug !== newSlug) {
        console.log(`Slug changed, invalidating cache for ${oldSlug}`);
        invalidateCache(oldSlug);
      }
    } else if (event === "unlink") {
      const slug = fileToSlugMap[filePath];
      console.log(`File removed, invalidating cache for ${slug}`);
      invalidateCache(slug);
      delete fileToSlugMap[filePath];
    }

    console.log(`Changes detected in posts directory, invalidating index.`);
    invalidateCache("index");
  });
}
