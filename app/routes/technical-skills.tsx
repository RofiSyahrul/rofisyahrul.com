import { lazy, Suspense } from 'react';

import type {
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from 'remix';

import { useUserAgent } from '~/contexts/user-agent';
import { buildLinks } from '~/lib/links';
import { buildMeta } from '~/lib/meta';
import { links as homepageLinks } from '~/pages/home/links';
import type { HomeData } from '~/pages/home/types';
import { fetchTechSkills } from '~/repositories/tech-skill/fetcher.server';
import type { TechSkillFields } from '~/repositories/tech-skill/types';
import popupStyleURL from '~/styles/popup.css';

const title = 'Techincal Skills';

const Homepage = lazy(() => import('~/pages/home'));

const DesktopTechnicalSkillsPopup = lazy(
  () => import('~/pages/technical-skills/desktop'),
);

const MobileTechnicalSkillsPage = lazy(
  () => import('~/pages/technical-skills/mobile'),
);

export const loader: LoaderFunction = async () => {
  const data = await fetchTechSkills();
  return data;
};

export const links: LinksFunction = () => {
  const homepageLinkDescriptors = homepageLinks();

  return [...homepageLinkDescriptors, ...buildLinks([popupStyleURL])];
};

export const meta: MetaFunction = ctx => {
  const data: TechSkillFields[] = ctx.data || [];
  const homeData: HomeData | null = ctx.parentsData.root?.generalData;

  const keyword = data.map(item => item.name).join(', ');
  const description = homeData?.totalTechSkills
    ? `${homeData.totalTechSkills} My technical skills. Here we go!`
    : undefined;

  return buildMeta({ description, keyword, title });
};

export default function TechnicalSkillsPage() {
  const { isMobile } = useUserAgent();

  if (isMobile) {
    return (
      <Suspense>
        <MobileTechnicalSkillsPage />
      </Suspense>
    );
  }

  return (
    <Suspense>
      <Homepage />
      <DesktopTechnicalSkillsPopup />
    </Suspense>
  );
}
