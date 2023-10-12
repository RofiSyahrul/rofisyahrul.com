import type { ComponentType } from 'svelte';

import Grid from './icons/grid.svelte';
import List from './icons/list.svelte';

export const portfolioGridID = 'grid' as const;
export const portfolioListID = 'list' as const;

export type TabName = typeof portfolioGridID | typeof portfolioListID;

interface TabItem {
  icon: ComponentType;
  href: string;
  name: TabName;
  title: string;
}

export const tabs: TabItem[] = [
  {
    href: '/#' + portfolioGridID,
    icon: Grid,
    name: portfolioGridID,
    title: 'Portfolio Grid',
  },
  {
    href: '/#' + portfolioListID,
    icon: List,
    name: portfolioListID,
    title: 'Portfolio List',
  },
];
