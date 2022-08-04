import { useLoaderData } from '@remix-run/react';
import clsx from 'clsx';

import LazyImage from '~/components/lazy-image';
import type { PortfolioDetail } from '~/repositories/portfolio/types';

interface AvatarProps {
  className?: string;
}

export default function Avatar({ className }: AvatarProps) {
  const { icon } = useLoaderData<PortfolioDetail>();

  return (
    <div
      className={clsx(
        'relative max-h-20 w-auto aspect-square',
        className,
      )}
    >
      <LazyImage
        alt={icon.alt}
        className={clsx(
          'rounded-full absolute top-0 left-0 h-full w-full aspect-square',
          'outline outline-offset-1 outline-neutral-bright1',
          'dark:outline-neutral-dim1',
        )}
        height={icon.height}
        src={icon.url}
        width={icon.width}
      />
    </div>
  );
}
