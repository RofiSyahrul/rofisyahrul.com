import { Link } from 'remix';

import VisuallyHidden from '~/components/visually-hidden';
import type { PortfolioFeed } from '~/repositories/portfolio/types';
import type { SimpleMediaItem } from '~/types/general';

interface PortfolioItemProps
  extends Omit<
    PortfolioFeed,
    'mediaList' | 'description' | 'initialDate'
  > {
  thumbnail: SimpleMediaItem;
}

export default function PortfolioItem({
  icon,
  repository,
  slug,
  thumbnail,
  title,
  url,
}: PortfolioItemProps) {
  return (
    <li className='portfolio-grid-item'>
      <Link to={`/p/${slug}`}>
        <img
          alt={thumbnail.alt}
          className='object-cover w-full aspect-square'
          height={thumbnail.height}
          src={thumbnail.url}
          width={thumbnail.width}
        />
        <VisuallyHidden>{title}</VisuallyHidden>
      </Link>
    </li>
  );
}
