import { cacheableHosts, staticAssets } from './__config';

declare const DEBUG: boolean;

export function debug(...messages: any[]) {
  if (DEBUG) {
    // eslint-disable-next-line no-console
    console.debug(...messages);
  }
}

function isGet(req: Request) {
  return req.method.toLowerCase() === 'get';
}

export function isAssetRequest(req: Request, url: URL) {
  return isGet(req) && staticAssets.includes(url.pathname);
}

export function isExternalAssetRequest(req: Request, url: URL) {
  return isGet(req) && cacheableHosts.includes(url.hostname);
}

export function isLoaderRequest(req: Request, url: URL) {
  return isGet(req) && !!url.searchParams.get('_data');
}

export function isDocumentRequest(req: Request) {
  return isGet(req) && req.mode === 'navigate';
}
