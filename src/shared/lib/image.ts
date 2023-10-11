import type { ImageOutputFormat } from 'astro';
import { getImage } from 'astro:assets';

interface Options {
  format?: ImageOutputFormat;
  height: number;
  isSupportAvif: boolean;
  src: string;
  width: number;
}

export async function optimizeImage({
  format,
  height,
  isSupportAvif,
  src,
  width,
}: Options): Promise<string> {
  let resolvedFormat = format;
  if (!resolvedFormat) {
    resolvedFormat = isSupportAvif ? 'avif' : 'png';
  }

  const optimized = await getImage({
    format: resolvedFormat,
    height,
    src,
    width,
  });

  return optimized.src;
}
