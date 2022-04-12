import { createCookieSessionStorage } from 'remix';

import type { ColorMode } from './color-mode';
import { isColorMode } from './color-mode';

const sessionSecret = process.env.SESSION_SECRET ?? 'DEFAULT_SECRET';

const colorModeStorage = createCookieSessionStorage({
  cookie: {
    name: 'color_mode',
    secure: true,
    secrets: [sessionSecret],
    sameSite: 'lax',
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
