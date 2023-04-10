import express, { Router } from "express";
import fs from "fs";
import path from "path";
import MarkdownIt from "markdown-it";
import { renderPost, RenderOptions } from "./utils/renderPost";
import { Cache } from "./utils/cache";

const router = Router();
const md = new MarkdownIt();

const cache = new Cache();

const header = "<header>Welcome to Scribbler</header>";
const footer = "<footer>Powered by Scribbler</footer>";

const renderOptions: RenderOptions = {
  header: header,
  footer: footer,
};

const routes = (): Router => {
  router.get("/", (req, res) => {
    res.send("Hello World");
  });

  router.get("/post/:slug", async (req, res) => {
    const slug = req.params.slug;

    if (cache.has(slug)) {
      console.log(`Serving post "${slug}" from cache.`);
      res.send(cache.get(slug));
    } else {
      const renderedHtml = await renderPost(slug, renderOptions);
      if (renderedHtml !== null) {
        console.log(`Rendering and caching post "${slug}".`);
        cache.set(slug, renderedHtml);
        res.send(renderedHtml);
      } else {
        res.status(404).send("Not Found");
      }
    }
  });

  return router;
};

export default routes;
