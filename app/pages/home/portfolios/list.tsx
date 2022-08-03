import { useOutletContext } from '@remix-run/react';

import type { HomeData } from '../types';
import PortfolioItem from './portfolio-item';

export default function PortfolioList() {
  const { portfolio } = useOutletContext<HomeData>();

  return (
    <ul className='flex flex-col gap-2 px-2 border-top-mobile'>
      {portfolio.feeds.map(item => {
        if (!item.mediaList.length) return null;
        return (
          <PortfolioItem
            isInList
            isMultiple={item.mediaList.length > 1}
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
