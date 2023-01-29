import { PassThrough } from 'stream';

import type { RenderToPipeableStreamOptions } from 'react-dom/server';
import { renderToPipeableStream } from 'react-dom/server';

import { RemixServer } from '@remix-run/react';
import type { EntryContext } from '@remix-run/server-runtime';
import isbot from 'isbot';

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) {
  const isBot = isbot(request.headers.get('user-agent'));
  const callbackName: keyof RenderToPipeableStreamOptions = isBot
    ? 'onAllReady'
    : 'onShellReady';

  return new Promise((resolve, reject) => {
    let didError = false;
    const stream = renderToPipeableStream(
      <RemixServer context={remixContext} url={request.url} />,
      {
        [callbackName]() {
          const body = new PassThrough();

          responseHeaders.set('Content-Type', 'text/html');
          responseHeaders.set('Transfer-Encoding', 'chunked');
          responseHeaders.set('Connection', 'keep-alive');

          resolve(
            new Response(body as any, {
              status: didError ? 500 : responseStatusCode,
              headers: responseHeaders,
            }),
          );

          stream.pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          didError = true;
          // eslint-disable-next-line no-console
          console.error('Error on render to pipeable stream', error);
        },
      },
    );
  });
}
