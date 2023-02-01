import { createCookieSessionStorage } from '@remix-run/node';

import {
  ONE_DAY_IN_HOURS,
  ONE_HOUR_IN_MINUTES,
  ONE_MINUTE_IN_SECONDS,
} from '~/constants/times';
import type { HighlightName } from '~/types/highlights';

import { sessionSecret } from './_constants.server';

const MAX_AGE_IN_DAYS = 14;

const storiesStorage = createCookieSessionStorage({
  cookie: {
    name: '__loh__',
    secure: true,
    secrets: [sessionSecret],
    sameSite: 'lax',
    maxAge:
      MAX_AGE_IN_DAYS *
      ONE_DAY_IN_HOURS *
      ONE_HOUR_IN_MINUTES *
      ONE_MINUTE_IN_SECONDS,
    path: '/',
    httpOnly: true,
  },
});

export async function getHighlightsSession(request: Request) {
  const session = await storiesStorage.getSession(
    request.headers.get('Cookie'),
  );

  return {
    getLastOpened(name: HighlightName): string | null {
      const value = session.get(name);
      if (typeof value === 'string') return value;
      return null;
    },
    setLastOpened(name: HighlightName, value: string) {
      session.set(name, value);
    },
    removeLastOpened(name: HighlightName) {
      session.unset(name);
    },
    commit() {
      return storiesStorage.commitSession(session);
    },
  };
}
