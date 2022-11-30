import { buildMeta } from '~/lib/meta';
import ComingSoonPage from '~/pages/error/coming-soon';

const title = 'Experiences Highlight';

export function meta() {
  return buildMeta({ noIndex: true, title });
}

export default function ExperiencesHighlightPage() {
  return <ComingSoonPage title={title} />;
}
