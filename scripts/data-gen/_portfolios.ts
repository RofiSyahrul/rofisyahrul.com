import type {
  PortfolioData,
  PortfolioFields,
  PortfolioRelations,
  PortfolioResponse,
} from '@/shared/types/response';
import logger from 'scripts/logger';

import { dataDirPath, PAGE, PAGE_SIZE, TOP_LINE } from './__config';
import fetcher from './__fetcher';
import {
  fs,
  getRelativePath,
  omitTimestampFields,
  path,
  transformMultipleMediaResource,
  transformSingleMediaResource,
} from './__utils';

export async function fetchAndGeneratePortfolios() {
  logger.info('Fetching portfolios...');

  const response = await fetcher<
    PortfolioResponse,
    PortfolioFields,
    PortfolioRelations
  >({
    path: '/api/portfolios',
    query: {
      fields: [
        'description',
        'highlightDescription',
        'initialDate',
        'repository',
        'slug',
        'title',
        'url',
      ],
      pagination: {
        page: PAGE,
        pageSize: PAGE_SIZE,
      },
      populate: ['highlightMedia', 'icon', 'media', 'techStacks'],
      sort: ['initialDate:desc'],
    },
  });

  const data = response.data.map<PortfolioData[number]>(item => ({
    id: item.id,
    attributes: {
      ...item.attributes,
      highlightMedia: transformMultipleMediaResource(
        item.attributes.highlightMedia,
      ),
      icon: transformSingleMediaResource(item.attributes.icon),
      media: transformMultipleMediaResource(item.attributes.media),
      techStacks: {
        data: (item.attributes.techStacks.data ?? []).map(
          omitTimestampFields,
        ),
      },
    },
  }));

  const content = `${TOP_LINE}

import type { PortfolioData } from '~/types/response';

const portfolioData: PortfolioData = ${JSON.stringify(data, null, 2)};

export default portfolioData;
`;

  const portfolioDataPath = path.join(dataDirPath, 'portfolios.ts');
  await fs.writeFile(portfolioDataPath, content, {
    encoding: 'utf-8',
  });

  logger.success(
    `Generated ${data.length} portfolios to ${getRelativePath(
      portfolioDataPath,
    )}`,
  );
}
