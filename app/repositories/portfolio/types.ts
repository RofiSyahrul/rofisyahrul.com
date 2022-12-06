import type { SimpleMediaItem } from '~/types/general';
import type {
  PortfolioFields,
  TechStackItem,
} from '~/types/response';

export type PortfolioFeed = Pick<
  PortfolioFields,
  'repository' | 'slug' | 'title' | 'url'
> & {
  mediaList: SimpleMediaItem[];
};

export type PortfolioDetail = Pick<
  PortfolioFields,
  | 'description'
  | 'initialDate'
  | 'repository'
  | 'slug'
  | 'title'
  | 'url'
> & {
  icon: SimpleMediaItem;
  mediaList: SimpleMediaItem[];
  techStacks: TechStackItem[];
};

export type PortfolioHighlight = Pick<
  PortfolioFields,
  | 'description'
  | 'highlightDescription'
  | 'initialDate'
  | 'repository'
  | 'title'
  | 'url'
> & {
  icon: SimpleMediaItem;
  highlightMediaList: SimpleMediaItem[];
};

export interface FetchPortfolioFeedsResult {
  feeds: PortfolioFeed[];
  total: number;
}
