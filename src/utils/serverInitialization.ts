import fs from 'fs-extra';
import path from 'path';
import { invalidateCache } from './cache';

const postsDir = path.join(__dirname, '..', '..', 'posts');
const cacheDir = path.join(__dirname, '..', '..', 'cache');

async function checkAndInvalidateIndexCache(): Promise<void> {
    const postsStats = await fs.stat(postsDir);
    const indexCachePath = path.join(cacheDir, 'index.html');

    if (await fs.pathExists(indexCachePath)) {
        const cacheStats = await fs.stat(indexCachePath);

        if (postsStats.mtime > cacheStats.mtime) {
            console.log(`Initializing cache.`);
            invalidateCache('index');
        }
    }
}

export async function serverInitialization(): Promise<void> {
    await checkAndInvalidateIndexCache();
}
