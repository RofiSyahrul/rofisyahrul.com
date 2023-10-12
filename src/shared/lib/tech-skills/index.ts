import techSkillData from '@/data/tech-skills';
import type { TechSkillFields } from '@/shared/types/response';

export function countTechSkills() {
  return techSkillData.length;
}

export function getTechSkills(): TechSkillFields[] {
  return techSkillData.map(({ attributes }) => attributes);
}
