import type { ActionFunction, LoaderFunction } from 'remix';
import { redirect, json } from 'remix';

import { isColorMode } from '~/lib/color-mode';
import { getColorModeSession } from '~/lib/color-mode.server';

export const action: ActionFunction = async ({ request }) => {
  const colorModeSession = await getColorModeSession(request);
  const requestText = await request.text();
  const form = new URLSearchParams(requestText);
  const colorMode = form.get('colorMode');

  if (!isColorMode(colorMode)) {
    return json({
      success: false,
      message: `color mode value of ${colorMode} is not a valid color mode`,
    });
  }

  colorModeSession.setColorMode(colorMode);
  return json(
    { success: true },
    { headers: { 'Set-Cookie': await colorModeSession.commit() } },
  );
};

export const loader: LoaderFunction = () =>
  redirect('/', { status: 404 });
