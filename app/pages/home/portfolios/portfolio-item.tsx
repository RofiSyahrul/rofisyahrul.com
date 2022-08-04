import { Link } from '@remix-run/react';
import clsx from 'clsx';

import LazyImage from '~/components/lazy-image';
import VisuallyHidden from '~/components/visually-hidden';
import CarouselIndicatorIcon from '~/icons/carousel-indicator';
import ExternalLinkIcon from '~/icons/external-link';
import GithubIcon from '~/icons/github';
import type { PortfolioFeed } from '~/repositories/portfolio/types';
import type { SimpleMediaItem } from '~/types/general';

interface PortfolioItemProps
  extends Omit<
    PortfolioFeed,
    'mediaList' | 'description' | 'initialDate'
  > {
  isInList?: boolean;
  isMultiple: boolean;
  thumbnail: SimpleMediaItem;
}

export default function PortfolioItem({
  isInList,
  isMultiple,
  repository,
  slug,
  thumbnail,
  title,
  url,
}: PortfolioItemProps) {
  return (
    <li
      className={clsx('portfolio-item', {
        'portfolio-item_in-list': isInList,
      })}
    >
      <Link
        className='portfolio-item__link'
        title={title}
        to={`/p/${slug}`}
      >
        <LazyImage
          alt={thumbnail.alt}
          className='object-cover w-full aspect-square'
          height={thumbnail.height}
          src={thumbnail.url}
          width={thumbnail.width}
        />
        {!isInList && (
          <span className='portfolio-item__title'>{title}</span>
        )}
        {isMultiple && (
          <CarouselIndicatorIcon
            className={clsx(
              'absolute top-2 right-2',
              'text-neutral-dim0 dark:text-neutral-bright0',
            )}
          />
        )}
      </Link>

      {isInList && (
        <h4
          className={clsx(
            'p-2 line-clamp-1 border-t',
            'border-t-neutral-bright1 dark:border-t-neutral-dim1',
          )}
        >
          {title}
        </h4>
      )}

      {(repository || url) && (
        <div className='portfolio-item__url-repo'>
          {repository && (
            <a
              className='btn btn-solid btn-secondary h-8 w-8 md:h-12 md:w-12 shadow-md'
              href={repository}
              target='_blank'
              rel='noreferrer noopener'
              title='Repository'
            >
              <GithubIcon className='h-6 w-6 md:h-8 md:w-32' />
              <VisuallyHidden>Repository</VisuallyHidden>
            </a>
          )}
          {url && (
            <a
              className='btn btn-solid btn-secondary h-8 w-8 md:h-12 md:w-12 shadow-md'
              href={url}
              target='_blank'
              rel='noreferrer noopener'
              title='Demo'
            >
              <ExternalLinkIcon className='h-6 w-6 md:h-8 md:w-32' />
              <VisuallyHidden>Demo</VisuallyHidden>
            </a>
          )}
        </div>
      )}
    </li>
  );
}
