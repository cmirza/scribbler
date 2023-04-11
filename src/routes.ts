import express, { Router } from 'express';
import { renderPost, RenderOptions } from './utils/renderPost';
import { saveToCache, readFromCache } from './utils/cache';
import { getPostList } from './utils/postList';

const router = Router();
const renderOptions: RenderOptions = {
    header: '<header>Header content</header>',
    footer: '<footer>Footer content</footer>',
};

const routes = (): Router => {
    router.get('/', async (req, res) => {
        res.redirect('/post');
    });

    router.get('/post', async (req, res) => {
        const indexKey = 'index';
        const tagFilter = req.query.tag as string;

        // Check if the index page is cached
        const cachedIndex = await readFromCache(indexKey);

        if (cachedIndex !== null && !tagFilter) {
            res.send(cachedIndex);
        } else {
            const postList = await getPostList(tagFilter);

            let indexHtml = `<h1>Index of Posts${tagFilter ? ` (filtered by tag: ${tagFilter})` : ''}</h1><ul>`;

            for (const post of postList) {
                indexHtml += `
                  <li>
                    <a href="/post/${post.slug}">${post.title}</a>
                    <br>
                    <small>Published on: ${post.date}</small>
                    ${post.excerpt ? `<p>${post.excerpt}</p>` : ''}
                    <p>Tags: ${post.tags.join(', ')}</p>
                  </li>
                `;
            }

            indexHtml += '</ul>';

            // Cache and send the index page (only when there is no tagFilter)
            if (!tagFilter) {
                await saveToCache('index', indexHtml);
            }
            res.send(indexHtml);
        }
    });

    router.get('/post/:slug', async (req, res) => {
        const slug = req.params.slug;

        const cachedPost = await readFromCache(slug);
        if (cachedPost !== null) {
            res.send(cachedPost);
        } else {
            const renderedHtml = await renderPost(slug, renderOptions);
            if (renderedHtml !== null) {
                await saveToCache(slug, renderedHtml);
                res.send(renderedHtml);
            } else {
                res.status(404).send('Not Found');
            }
        }
    });

    return router;
};

export default routes;
