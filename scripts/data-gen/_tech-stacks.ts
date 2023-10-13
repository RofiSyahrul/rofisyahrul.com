import type {
  TechStackData,
  TechStackFields,
  TechStackRelations,
  TechStackResponse,
} from '@/shared/types/response';
import logger from 'scripts/logger';

import { dataDirPath, PAGE, PAGE_SIZE, TOP_LINE } from './__config';
import fetcher from './__fetcher';
import {
  fs,
  getRelativePath,
  path,
  transformSingleMediaResource,
} from './__utils';

export async function fetchAndGenerateTechStacks() {
  logger.info('Fetching tech stacks...');

  const response = await fetcher<
    TechStackResponse,
    TechStackFields,
    TechStackRelations
  >({
    path: '/api/tech-stacks',
    query: {
      fields: ['name', 'url'],
      pagination: {
        page: PAGE,
        pageSize: PAGE_SIZE,
      },
      populate: ['logo'],
    },
  });

  const data = response.data.map<TechStackData[number]>(item => ({
    ...item,
    attributes: {
      ...item.attributes,
      logo: transformSingleMediaResource(item.attributes.logo),
    },
  }));

  const content = `${TOP_LINE}

import type { TechStackData } from '~/types/response';

const techStackData: TechStackData = ${JSON.stringify(data, null, 2)};

export default techStackData;
`;

  const pathname = path.join(dataDirPath, 'tech-stacks.ts');
  await fs.writeFile(pathname, content, { encoding: 'utf-8' });
  logger.success(
    `Generated ${data.length} tech stacks to ${getRelativePath(
      pathname,
    )}`,
  );
}
