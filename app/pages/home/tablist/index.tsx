import { Link } from '@remix-run/react';
import clsx from 'clsx';

import VisuallyHidden from '~/components/visually-hidden';

import {
  portfolioGridID,
  portfolioListID,
  stateOfChangingTab,
} from './constants';
import GridIcon from './icons/grid';
import ListIcon from './icons/list';
import type { TabItem, TabListProps } from './types';

const tabs: TabItem[] = [
  {
    control: portfolioGridID,
    iconPath: <GridIcon />,
    name: 'grid',
    title: 'Portfolio Grid',
    url: '/',
  },
  {
    control: portfolioListID,
    iconPath: <ListIcon />,
    name: 'list',
    title: 'Portfolio List',
    url: '/portfolio-list',
  },
];

export default function Tablist({ selectedTab }: TabListProps) {
  return (
    <section
      className={clsx(
        'flex w-full items-center mb-[-0.75rem] border-top-mobile',
        'sm:hidden desktop:hidden',
      )}
      role='tablist'
    >
      {tabs.map(tab => {
        const isSelected = tab.name === selectedTab;
        return (
          <Link
            aria-controls={tab.control}
            aria-selected={isSelected}
            className={clsx(
              'flex items-center justify-center flex-auto h-11',
              'text-neutral-bright2 dark:text-neutral-dim2',
              'aria-selected:text-primary-dim',
              'dark:aria-selected:text-primary-bright',
              'aria-selected:pointer-events-none',
            )}
            id={`tab-${tab.control}`}
            key={tab.name}
            to={tab.url}
            role='tab'
            suppressHydrationWarning
            state={stateOfChangingTab}
            tabIndex={isSelected ? undefined : -1}
          >
            {tab.iconPath}
            <VisuallyHidden>{tab.title}</VisuallyHidden>
          </Link>
        );
      })}
    </section>
  );
}
