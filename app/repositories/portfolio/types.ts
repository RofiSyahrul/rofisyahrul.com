import type { FetcherQuery } from '~/repositories/types';
import type { SimpleMediaItem } from '~/types/general';
import type {
  GeneralResponse,
  Item,
  MultipleMediaResource,
  PortfolioFields,
  SingleMediaResource,
  TechStackFields,
} from '~/types/response';

export interface PortfolioRelations {
  highlightMedia: MultipleMediaResource;
  icon: SingleMediaResource;
  media: MultipleMediaResource<true>;
  techStacks: {
    data: Item<TechStackFields>[] | null;
  };
}

export type PortfolioResponse = GeneralResponse<
  PortfolioFields & PortfolioRelations
>;

export type PortfolioQuery = FetcherQuery<
  PortfolioFields,
  PortfolioRelations
>;

export type PortfolioFeed = Pick<
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
