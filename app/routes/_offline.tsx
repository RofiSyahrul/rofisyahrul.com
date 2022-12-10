import type { MetaFunction } from 'remix';

import { buildMeta } from '~/lib/meta';
import CatchPage from '~/pages/error/catch';

export const meta: MetaFunction = () => {
  return buildMeta({ noIndex: true });
};

export default function OfflinePage() {
  return <CatchPage status={500} statusText='You are offline' />;
}
