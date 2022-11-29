import DOMPurify from 'isomorphic-dompurify';
import { marked } from 'marked';

import type {
  MultipleMediaResource,
  SingleMediaResource,
  TechStackItem,
} from '~/types/response';
import parseMediaResource from '~/utils/parse-media-resource.server';

import type {
  FetchPortfolioFeedsResult,
  PortfolioData,
  PortfolioDetail,
  PortfolioFeed,
  TechStackData,
} from './types';

let portfolioData: PortfolioData | undefined;
let techStackData: TechStackData | undefined;

function sanitizeDescription(desc: string) {
  return DOMPurify.sanitize(marked(desc));
}

async function importPortfolioData() {
  if (portfolioData) return portfolioData;
  portfolioData = (await import(
    '~/data/portfolios.json'
  )) as unknown as PortfolioData;
  return portfolioData;
}

async function importTechStackData() {
  if (techStackData) return techStackData;
  techStackData = (await import(
    '~/data/tech-stacks.json'
  )) as unknown as TechStackData;
  return techStackData;
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

export async function fetchPortfolioFeeds(
  page = 1,
): Promise<FetchPortfolioFeedsResult> {
  const data = await importPortfolioData();

  return {
    total: data.length,
    feeds: data.map<PortfolioFeed>(({ attributes }) => {
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

async function fetchTechStacks(
  ids: number[],
): Promise<TechStackItem[]> {
  if (ids.length === 0) return [];

  const data = await importTechStackData();
  const techStacks = data.filter(({ id }) => ids.includes(id));

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

export async function fetchPortfolioDetail(
  slug?: string,
): Promise<PortfolioDetail | null> {
  if (!slug) return null;

  const data = await importPortfolioData();
  const potfolioDetail = data.find(
    item => item.attributes.slug === slug,
  );

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
    techStacks: await fetchTechStacks(techStackIDs),
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
