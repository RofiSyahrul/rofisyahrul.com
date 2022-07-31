import { useMemo } from 'react';

import { Link, useOutletContext } from '@remix-run/react';
import clsx from 'clsx';

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
  const { portfolio } = useOutletContext<HomeData>();
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
