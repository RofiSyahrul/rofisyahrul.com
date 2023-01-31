import type { ActionFunction, LoaderFunction } from '@remix-run/node';
import { redirect, json } from '@remix-run/node';

import { getStoriesSession } from '~/lib/cookies/stories.server';

export const action: ActionFunction = async ({ request }) => {
  const session = await getStoriesSession(request);
  const requestText = await request.text();
  const form = new URLSearchParams(requestText);
  const lastOpenedStory = form.get('lastOpenedStory');

  if (lastOpenedStory) {
    session.setLastOpenedStory(lastOpenedStory);
  } else {
    session.removeLastOpenedStory();
  }

  return json(
    { success: true },
    { headers: { 'Set-Cookie': await session.commit() } },
  );
};

export const loader: LoaderFunction = () =>
  redirect('/', { status: 404 });
