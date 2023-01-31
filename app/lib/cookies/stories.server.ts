import { createCookieSessionStorage } from '@remix-run/node';

import {
  ONE_DAY_IN_HOURS,
  ONE_HOUR_IN_MINUTES,
  ONE_MINUTE_IN_SECONDS,
} from '~/constants/times';

import { sessionSecret } from './_constants.server';

const SESSION_NAME = 'lastOpenedStory';

const storiesStorage = createCookieSessionStorage({
  cookie: {
    name: '__los__',
    secure: true,
    secrets: [sessionSecret],
    sameSite: 'lax',
    maxAge:
      ONE_DAY_IN_HOURS * ONE_HOUR_IN_MINUTES * ONE_MINUTE_IN_SECONDS,
    path: '/',
    httpOnly: true,
  },
});

export async function getStoriesSession(request: Request) {
  const session = await storiesStorage.getSession(
    request.headers.get('Cookie'),
  );

  return {
    getLastOpenedStory(): string | null {
      const value = session.get(SESSION_NAME);
      if (typeof value === 'string') return value;
      return null;
    },
    setLastOpenedStory(value: string) {
      session.set(SESSION_NAME, value);
    },
    removeLastOpenedStory() {
      session.unset(SESSION_NAME);
    },
    commit() {
      return storiesStorage.commitSession(session);
    },
  };
}
