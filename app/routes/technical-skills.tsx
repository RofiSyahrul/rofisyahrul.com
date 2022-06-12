import { buildMeta } from '~/lib/meta';
import ComingSoonPage from '~/pages/error/coming-soon';

const title = 'Techincal Skills';

export function meta() {
  return buildMeta({ title });
}

export default function TechnicalSkillsPage() {
  return <ComingSoonPage title={title} />;
}
