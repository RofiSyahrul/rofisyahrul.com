import type { MetaFunction } from 'remix';
import { useParams } from 'remix';

import { buildMeta } from '~/lib/meta';
import ComingSoonPage from '~/pages/error/coming-soon';

export const meta: MetaFunction = ({ params }) => {
  const { slug } = params || {};
  return buildMeta({ title: `Portfolio: ${slug}` });
};

export default function PortfolioDetailPage() {
  const { slug } = useParams<'slug'>();
  return <ComingSoonPage title={`Portfolio: ${slug}`} />;
}
