import { lazy, Suspense } from 'react';

import type {
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from '@remix-run/server-runtime';

import Loading from '~/components/loading';
import { useUserAgent } from '~/contexts/user-agent';
import { buildLinks } from '~/lib/links';
import { buildMeta } from '~/lib/meta';
import type { HomeData } from '~/pages/home/types';
import { getTechSkills } from '~/repositories/tech-skill/fetcher.server';
import popupStyleURL from '~/styles/popup.css';
import type { TechSkillFields } from '~/types/response';

const title = 'Techincal Skills';

const DesktopTechnicalSkillsPopup = lazy(
  () => import('~/pages/technical-skills/desktop'),
);

const MobileTechnicalSkillsPage = lazy(
  () => import('~/pages/technical-skills/mobile'),
);

export const loader: LoaderFunction = async () => {
  return getTechSkills();
};

export const links: LinksFunction = () => {
  return buildLinks([popupStyleURL]);
};

export const meta: MetaFunction = ctx => {
  const data: TechSkillFields[] = ctx.data;
  const homeData: HomeData | null = ctx.parentsData['routes/__base'];

  const keyword = data?.map?.(item => item.name).join(', ');
  const description = homeData?.totalTechSkills
    ? `${homeData.totalTechSkills} My technical skills. Here we go!`
    : undefined;

  return buildMeta({ description, keyword, title });
};

export default function TechnicalSkillsPage() {
  const { isMobile } = useUserAgent();

  if (isMobile) {
    return (
      <Suspense fallback={<Loading variant='whole-page' />}>
        <MobileTechnicalSkillsPage />
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<Loading variant='with-backdrop' />}>
      <DesktopTechnicalSkillsPopup />
    </Suspense>
  );
}