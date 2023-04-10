import fs from 'fs-extra';
import path from 'path';
import beautify from 'js-beautify';

const cacheDir = path.join(__dirname, '..', '..', 'cache');
const inMemoryCache: { [key: string]: { html: string; timeout: NodeJS.Timeout } } = {};
const inMemoryCacheExpirationTime = 5 * 60 * 1000; // 5 minutes in milliseconds

function saveToInMemoryCache(slug: string, html: string): void {
  console.log(`Saving post "${slug}" to in-memory cache.`);
  inMemoryCache[slug] = {
    html,
    timeout: setTimeout(() => {
      delete inMemoryCache[slug];
    }, inMemoryCacheExpirationTime),
  };
}

export async function savePostToCache(slug: string, html: string): Promise<void> {
  // Save post to in-memory cache
  saveToInMemoryCache(slug, html);

  // Save post to disk cache
  console.log(`Saving post "${slug}" to disk cache.`);
  const formattedHtml = beautify.html(html);
  const filePath = path.join(cacheDir, `${slug}.html`);
  await fs.outputFile(filePath, formattedHtml);
}

export async function readPostFromCache(slug: string): Promise<string | null> {
  // Check in-memory cache
  if (inMemoryCache.hasOwnProperty(slug)) {
    console.log(`Serving post "${slug}" from in-memory cache.`);
    return inMemoryCache[slug].html;
  }

  // Check disk cache
  const filePath = path.join(cacheDir, `${slug}.html`);
  if (await fs.pathExists(filePath)) {
    const cachedHtml = await fs.readFile(filePath, 'utf-8');

    // Save the post to the in-memory cache
    saveToInMemoryCache(slug, cachedHtml);

    console.log(`Serving post "${slug}" from disk cache.`);
    return cachedHtml;
  }

  return null;
}
