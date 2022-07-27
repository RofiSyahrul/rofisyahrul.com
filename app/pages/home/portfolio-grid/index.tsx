import clsx from 'clsx';
import { useLoaderData } from 'remix';

import type { HomeData } from '../types';
import PortfolioItem from './portfolio-item';

export default function PortfolioGrid() {
  const { portfolio } = useLoaderData<HomeData>();

  return (
    <ul
      className={clsx(
        'grid grid-cols-2 gap-1 border-top-mobile',
        'sm:grid-cols-3 sm:px-3 sm:gap-3 md:gap-6 lg:gap-8',
      )}
    >
      {portfolio.feeds.map(item => {
        if (!item.mediaList.length) return null;
        return (
          <PortfolioItem
            icon={item.icon}
            key={item.slug}
            repository={item.repository}
            slug={item.slug}
            thumbnail={item.mediaList[0]}
            title={item.title}
            url={item.url}
          />
        );
      })}
    </ul>
  );
}
