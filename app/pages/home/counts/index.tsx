import { useMemo } from 'react';

import clsx from 'clsx';
import { Link, useLoaderData } from 'remix';

import type { HomeData } from '../types';

interface CountItem {
  title: string;
  url: string;
  value: number;
}

interface CountsProps {
  className: string;
}

export default function Counts({ className }: CountsProps) {
  const { portfolio } = useLoaderData<HomeData>();
  const totalPortfolio = portfolio.total;

  const countData = useMemo<CountItem[]>(() => {
    return [
      {
        title: 'Portfolios',
        url: '/#portfolios',
        value: totalPortfolio,
      },
      {
        title: 'Technical Skills',
        url: '/technical-skills',
        value: 10,
      },
    ];
  }, [totalPortfolio]);

  return (
    <ul
      className={clsx(
        'counts-container',
        'border-top-mobile',
        className,
      )}
    >
      {countData.map(({ title, url, value }) => (
        <li key={title}>
          <Link to={url}>
            <strong>{value}</strong>
            {` ${title}`}
          </Link>
        </li>
      ))}
    </ul>
  );
}
