# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Commonly Used Commands

*   `npm start`: Starts the development server.
*   `npm run build`: Builds the static site for production.
*   `npm run typecheck`: Runs the TypeScript compiler to check for type errors.
*   `npm run sync`: Synchronizes content from GitHub.
*   `npm run sync:all`: A more comprehensive synchronization script.
*   `npm run capture`: A script for capturing content.

## Code Architecture

This is a Docusaurus project for "KorSolutions Docs". The main content is in the `docs` directory, organized into different projects as defined in `docusaurus.config.ts` and `sidebars.ts`. The main projects are Sigma Project, Sistema PQRSD, Archive Master, and VolleyPass. The site also includes a blog.
