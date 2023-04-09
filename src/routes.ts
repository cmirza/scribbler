import express, { Router } from 'express';
import fs from 'fs';
import path from 'path';
import MarkdownIt from 'markdown-it';

const router = Router();
const md = new MarkdownIt();

const routes = (): Router => {
    router.get('/', (req, res) => {
        res.send('Hello World');
    });

    router.get('/post/:slug', (req, res) => {
        const slug = req.params.slug;
        const postPath = path.join(__dirname, 'posts', `${slug}.md`);

        if (fs.existsSync(postPath)) {
            fs.readFile(postPath, 'utf-8', (err, data) => {
                if (err) {
                    res.status(500).send('Internal Server Error');
                } else {
                    const htmlContent = md.render(data);
                    res.send(`<html><head><title>${slug}</title></head><body>${htmlContent}</body></html>`);
                }
            });
        } else {
            res.status(404).send('Not Found');
        }
    });

    return router;
};

export default routes;
