import { useParams } from 'remix';

import ComingSoonPage from '~/pages/error/coming-soon';

export default function PortfolioDetailPage() {
  const { slug } = useParams<'slug'>();
  return <ComingSoonPage title={`Portfolio: ${slug}`} />;
}
