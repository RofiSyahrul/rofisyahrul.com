import techSkillData from '~/data/tech-skills';
import type { TechSkillFields } from '~/types/response';

export function countTechSkills(): number {
  return techSkillData.length;
}

export function getTechSkills(): TechSkillFields[] {
  return techSkillData.map(({ attributes }) => attributes);
}
