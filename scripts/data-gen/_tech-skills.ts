import type {
  TechSkillFields,
  TechSkillResponse,
} from '@/shared/types/response';
import logger from 'scripts/logger';

import { dataDirPath, PAGE, PAGE_SIZE, TOP_LINE } from './__config';
import fetcher from './__fetcher';
import { fs, getRelativePath, path } from './__utils';

export async function fetchAndGenerateTechSkills() {
  logger.info('Fetching tech skills...');

  const response = await fetcher<TechSkillResponse, TechSkillFields>({
    path: '/api/technical-skills',
    query: {
      fields: ['name', 'priority', 'url'],
      pagination: {
        page: PAGE,
        pageSize: PAGE_SIZE,
      },
    },
  });

  const { data } = response;

  const content = `${TOP_LINE}

import type { TechSkillData } from '~/types/response';

const techSkillData: TechSkillData = ${JSON.stringify(data, null, 2)};

export default techSkillData;
`;

  const pathname = path.join(dataDirPath, 'tech-skills.ts');
  await fs.writeFile(pathname, content, { encoding: 'utf-8' });
  logger.success(
    `Generated ${data.length} tech skills to ${getRelativePath(
      pathname,
    )}`,
  );
}
