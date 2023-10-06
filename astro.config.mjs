import node from '@astrojs/node';
import svelte from '@astrojs/svelte';
import tailwind from '@astrojs/tailwind';
import { defineConfig } from 'astro/config';

import setupConfig from './integrations/setup-config';

// https://astro.build/config
export default defineConfig({
  adapter: node({
    mode: 'standalone',
  }),
  build: {
    format: 'file',
  },
  compressHTML: true,
  integrations: [svelte(), tailwind(), setupConfig()],
  output: 'server',
  scopedStyleStrategy: 'class',
});
