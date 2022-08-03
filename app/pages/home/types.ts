import type { FetchPortfolioFeedsResult } from '~/repositories/portfolio/types';
import type { ProfileContent } from '~/repositories/profile/types';

export interface HomeData {
  profile: ProfileContent;
  portfolio: FetchPortfolioFeedsResult;
  totalTechSkills: number;
}
