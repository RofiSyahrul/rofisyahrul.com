import { Link, useLocation } from 'remix';

import VisuallyHidden from '~/components/visually-hidden';
import type { Item } from '~/types/general';

import GridIcon from './icons/grid';
import ListIcon from './icons/list';

type TabName = 'grid' | 'list';

interface TabItem extends Omit<Item, 'name'> {
  name: TabName;
  title: string;
}

const tabs: TabItem[] = [
  {
    iconPath: <GridIcon />,
    name: 'grid',
    title: 'Portfolio Grid',
    url: '/#portfolios',
  },
  {
    iconPath: <ListIcon />,
    name: 'list',
    title: 'Portfolio List',
    url: '/#portfolio-list',
    // url: '/portfolio-list#portfolios',
  },
];

export default function Tablist() {
  const { hash } = useLocation();
  const selectedTab: TabName =
    hash === '#portfolio-list' ? 'list' : 'grid';

  return (
    <section
      className='flex w-full items-center mb-[-0.75rem] border-top-mobile sm:hidden'
      role='tablist'
    >
      {tabs.map(tab => (
        <Link
          aria-selected={tab.name === selectedTab}
          className='flex items-center justify-center flex-auto h-11 text-neutral-bright2 dark:text-neutral-dim2 aria-selected:text-primary-dim dark:aria-selected:text-primary-bright'
          key={tab.name}
          to={tab.url}
          role='tab'
          suppressHydrationWarning
          tabIndex={0}
        >
          {tab.iconPath}
          <VisuallyHidden>{tab.title}</VisuallyHidden>
        </Link>
      ))}
    </section>
  );
}
