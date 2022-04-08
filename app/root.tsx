import type { LinksFunction, MetaFunction } from 'remix';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from 'remix';

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

export default function App() {
  return (
    <html lang='en' className='dark'>
      <head>
        <meta charSet='utf-8' />
        <meta
          name='viewport'
          content='width=device-width,initial-scale=1'
        />
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
