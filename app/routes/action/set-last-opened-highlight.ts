import type { ActionFunction, LoaderFunction } from '@remix-run/node';
import { redirect, json } from '@remix-run/node';

import { getHighlightsSession } from '~/lib/cookies/highlights.server';
import type { HighlightName } from '~/types/highlights';
import { HIGHLIGHT_NAMES } from '~/types/highlights';

function isValidHighlightName(name: any): name is HighlightName {
  return HIGHLIGHT_NAMES.includes(name);
}

export const action: ActionFunction = async ({ request }) => {
  const session = await getHighlightsSession(request);
  const requestText = await request.text();
  const form = new URLSearchParams(requestText);

  const highlightName = form.get('name');
  if (!isValidHighlightName(highlightName)) {
    return json({
      success: false,
      message: `"${highlightName}" is not a valid highlight name`,
    });
  }

  const lastOpened = form.get('value');

  if (lastOpened) {
    session.setLastOpened(highlightName, lastOpened);
  } else {
    session.removeLastOpened(highlightName);
  }

  return json(
    { success: true },
    { headers: { 'Set-Cookie': await session.commit() } },
  );
};

export const loader: LoaderFunction = () =>
  redirect('/', { status: 404 });
