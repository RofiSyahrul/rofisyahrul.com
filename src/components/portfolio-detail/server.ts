import { getPortfolioDetail } from '@/shared/lib/portfolio';
import type { PortfolioDetail } from '@/shared/lib/portfolio/types';
import type { GetServerResponse } from '@/shared/types/general';
import notFound from '@/shared/utils/not-found';

export const getServerResponse: GetServerResponse<
  PortfolioDetail
> = astro => {
  const { slug } = astro.params;
  const portfolioDetail = getPortfolioDetail(slug);

  if (!portfolioDetail) return notFound();

  return {
    props: portfolioDetail,
  };
};
