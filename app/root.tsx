import type {
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from 'remix';
import {
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
}

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getColorModeSession(request);
  const data: LoaderData = { colorMode: session.getColorMode() };
  return data;
};

export default function App() {
  const data = useLoaderData<LoaderData>();
  const { colorMode } = useInitColorMode(data.colorMode);

  return (
    <html lang='en' className={colorMode}>
      <head>
        <meta charSet='utf-8' />
        <meta
          name='viewport'
          content='width=device-width,initial-scale=1'
        />
        <meta name='robots' content='noindex' />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
