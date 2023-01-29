import { createCookieSessionStorage } from '@remix-run/node';

import type { ColorMode } from './color-mode';
import { isColorMode } from './color-mode';

const sessionSecret = process.env.SESSION_SECRET ?? 'DEFAULT_SECRET';

const ONE_MINUTE_IN_SECONDS = 60;
const ONE_HOUR_IN_MINUTES = 60;
const ONE_DAY_IN_HOURS = 24;
const ONE_YEAR_IN_DAYS = 365;

const colorModeStorage = createCookieSessionStorage({
  cookie: {
    name: 'color_mode',
    secure: true,
    secrets: [sessionSecret],
    sameSite: 'lax',
    maxAge:
      ONE_YEAR_IN_DAYS *
      ONE_DAY_IN_HOURS *
      ONE_HOUR_IN_MINUTES *
      ONE_MINUTE_IN_SECONDS,
    path: '/',
    httpOnly: true,
  },
});

export async function getColorModeSession(request: Request) {
  const session = await colorModeStorage.getSession(
    request.headers.get('Cookie'),
  );

  return {
    getColorMode() {
      const value = session.get('colorMode');
      return isColorMode(value) ? value : null;
    },
    setColorMode(colorMode: ColorMode) {
      session.set('colorMode', colorMode);
    },
    commit() {
      return colorModeStorage.commitSession(session);
    },
  };
}
