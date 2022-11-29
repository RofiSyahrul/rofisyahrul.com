import type { TechSkillData, TechSkillFields } from './types';

let techSkillData: TechSkillData | undefined;

async function importTechSkillData() {
  if (techSkillData) return techSkillData;
  techSkillData = [...(await import('~/data/tech-skills.json'))];

  techSkillData.sort((item1, item2) => {
    const priorityComparison =
      item2.attributes.priority - item1.attributes.priority;

    if (priorityComparison === 0) {
      return item1.attributes.name.localeCompare(
        item2.attributes.name,
      );
    }

    return priorityComparison;
  });

  return techSkillData;
}

export async function countTechSkills(): Promise<number> {
  try {
    const data = await importTechSkillData();
    return data.length;
  } catch {
    return 0;
  }
}

export async function fetchTechSkills(): Promise<TechSkillFields[]> {
  try {
    const data = await importTechSkillData();
    return data.map(({ attributes }) => attributes);
  } catch {
    return [];
  }
}
