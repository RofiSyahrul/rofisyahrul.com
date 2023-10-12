import { getTechSkills } from '@/shared/lib/tech-skills';
import type { GetServerData } from '@/shared/types/general';
import type { TechSkillFields } from '@/shared/types/response';

export interface TechSkillsPageProps {
  techSkills: TechSkillFields[];
}

export const getServerData: GetServerData<
  TechSkillsPageProps
> = () => {
  return {
    techSkills: getTechSkills(),
  };
};
