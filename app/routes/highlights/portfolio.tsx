import { buildMeta } from '~/lib/meta';
import ComingSoonPage from '~/pages/error/coming-soon';

const title = 'Portfolio Highlight';

export function meta() {
  return buildMeta({ noIndex: true, title });
}

export default function PortfolioHighlightPage() {
  return <ComingSoonPage title={title} />;
}
