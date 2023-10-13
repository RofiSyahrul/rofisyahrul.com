import fs from 'fs/promises';
import path from 'path';

import { build } from 'esbuild';
import globby from 'globby';
import yargsParser from 'yargs-parser';

import logger from './logger';

async function getCacheVersion(
  manifestPath: string,
): Promise<string> {
  const timestamp = `${Date.now()}`;
  try {
    const manifestContent = await fs.readFile(manifestPath, 'utf-8');
    const manifestRaw = manifestContent.match(/\{.*\}/)?.[0] ?? '';
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const version = JSON.parse(manifestRaw)?.version;
    if (version) return `${version}-${timestamp}`;
    return timestamp;
  } catch {
    return timestamp;
  }
}

async function getStaticAssetsAndCacheVersion() {
  const publicPath = path.resolve(__dirname, '../public');
  const manifestPathPattern = path.resolve(
    publicPath,
    './build/manifest-*.js',
  );

  const [[manifestPath], publicContentPaths] = await Promise.all([
    globby(manifestPathPattern, { onlyFiles: true }),
    globby(publicPath, {
      expandDirectories: true,
      ignore: ['**/public/sw.js'],
    }),
  ]);

  const cacheVersion = await getCacheVersion(manifestPath);
  const staticAssets = publicContentPaths
    .map(pathname => {
      return `/${path.relative(publicPath, pathname)}`;
    })
    .sort();

  return { cacheVersion, staticAssets };
}

(async () => {
  const { debug } = yargsParser(process.argv.slice(2), {
    boolean: ['debug'],
  });

  const hostsWithCacheableAssets = (
    process.env.HOSTS_WITH_CACHEABLE_ASSETS ?? ''
  )
    .split(';')
    .map(hostname => hostname.trim())
    .filter(Boolean);

  try {
    const { staticAssets, cacheVersion } =
      await getStaticAssetsAndCacheVersion();

    const entryFile = path.resolve(
      __dirname,
      './service-worker/index.ts',
    );

    const outputFile = path.resolve(__dirname, '../public/sw.js');

    await build({
      bundle: true,
      define: {
        CACHE_VERSION: JSON.stringify(cacheVersion),
        DEBUG: JSON.stringify(debug),
        HOSTS_WITH_CACHEABLE_ASSETS: JSON.stringify(
          hostsWithCacheableAssets,
        ),
        STATIC_ASSETS: JSON.stringify(staticAssets),
      },
      entryPoints: [entryFile],
      format: 'esm',
      minify: !debug,
      outfile: outputFile,
    });
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    logger.error(`Failed to generate SW. ERROR: ${error.message}`);
    process.exit(1);
  }
})();
