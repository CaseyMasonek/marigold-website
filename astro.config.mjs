// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';

import mdx from '@astrojs/mdx';

import starlightDocSearch from '@astrojs/starlight-docsearch';

import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      exclude: ["pyodide"]
    }
  },

  integrations: [react(), starlight({
      'title': 'Marigold',
      plugins: [
          starlightDocSearch({
              appId: process.env.ALGOLIA_APP_ID ?? "",
              apiKey: process.env.ALGOLIA_API_KEY ?? "",
              indexName: process.env.ALGOLIA_INDEX_NAME ?? "",
          }),
      ]
  }),mdx()]
});