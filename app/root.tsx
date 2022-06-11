import type { ReactNode } from 'react';

import type {
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from 'remix';
import {
  useCatch,
  useLoaderData,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from 'remix';

import type { ColorMode } from './lib/color-mode';
import { getColorModeSession } from './lib/color-mode.server';
import { defaultTitle } from './lib/meta';
import CatchPage from './pages/error/catch';
import { useInitColorMode } from './store/color-mode';
import appStyleURL from './styles/app.css';
import tailwindStyleURL from './styles/tailwind.css';

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: tailwindStyleURL },
    { rel: 'stylesheet', href: appStyleURL },
  ];
};

export const meta: MetaFunction = () => {
  return { title: 'Syahrul Rofi' };
};

interface LoaderData {
  colorMode: ColorMode | null;
  ENV: WindowEnv;
}

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getColorModeSession(request);
  const data: LoaderData = {
    colorMode: session.getColorMode(),
    ENV: {
      APP_URL: process.env.APP_URL || 'https://rofisyahrul.com',
    },
  };
  return data;
};

interface DocumentProps {
  children: ReactNode;
  colorMode?: ColorMode | null;
  title?: string;
}

function Document({
  children,
  colorMode: colorModeProp = null,
  title = defaultTitle,
}: DocumentProps) {
  const { colorMode } = useInitColorMode(colorModeProp);

  return (
    <html lang='en' className={colorMode}>
      <head>
        <meta charSet='utf-8' />
        <meta httpEquiv='X-UA-Compatible' content='IE=edge' />
        <meta
          name='viewport'
          content='width=device-width,initial-scale=1'
        />
        <meta name='robots' content='noindex' />
        <title>
          {title !== defaultTitle
            ? `${title} | ${defaultTitle}`
            : title}
        </title>
        <Meta />
        <Links />
      </head>
      <body>
        {children}
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
    <Document colorMode={data.colorMode}>
      <Outlet />
      <script
        dangerouslySetInnerHTML={{
          __html: `window.ENV = ${JSON.stringify(data.ENV)}`,
        }}
      />
    </Document>
  );
}

export function CatchBoundary() {
  const { status, statusText } = useCatch();

  return (
    <Document title={`${status} ${statusText}`}>
      <CatchPage status={status} statusText={statusText} />
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
