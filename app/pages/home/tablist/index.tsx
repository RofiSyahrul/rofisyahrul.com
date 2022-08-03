import { Link } from '@remix-run/react';
import clsx from 'clsx';

import VisuallyHidden from '~/components/visually-hidden';

import { portfolioGridID, portfolioListID } from './constants';
import GridIcon from './icons/grid';
import ListIcon from './icons/list';
import type { TabItem, TabListProps } from './types';

const tabs: TabItem[] = [
  {
    control: portfolioGridID,
    iconPath: <GridIcon />,
    name: 'grid',
    title: 'Portfolio Grid',
    url: `/#${portfolioGridID}`,
  },
  {
    control: portfolioListID,
    iconPath: <ListIcon />,
    name: 'list',
    title: 'Portfolio List',
    url: `/#${portfolioListID}`,
  },
];

export default function Tablist({ selectedTab }: TabListProps) {
  return (
    <section
      className='flex w-full items-center mb-[-0.75rem] border-top-mobile sm:hidden'
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
            )}
            id={`tab-${tab.control}`}
            key={tab.name}
            to={tab.url}
            role='tab'
            suppressHydrationWarning
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
