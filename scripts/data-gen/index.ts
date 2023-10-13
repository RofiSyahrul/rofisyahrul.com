import logger from 'scripts/logger';

import { fetchAndGeneratePortfolios } from './_portfolios';
import { fetchAndGenerateTechSkills } from './_tech-skills';
import { fetchAndGenerateTechStacks } from './_tech-stacks';

(async () => {
  try {
    await Promise.all([
      fetchAndGeneratePortfolios(),
      fetchAndGenerateTechStacks(),
      fetchAndGenerateTechSkills(),
    ]);
  } catch (error_) {
    const error = error_ as Error;
    logger.error(`Failed to generate data. Error: ${error.message}`);
  }
})();
