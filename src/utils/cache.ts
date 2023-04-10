import fs from 'fs-extra';
import path from 'path';
import beautify from 'js-beautify';

const cacheDir = path.join(__dirname, '..', '..', 'cache');
const inMemoryCache: { [key: string]: { html: string; timeout: NodeJS.Timeout } } = {};
const inMemoryCacheExpirationTime = 5 * 60 * 1000;

function saveToInMemoryCache(key: string, html: string): void {
  console.log(`Saving "${key}" to in-memory cache.`);
  inMemoryCache[key] = {
    html,
    timeout: setTimeout(() => {
        console.log(`Removing "${key}" from in-memory cache.`);
        delete inMemoryCache[key];
    }, inMemoryCacheExpirationTime),
  };
}

export async function saveToCache(key: string, html: string): Promise<void> {
  // Save to in-memory cache
  saveToInMemoryCache(key, html);

  // Save to disk cache
  console.log(`Saving "${key}" to disk cache.`);
  const formattedHtml = beautify.html(html);
  const filePath = path.join(cacheDir, `${key}.html`);
  await fs.outputFile(filePath, formattedHtml);
}

export async function readFromCache(key: string): Promise<string | null> {
  // Check in-memory cache
  if (inMemoryCache.hasOwnProperty(key)) {
    console.log(`Serving "${key}" from in-memory cache.`);
    return inMemoryCache[key].html;
  }

  // Check disk cache
  const filePath = path.join(cacheDir, `${key}.html`);
  if (await fs.pathExists(filePath)) {
    const cachedHtml = await fs.readFile(filePath, 'utf-8');

    // Save to the in-memory cache
    saveToInMemoryCache(key, cachedHtml);

    console.log(`Serving "${key}" from disk cache.`);
    return cachedHtml;
  }

  return null;
}
