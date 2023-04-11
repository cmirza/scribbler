import fs from 'fs-extra';
import path from 'path';
import matter from 'gray-matter';
import slugify from 'slugify';

export interface PostMetadata {
    title: string;
    date: string;
    excerpt?: string;
    slug: string;
    tags: string[];
}

export async function getPostList(tag?: string): Promise<PostMetadata[]> {
    const postsDir = path.join(__dirname, '..', '..', 'posts');
    const files = await fs.readdir(postsDir);

    const postList: PostMetadata[] = [];

    for (const file of files) {
        const filePath = path.join(postsDir, file);
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const { data } = matter(fileContent);
        if (data.title) {
            if (!tag || (Array.isArray(data.tags) && data.tags.includes(tag))) {
                postList.push({
                    title: data.title,
                    date: data.date,
                    excerpt: data.excerpt,
                    slug: slugify(data.title, { lower: true, strict: true }),
                    tags: data.tags || [],
                });
            }
        } else {
            console.log(`Skipping empty or invalid file: ${filePath}`);
        }
    }

    postList.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return postList;
}
