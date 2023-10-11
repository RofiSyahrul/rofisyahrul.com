import node from '@astrojs/node';
import svelte from '@astrojs/svelte';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel/serverless';
import { defineConfig } from 'astro/config';
import dotenv from 'dotenv';

import setupConfig from './integrations/setup-config';

dotenv.config();
const isVercel = process.env.DEPLOYMENT_PLATFORM === 'vercel';

// https://astro.build/config
export default defineConfig({
  adapter: isVercel ? vercel() : node({ mode: 'standalone' }),
  build: {
    format: 'file',
    inlineStylesheets: 'never',
  },
  compressHTML: true,
  image: {
    remotePatterns: [
      {
        hostname: '*.scdn.co',
      },
    ],
  },
  integrations: [svelte(), tailwind(), setupConfig()],
  output: 'server',
  scopedStyleStrategy: 'class',
});
