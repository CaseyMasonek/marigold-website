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
    },
    resolve: {
      alias: {
        '@/': './src',
      }
    }
  },

  integrations: [react(), mdx()]
});