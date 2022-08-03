import fetcher from '~/repositories/fetcher.server';

import type { TechSkillFields, TechSkillResponse } from './types';

const path = '/api/technical-skills';

export async function countTechSkills(): Promise<number> {
  try {
    const res = await fetcher<TechSkillResponse, TechSkillFields>({
      path,
      query: {
        pagination: {
          pageSize: 1,
        },
      },
    });
    return res.meta.pagination.pageCount;
  } catch {
    return 0;
  }
}
