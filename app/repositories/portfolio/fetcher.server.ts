import fetcher from '~/repositories/fetcher.server';
import type {
  MultipleMediaResource,
  PortfolioFields,
  SingleMediaResource,
} from '~/types/response';
import paraseMediaResource from '~/utils/parse-media-resource.server';

import type {
  FetchPortfolioFeedsResult,
  PortfolioFeed,
  PortfolioRelations,
  PortfolioResponse,
} from './types';

const path = '/api/portfolios';
const iconSize = 32;

function getPortfolioIconAndMediaList(params: {
  icon: SingleMediaResource;
  media: MultipleMediaResource<any>;
  mediaHeight: number;
  mediaWidth: number;
  title: string;
}): Pick<PortfolioFeed, 'icon' | 'mediaList'> {
  const { icon, media, mediaHeight, mediaWidth, title } = params;

  return {
    icon: paraseMediaResource({
      height: iconSize,
      media: icon?.data,
      title,
      width: iconSize,
    }),
    mediaList: (media.data ?? []).map(mediaItem =>
      paraseMediaResource({
        height: mediaHeight,
        media: mediaItem,
        title,
        width: mediaWidth,
      }),
    ),
  };
}

export async function fetchPortfolioFeeds(
  page = 1,
): Promise<FetchPortfolioFeedsResult> {
  const res = await fetcher<
    PortfolioResponse,
    PortfolioFields,
    PortfolioRelations
  >({
    path,
    query: {
      fields: [
        'description',
        'initialDate',
        'repository',
        'slug',
        'title',
        'url',
      ],
      pagination: {
        page,
        pageCount: 10,
      },
      populate: ['icon', 'media'],
      sort: ['initialDate:desc'],
    },
  });

  return {
    total: res?.meta?.pagination?.total ?? 0,
    feeds: (res?.data ?? []).map<PortfolioFeed>(({ attributes }) => {
      const { icon, media, title } = attributes;

      return {
        description: attributes.description,
        initialDate: attributes.initialDate,
        repository: attributes.repository,
        slug: attributes.slug,
        title,
        url: attributes.url,
        ...getPortfolioIconAndMediaList({
          icon,
          media,
          mediaHeight: 300,
          mediaWidth: 300,
          title,
        }),
      };
    }),
  };
}
