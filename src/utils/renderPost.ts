import matter from 'gray-matter';
import fs from 'fs-extra';
import path from 'path';
import MarkdownIt from 'markdown-it';
import handlebars from 'handlebars';
import slugify from 'slugify';

const markdown = new MarkdownIt();

export interface RenderOptions {
    header: string;
    footer: string;
};

export async function renderPost(slug: string, options: RenderOptions): Promise<string | null> {
    const postsDir = path.join(__dirname, '..', '..', 'posts');
    const files = await fs.readdir(postsDir);

    let postPath = '';
    for (const file of files) {
        const filePath = path.join(postsDir, file);
        const rawPostContent = await fs.readFile(filePath, 'utf-8');
        const { data: metadata } = matter(rawPostContent);

        if (metadata.title) {
            const fileSlug = slugify(metadata.title, { lower: true, strict: true });
    
            if (fileSlug === slug) {
                postPath = filePath;
                break;
            }
        } else {
            console.log(`Skipping empty or invalid file: ${filePath}`)
        }
    }

    if (!postPath) {
        return null;
    }

    const rawPostContent = await fs.readFile(postPath, 'utf-8');
    const { data: metadata, content } = matter(rawPostContent);
    const html = markdown.render(content);

    const template = handlebars.compile(`
        {{{header}}}{{{content}}}{{{footer}}}
    `);

    const renderedHtml = template({ header: options.header, content: html, footer: options.footer });

    return renderedHtml;
}
