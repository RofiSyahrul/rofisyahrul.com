import type { Item } from '~/types/general';

export type TabName = 'grid' | 'list';

export interface TabItem extends Omit<Item, 'name'> {
  control: string;
  name: TabName;
  title: string;
}

export interface TabListProps {
  selectedTab?: TabName;
}
