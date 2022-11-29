import type { GeneralResponse, Item } from '~/types/response';

export interface TechSkillFields {
  name: string;
  priority: number;
  url: string | null;
}

export type TechSkillData = Item<TechSkillFields>[];

export type TechSkillResponse = GeneralResponse<TechSkillFields>;
