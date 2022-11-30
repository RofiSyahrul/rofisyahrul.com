import { buildMeta } from '~/lib/meta';
import ComingSoonPage from '~/pages/error/coming-soon';

const title = 'Blog Highlight';

export function meta() {
  return buildMeta({ noIndex: true, title });
}

export default function BlogHighlightPage() {
  return <ComingSoonPage title={title} />;
}
