import DOMPurify from 'isomorphic-dompurify';
import { marked } from 'marked';

import portfolioData from '@/data/portfolios';
import techStackData from '@/data/tech-stacks';
import type {
  MultipleMediaResource,
  SingleMediaResource,
  TechStackItem,
} from '@/shared/types/response';
import parseMediaResource from '@/shared/utils/parse-media-resource';

import type {
  PortfolioDetail,
  PortfolioFeed,
  PortfolioFeedsAndTotal,
} from './types';

function sanitizeDescription(desc: string) {
  return DOMPurify.sanitize(marked(desc));
}

function getPortfolioIconAndMediaList(params: {
  icon: SingleMediaResource;
  iconSize?: number;
  media: MultipleMediaResource<any>;
  mediaHeight: number;
  mediaWidth: number;
  title: string;
}): Pick<PortfolioDetail, 'icon' | 'mediaList'> {
  const {
    icon,
    iconSize = 32,
    media,
    mediaHeight,
    mediaWidth,
    title,
  } = params;

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

export function getPortfolioFeedsAndTotal(): PortfolioFeedsAndTotal {
  return {
    total: portfolioData.length,
    feeds: portfolioData.map<PortfolioFeed>(({ attributes }) => {
      const { media, title } = attributes;

      return {
        repository: attributes.repository,
        slug: attributes.slug,
        title,
        url: attributes.url,
        mediaList: media.data.map(item =>
          parseMediaResource({
            height: 800,
            media: item,
            title,
            width: 800,
          }),
        ),
      };
    }),
  };
}

function getTechStacks(ids: number[]): TechStackItem[] {
  if (ids.length === 0) return [];

  const techStacks = techStackData.filter(({ id }) =>
    ids.includes(id),
  );

  return techStacks.map(({ attributes }) => ({
    logo: parseMediaResource({
      height: 24,
      media: attributes.logo.data,
      title: attributes.name,
      width: 24,
    }),
    name: attributes.name,
    url: attributes.url,
  }));
}

const portfolioDataMap = new Map(
  portfolioData.map(portfolioDetail => [
    portfolioDetail.attributes.slug,
    portfolioDetail,
  ]),
);

export function getPortfolioDetail(
  slug?: string,
): PortfolioDetail | null {
  if (!slug) return null;

  const potfolioDetail = portfolioDataMap.get(slug);
  if (!potfolioDetail) return null;

  const { attributes } = potfolioDetail;
  const techStackIDs = (attributes.techStacks.data ?? []).map(
    item => item.id,
  );

  return {
    description: sanitizeDescription(attributes.description),
    initialDate: attributes.initialDate,
    repository: attributes.repository,
    slug: attributes.slug,
    techStacks: getTechStacks(techStackIDs),
    title: attributes.title,
    url: attributes.url,
    ...getPortfolioIconAndMediaList({
      icon: attributes.icon,
      iconSize: 80,
      media: attributes.media,
      mediaHeight: 900,
      mediaWidth: 900,
      title: attributes.title,
    }),
  };
}
