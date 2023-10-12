import type { ComponentType } from 'svelte';

import {
  portfolioGridID,
  portfolioListID,
} from '@/@home/shared/constants';

import Grid from './icons/grid.svelte';
import List from './icons/list.svelte';

export const TAB_NAMES = [portfolioGridID, portfolioListID] as const;

export type TabName = (typeof TAB_NAMES)[number];

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
