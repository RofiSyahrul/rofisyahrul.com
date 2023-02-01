import type { ReactNode } from 'react';
import { useEffect } from 'react';

import type { HtmlMetaDescriptor } from '@remix-run/react';
import {
  useTransition,
  useCatch,
  useLoaderData,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react';
import type {
  LinkDescriptor,
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from '@remix-run/server-runtime';
import clsx from 'clsx';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import NProgress from 'nprogress';

import config from './config';
import { storageKeys } from './constants/storage-keys';
import { UserAgentContext } from './contexts/user-agent/context';
import type { ColorMode } from './lib/color-mode';
import { getColorModeSession } from './lib/cookies/color-mode.server';
import { buildLinks } from './lib/links';
import { buildMeta, defaultTitle } from './lib/meta';
import { parseUserAgent } from './lib/ua-parser.server';
import CatchPage from './pages/error/catch';
import { useInitColorMode } from './store/color-mode';
import appStyleURL from './styles/app.css';
import nProgressStyleURL from './styles/nprogress.css';
import tailwindStyleURL from './styles/tailwind.css';
import type { UserAgent } from './types/general';
import { repository } from '../package.json';

dayjs.extend(advancedFormat);

const faviconSizes = ['16', '32'];

const appleIconSizes = [
  '180',
  '152',
  '144',
  '120',
  '114',
  '76',
  '72',
  '60',
  '57',
];

function buildManifestIconLinks(): LinkDescriptor[] {
  const linkDescriptors: LinkDescriptor[] =
    config.manifest.iconSizes.map(iconSize => ({
      rel: 'icon',
      type: 'image/png',
      href: `/icons/android-chrome-${iconSize}x${iconSize}.png`,
    }));

  return linkDescriptors.concat(
    faviconSizes.map(iconSize => {
      const sizes = `${iconSize}x${iconSize}`;
      return {
        rel: 'icon',
        type: 'image/png',
        href: `/icons/favicon-${sizes}.png`,
        sizes,
      };
    }),
    appleIconSizes.map(iconSize => {
      const sizes = `${iconSize}x${iconSize}`;
      return {
        rel: 'apple-touch-icon',
        type: 'image/png',
        href: `/icons/apple-touch-icon-${sizes}.png`,
        sizes,
      };
    }),
    [
      {
        rel: 'mask-icon',
        href: '/icons/safari-pinned-tab.svg',
        color: config.manifest.themeColor,
      },
    ],
  );
}

export const links: LinksFunction = () => {
  return buildLinks(
    [tailwindStyleURL, appStyleURL, nProgressStyleURL],
    [
      {
        rel: 'manifest',
        href: '/manifest.json',
      },
      {
        rel: 'icon',
        href: '/favicon.ico',
      },
      {
        rel: 'shortcut icon',
        href: '/favicon.ico',
      },
      ...buildManifestIconLinks(),
    ],
  );
};

function buildAppleAppMeta(): HtmlMetaDescriptor {
  return {
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-title': config.manifest.name,
    'apple-mobile-web-app-status-bar-style': 'default',
  };
}

function buildMSAppMeta(): HtmlMetaDescriptor {
  const msAppMeta: HtmlMetaDescriptor = {
    'msapplication-navbutton-color': config.manifest.themeColor,
    'msapplication-TileColor': config.manifest.backgroundColor,
    'msapplication-starturl': '/',
    'msapplication-tap-highlight': 'no',
  };

  const { msTileIcon } = config.manifest;
  for (const size in msTileIcon) {
    const iconSize = size as keyof typeof msTileIcon;
    const name = `msapplication-${msTileIcon[iconSize]}${iconSize}`;
    const content = `/icons/mstile-${iconSize}.png`;
    msAppMeta[name] = content;
  }

  return msAppMeta;
}

export const meta: MetaFunction = () => {
  return {
    ...buildAppleAppMeta(),
    ...buildMSAppMeta(),
    ...buildMeta({ shouldHideTitle: true }),
  };
};

interface LoaderData {
  colorMode: ColorMode | null;
  ENV: WindowEnv;
  userAgent: UserAgent;
}

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getColorModeSession(request);
  const userAgent = parseUserAgent(request);

  const data: LoaderData = {
    colorMode: session.getColorMode(),
    ENV: {
      APP_URL: process.env.APP_URL || 'https://rofisyahrul.com',
      PUBLIC_ANALYTICS_SCRIPT_URL:
        process.env.PUBLIC_ANALYTICS_SCRIPT_URL ?? '',
      PUBLIC_ANALYTICS_VIEW_URL:
        process.env.PUBLIC_ANALYTICS_VIEW_URL ?? '',
      PUBLIC_ANALYTICS_WEB_ID:
        process.env.PUBLIC_ANALYTICS_WEB_ID ?? '',
      REPOSITORY_URL: repository.url,
    },
    userAgent,
  };

  return data;
};

function setColorMode() {
  let preferedColorMode: ColorMode;
  try {
    const isPreferDark = window.matchMedia(
      '(prefers-color-scheme: dark)',
    ).matches;
    preferedColorMode = isPreferDark ? 'dark' : 'light';
  } catch {
    preferedColorMode = 'light';
  }
  const root = document.documentElement;
  const unPreferedColorMode: ColorMode =
    preferedColorMode === 'dark' ? 'light' : 'dark';
  if (root.classList.contains(unPreferedColorMode)) {
    root.classList.remove(unPreferedColorMode);
  }
  root.classList.add(preferedColorMode);
}

function FooterNav({ env }: Pick<DocumentProps, 'env'>) {
  if (!env?.PUBLIC_ANALYTICS_VIEW_URL && !env?.REPOSITORY_URL) {
    return null;
  }

  return (
    <nav>
      <ul className='flex gap-2'>
        {env.PUBLIC_ANALYTICS_VIEW_URL && (
          <li>
            <a
              href={env.PUBLIC_ANALYTICS_VIEW_URL}
              target='_blank'
              rel='noreferrer noopener'
              className='btn btn-text btn-primary umami--click--footer__see-analytics'
            >
              Analytics
            </a>
          </li>
        )}

        {env.REPOSITORY_URL && (
          <li>
            <a
              href={env.REPOSITORY_URL}
              target='_blank'
              rel='noreferrer noopener'
              className='btn btn-text btn-primary umami--click--footer__see-repository'
            >
              GitHub
            </a>
          </li>
        )}
      </ul>
    </nav>
  );
}

interface DocumentProps {
  children: ReactNode;
  colorMode?: ColorMode | null;
  env?: WindowEnv;
  isMobile?: boolean;
  title?: string;
}

function Document({
  children,
  colorMode: colorModeProp = null,
  env,
  isMobile,
  title = defaultTitle,
}: DocumentProps) {
  const { colorMode } = useInitColorMode(colorModeProp);
  const transition = useTransition();

  useEffect(() => {
    if (transition.state === 'idle') NProgress.done();
    else {
      NProgress.start();
      if (transition.state === 'loading') {
        sessionStorage.setItem(storageKeys.isInternalRouting, 'true');
      }
    }
  }, [transition.state]);

  return (
    <html
      lang='en'
      className={`${colorMode} ${isMobile ? 'mobile' : 'desktop'}`}
    >
      <head>
        <meta charSet='utf-8' />
        <meta httpEquiv='X-UA-Compatible' content='IE=edge' />
        <meta
          name='viewport'
          content='width=device-width,initial-scale=1'
        />
        <meta
          name='theme-color'
          content={config.manifest.themeColor}
        />
        <meta
          name='application-name'
          content={config.manifest.name}
        />
        <Meta />
        <Links />
        <title>
          {title !== defaultTitle
            ? `${title} | ${defaultTitle}`
            : title}
        </title>
        {process.env.NODE_ENV === 'production' &&
          env?.PUBLIC_ANALYTICS_SCRIPT_URL &&
          env?.PUBLIC_ANALYTICS_WEB_ID && (
            <script
              async
              defer
              data-website-id={env.PUBLIC_ANALYTICS_WEB_ID}
              src={env.PUBLIC_ANALYTICS_SCRIPT_URL}
            />
          )}
      </head>
      <body>
        {!colorModeProp && (
          <script
            dangerouslySetInnerHTML={{
              __html: `(${String(setColorMode)})()`,
            }}
          />
        )}
        {children}

        <footer
          className={clsx(
            'w-full max-w-5xl mx-auto border-t border-solid',
            'border-t-neutral-bright1 dark:border-t-neutral-dim1 p-3',
            'flex flex-col gap-2 items-center',
          )}
        >
          <FooterNav env={env} />
          <p className='text-sm'>{`© ${new Date().getFullYear()} Syahrul Rofi`}</p>
        </footer>

        {env && (
          <script
            dangerouslySetInnerHTML={{
              __html: `window.ENV = ${JSON.stringify(env)}`,
            }}
          />
        )}

        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export default function App() {
  const data = useLoaderData<LoaderData>();
  return (
    <Document
      colorMode={data.colorMode}
      env={data.ENV}
      isMobile={data.userAgent.isMobile}
    >
      <UserAgentContext.Provider value={data.userAgent}>
        <Outlet />
      </UserAgentContext.Provider>
    </Document>
  );
}

export function CatchBoundary() {
  const { data, status, statusText } = useCatch();

  return (
    <Document title={`${status} ${statusText}`}>
      <CatchPage status={status} statusText={statusText}>
        {typeof data === 'string' ? data : ''}
      </CatchPage>
    </Document>
  );
}

interface ErrorBoundaryProps {
  error: Error;
}

export function ErrorBoundary({ error }: ErrorBoundaryProps) {
  if (
    error.message.toLowerCase().startsWith('no route matches url')
  ) {
    return (
      <Document title='404 Not Found'>
        <CatchPage status={404} statusText='Not Found' />
      </Document>
    );
  }

  return (
    <Document title='Error!!'>
      <CatchPage
        status={500}
        statusText='Internal Server Error'
        title='My Bad..'
      >
        {process.env.NODE_ENV === 'development' && (
          <pre>{error.message}</pre>
        )}
      </CatchPage>
    </Document>
  );
}
