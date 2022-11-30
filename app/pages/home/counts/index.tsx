import { useMemo } from 'react';

import { Link, useLoaderData } from '@remix-run/react';
import clsx from 'clsx';

import type { HomeData } from '../types';

interface CountItem {
  name: 'portfolio' | 'tech-skill';
  title: string;
  url: string;
  value: number;
}

interface CountsProps {
  className: string;
}

export default function Counts({ className }: CountsProps) {
  const { portfolio, totalTechSkills } = useLoaderData<HomeData>();
  const totalPortfolio = portfolio.total;

  const countData = useMemo<CountItem[]>(() => {
    const data: CountItem[] = [
      {
        name: 'portfolio',
        title: `Portfolio${totalPortfolio > 1 ? 's' : ''}`,
        url: '/',
        value: totalPortfolio,
      },
    ];

    if (totalTechSkills === 0) return data;

    return [
      ...data,
      {
        name: 'tech-skill',
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
      {countData.map(({ name, title, url, value }) => (
        <li key={title}>
          <Link
            state={name === 'portfolio' ? 'change-tab' : undefined}
            to={url}
          >
            <strong>{value}</strong>
            {` ${title}`}
          </Link>
        </li>
      ))}
    </ul>
  );
}
