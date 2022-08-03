import type { GeneralResponse } from '~/types/response';

export interface TechSkillFields {
  name: string;
  priority: number;
  url: string | null;
}

export type TechSkillResponse = GeneralResponse<TechSkillFields>;
