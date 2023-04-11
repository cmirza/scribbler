<img src="./logo.png" alt="crage" style="width:175px;"/>

# Scribbler

Scribbler is a hybrid static and dynamic blogging platform that generates and serves blog posts by converting Markdown files to HTML and adding postprocessing elements such as headers, footers, and metadata. It is built using TypeScript, Express.js, Handlebars, and Markdown-It for a seamless and efficient blogging experience.

## Milestones

#### April 7, 2023

- Project Begins

#### April 9, 2023

- Basic functionality implemented
- Implement in-memory caching of rendered HTML
- Implement disk caching of rendered HTML
- Added basic logging to console

#### April 10, 2023

- Added reading of post metadata from frontmatter block in Markdown file
- Created an index page to list all posts
- Added post slug generation for URL friendly posts identifiers
- Added cache invalidation when a post is added or updated
