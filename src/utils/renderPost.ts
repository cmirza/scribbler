import fs from 'fs-extra';
import path from 'path';
import MarkdownIt from 'markdown-it';
import handlebars from 'handlebars';

const markdown = new MarkdownIt();

export interface RenderOptions {
    header: string;
    footer: string;
};

export async function renderPost(slug: string, options: RenderOptions): Promise<string | null> {
    const postPath = path.join(__dirname, '..', '..', 'posts', `${slug}.md`);

    if (!(await fs.pathExists(postPath))) {
        return null;
    }

    const postContent = await fs.readFile(postPath, 'utf-8');
    const html = markdown.render(postContent);

    const template = handlebars.compile(`
        {{{header}}}{{{content}}}{{{footer}}}
    `);

    const renderedHtml = template({ header: options.header, content: html, footer: options.footer });

    return renderedHtml;
}
