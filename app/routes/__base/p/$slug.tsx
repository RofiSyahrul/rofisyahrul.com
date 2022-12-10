import { lazy, Suspense } from 'react';

import { useCatch } from '@remix-run/react';
import type {
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from 'remix';

import Loading from '~/components/loading';
import { useUserAgent } from '~/contexts/user-agent';
import { useBack } from '~/hooks/use-back';
import { buildLinks } from '~/lib/links';
import { buildMeta } from '~/lib/meta';
import { fetchPortfolioDetail } from '~/repositories/portfolio/fetcher.server';
import type { PortfolioDetail } from '~/repositories/portfolio/types';
import { parseError } from '~/repositories/utils.server';
import carouselStylesURL from '~/styles/carousel.css';
import popupStylesURL from '~/styles/popup.css';
import richTextStylesURL from '~/styles/rich-text.css';

const Popup = lazy(() => import('~/components/popup'));

const CatchPage = lazy(() => import('~/pages/error/catch'));

const DesktopPortfolioDetailPopup = lazy(
  () => import('~/pages/portfolio-detail/desktop'),
);

const MobilePortfolioDetailPage = lazy(
  () => import('~/pages/portfolio-detail/mobile'),
);

export const links: LinksFunction = () => {
  return buildLinks([
    carouselStylesURL,
    popupStylesURL,
    richTextStylesURL,
  ]);
};

export const meta: MetaFunction = ({ data, location, params }) => {
  if (!data) {
    const { slug } = params || {};
    return buildMeta({ title: `Portfolio: ${slug}` });
  }

  const portfolio: PortfolioDetail = data;
  return buildMeta({
    description: portfolio.description,
    image: portfolio.mediaList?.[0]?.url,
    pathname: location.pathname,
    title: portfolio.title,
  });
};

export const loader: LoaderFunction = async ({ params, request }) => {
  const slug = params?.slug ?? '';
  let data: PortfolioDetail | null;

  try {
    data = await fetchPortfolioDetail(slug);
  } catch (error) {
    const parsed = await parseError(error);
    throw new Response(parsed.data?.message, {
      status: parsed.status,
    });
  }

  if (!data) {
    throw new Response(
      `Portfolio with slug ${slug} is not available`,
      {
        status: 404,
        statusText: 'Not Found',
      },
    );
  }

  return data;
};

export default function PortfolioDetailPage() {
  const { isMobile } = useUserAgent();

  if (isMobile) {
    return (
      <Suspense fallback={<Loading variant='whole-page' />}>
        <MobilePortfolioDetailPage />
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<Loading variant='with-backdrop' />}>
      <DesktopPortfolioDetailPopup />
    </Suspense>
  );
}

export function CatchBoundary() {
  const { isMobile } = useUserAgent();
  const back = useBack();
  const { data, status, statusText } = useCatch();
  const text = typeof data === 'string' ? data : '';

  if (isMobile) {
    return (
      <Suspense fallback={<Loading variant='whole-page' />}>
        <CatchPage status={status} statusText={statusText}>
          {text}
        </CatchPage>
      </Suspense>
    );
  }

  const fancyStatus =
    statusText === 'You are offline'
      ? ''
      : String(status).replace(/0/g, '<span>0</span>');

  return (
    <Suspense fallback={<Loading variant='with-backdrop' />}>
      <Popup
        className='h-[400px] flex flex-col gap-2 items-center justify-center'
        isOpen
        isCloseButtonShown
        isForceRender
        onClose={back}
      >
        {fancyStatus && (
          <div
            className='fancy-text'
            dangerouslySetInnerHTML={{ __html: fancyStatus }}
          />
        )}
        <h1>{statusText}</h1>
        <p>{text}</p>
      </Popup>
    </Suspense>
  );
}
