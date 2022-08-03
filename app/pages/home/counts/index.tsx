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
  const { portfolio, totalTechSkills } = useOutletContext<HomeData>();
  const totalPortfolio = portfolio.total;

  const countData = useMemo<CountItem[]>(() => {
    const data: CountItem[] = [
      {
        title: `Portfolio${totalPortfolio > 1 ? 's' : ''}`,
        url: '/#portfolios',
        value: totalPortfolio,
      },
    ];

    if (totalTechSkills === 0) return data;

    return [
      ...data,
      {
        title: `Technical Skill${totalTechSkills > 1 ? 's' : ''}`,
        url: '/technical-skills',
        value: totalTechSkills,
      },
    ];
  }, [totalPortfolio, totalTechSkills]);

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
