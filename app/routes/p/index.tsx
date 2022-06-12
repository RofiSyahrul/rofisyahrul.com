import { buildMeta } from '~/lib/meta';
import ComingSoonPage from '~/pages/error/coming-soon';

const title = 'Search Portfolio';

export function meta() {
  return buildMeta({ title });
}

export default function SearchPortfolioPage() {
  return <ComingSoonPage title={title} />;
}
