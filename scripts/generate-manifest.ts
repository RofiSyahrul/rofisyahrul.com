/* eslint-disable no-console */
import { writeFile } from 'fs/promises';
import path from 'path';

import config from '../app/config';
import pkg from '../package.json';

type ManifestIcon = {
  src: string;
  sizes: string;
  type: string;
};

function generateManifestIcons(): ManifestIcon[] {
  const icons: ManifestIcon[] = [];

  config.manifest.iconSizes.forEach(iconSize => {
    const sizes = `${iconSize}x${iconSize}`;
    const icon: ManifestIcon = {
      src: `/icons/android-chrome-${sizes}.png`,
      sizes,
      type: 'image/png',
    };

    icons.push(icon);
  });

  return icons;
}

function generateBrowserConfigContent() {
  const browserConfigIcon = Object.entries(config.manifest.msTileIcon)
    .map(
      ([key, value]) =>
        `<${value}${key}logo src="/icons/mstile-${key}.png" />`,
    )
    .join('\n\t\t\t');

  return `<?xml version="1.0" encoding="utf-8"?>
<browserconfig>
  <msapplication>
    <tile>
      ${browserConfigIcon}
      <TileColor>${config.manifest.themeColor}</TileColor>
    </tile>
  </msapplication>
</browserconfig>`;
}

(async () => {
  const icons = generateManifestIcons();

  const manifest = {
    name: config.manifest.name,
    short_name: config.manifest.name,
    version: pkg.version,
    description: config.manifest.description,
    background_color: config.manifest.backgroundColor,
    theme_color: config.manifest.themeColor,
    start_url: '/',
    display: 'standalone',
    scope: '/',
    icons,
  };

  const browserConfigContent = generateBrowserConfigContent();

  const publicPath = path.resolve(__dirname, '../public');
  const manifestPath = path.resolve(publicPath, 'manifest.json');
  const browserConfigPath = path.resolve(
    publicPath,
    'browserconfig.xml',
  );

  try {
    await Promise.all([
      writeFile(manifestPath, JSON.stringify(manifest, null, 2), {
        encoding: 'utf-8',
      }),
      writeFile(browserConfigPath, browserConfigContent, {
        encoding: 'utf-8',
      }),
    ]);
    console.log(
      '\x1b[32m%s\x1b[0m',
      `Generate manifest file ${manifestPath}
      and browserconfig file ${browserConfigPath} success 🚀`,
    );
  } catch (error: any) {
    console.log(
      '\x1b[31m%s\x1b[0m',
      `Couldn't generate manifest file ${manifestPath}
      and browserconfig file ${browserConfigPath} 🤦 .
      Error: ${error.message}`,
    );
  }
})();
