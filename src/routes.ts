import express, { Router } from 'express';
import { renderPost, RenderOptions } from './utils/renderPost';
import { savePostToCache, readPostFromCache } from './utils/cache';

const router = Router();
const renderOptions: RenderOptions = {
  header: '<header>Header content</header>',
  footer: '<footer>Footer content</footer>',
};

const routes = (): Router => {
  router.get('/', (req, res) => {
    res.send('Hello World');
  });

  router.get('/post/:slug', async (req, res) => {
    const slug = req.params.slug;

    const cachedPost = await readPostFromCache(slug);
    if (cachedPost !== null) {
      res.send(cachedPost);
    } else {
      const renderedHtml = await renderPost(slug, renderOptions);
      if (renderedHtml !== null) {
        await savePostToCache(slug, renderedHtml);
        res.send(renderedHtml);
      } else {
        res.status(404).send('Not Found');
      }
    }
  });

  return router;
};

export default routes;
