import DOMPurify from 'isomorphic-dompurify';
import { marked } from 'marked';

import fetcher from '~/repositories/fetcher.server';
import type {
  MultipleMediaResource,
  PortfolioFields,
  PortfolioRelations,
  SingleMediaResource,
  TechStackFields,
  TechStackItem,
  TechStackRelations,
  TechStackResponse,
} from '~/types/response';
import parseMediaResource from '~/utils/parse-media-resource.server';

import type {
  FetchPortfolioFeedsResult,
  PortfolioDetail,
  PortfolioFeed,
  PortfolioResponse,
} from './types';

const path = '/api/portfolios';
const iconSize = 32;

function sanitizeDescription(desc: string) {
  return DOMPurify.sanitize(marked(desc));
}

function getPortfolioIconAndMediaList(params: {
  icon: SingleMediaResource;
  media: MultipleMediaResource<any>;
  mediaHeight: number;
  mediaWidth: number;
  title: string;
}): Pick<PortfolioFeed, 'icon' | 'mediaList'> {
  const { icon, media, mediaHeight, mediaWidth, title } = params;

  return {
    icon: parseMediaResource({
      height: iconSize,
      media: icon?.data,
      title,
      width: iconSize,
    }),
    mediaList: (media.data ?? []).map(mediaItem =>
      parseMediaResource({
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
        pageSize: 10,
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
        description: sanitizeDescription(attributes.description),
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

async function fetchTechStacks(
  ids: number[],
): Promise<TechStackItem[]> {
  if (ids.length === 0) return [];

  const res = await fetcher<
    TechStackResponse,
    TechStackFields,
    TechStackRelations
  >({
    path: '/api/tech-stacks',
    query: {
      fields: ['name', 'url'],
      populate: ['logo'],
      filters: {
        id: {
          $in: ids,
        },
      },
      pagination: {
        page: 1,
        pageSize: 25,
      },
    },
  });

  return res.data.map(({ attributes }) => ({
    logo: parseMediaResource({
      height: 32,
      media: attributes.logo.data,
      title: attributes.name,
      width: 32,
    }),
    name: attributes.name,
    url: attributes.url,
  }));
}

export async function fetchPortfolioDetail(
  slug?: string,
): Promise<PortfolioDetail | null> {
  if (!slug) return null;

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
      filters: {
        slug: {
          $eq: slug,
        },
      },
      pagination: {
        page: 1,
        pageSize: 1,
      },
      populate: ['icon', 'media', 'techStacks'],
    },
  });

  if (res.data.length === 0) return null;

  const { attributes } = res.data[0];
  const techStackIDs = (attributes.techStacks.data ?? []).map(
    item => item.id,
  );

  return {
    description: sanitizeDescription(attributes.description),
    initialDate: attributes.initialDate,
    repository: attributes.repository,
    slug: attributes.slug,
    techStacks: await fetchTechStacks(techStackIDs),
    title: attributes.title,
    url: attributes.url,
    ...getPortfolioIconAndMediaList({
      icon: attributes.icon,
      media: attributes.media,
      mediaHeight: 500,
      mediaWidth: 500,
      title: attributes.title,
    }),
  };
}
