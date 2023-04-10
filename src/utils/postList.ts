import fs from 'fs-extra';
import path from 'path';
import matter from 'gray-matter';

export interface PostMetadata {
    title: string;
    date: string;
    excerpt?: string;
    slug: string;
}

export async function getPostList(): Promise<PostMetadata[]> {
    const postsDir = path.join(__dirname, '..', '..', 'posts');
    const files = await fs.readdir(postsDir);

    const postList: PostMetadata[] = [];

    for (const file of files) {
        const filePath = path.join(postsDir, file);
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const { data } = matter(fileContent);

        postList.push({
            title: data.title,
            date: data.date,
            excerpt: data.excerpt,
            slug: file.replace(/\.md$/, '')
        });
    }

    postList.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return postList;
}