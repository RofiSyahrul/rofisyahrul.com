import type { ImgHTMLAttributes } from 'react';
import { useMemo } from 'react';

import type { UseIntersectionOptions } from '~/hooks/use-intersection';
import { useIntersection } from '~/hooks/use-intersection';
import { useColorMode } from '~/store/color-mode';

interface LazyImageProps
  extends ImgHTMLAttributes<HTMLImageElement>,
    UseIntersectionOptions {}

const emptyDataURLDark =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mM0dgw1BgACdgD+5MErbwAAAABJRU5ErkJggg==';

const emptyDataURLLight =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mM8ffWhDwAHwwLPPkxXsQAAAABJRU5ErkJggg==';

export default function LazyImage({
  alt,
  root,
  rootMargin,
  rootRef,
  src,
  ...props
}: LazyImageProps) {
  const colorMode = useColorMode();
  const [imageRef, isVisible] = useIntersection<HTMLImageElement>({
    root,
    rootMargin,
    rootRef,
  });

  const loadedSrc = useMemo(() => {
    if (isVisible) return src;
    if (colorMode === 'dark') return emptyDataURLDark;
    return emptyDataURLLight;
  }, [colorMode, isVisible, src]);

  return (
    <img
      decoding='async'
      {...props}
      alt={alt}
      ref={imageRef}
      src={loadedSrc}
      suppressHydrationWarning
    />
  );
}
