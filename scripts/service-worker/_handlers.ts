import {
  ASSET_CACHE,
  cacheableHosts,
  DATA_CACHE,
  DOCUMENT_CACHE,
  EXTERNAL_ASSET_CACHE,
  imageFallback,
  offlineRoute,
  OFFLINE_CACHE,
  staticAssets,
  worker,
} from './__config';
import {
  debug,
  isAssetRequest,
  isDocumentRequest,
  isExternalAssetRequest,
  isLoaderRequest,
} from './__utils';

async function install() {
  const [assetCache, offlineCache] = await Promise.all([
    caches.open(ASSET_CACHE),
    caches.open(OFFLINE_CACHE),
  ]);

  await Promise.all([
    assetCache.addAll(staticAssets),
    offlineCache.add(offlineRoute),
  ]);

  await worker.skipWaiting();
}

export function handleInstall(event: ExtendableEvent) {
  event.waitUntil(install());
  debug('Service worker installed');
}

async function activate() {
  const validCacheKeys = [
    ASSET_CACHE,
    DATA_CACHE,
    DOCUMENT_CACHE,
    EXTERNAL_ASSET_CACHE,
    OFFLINE_CACHE,
  ];

  const cacheKeys = await caches.keys();

  for (const cacheKey of cacheKeys) {
    if (!validCacheKeys.includes(cacheKey)) {
      debug('Removing outdated cache', cacheKey);
      await caches.delete(cacheKey);
    }
  }

  await worker.clients.claim();
}

export async function handleActivate(event: ExtendableEvent) {
  event.waitUntil(activate());
  debug('Service worker activated');
}

async function fetchAsset(
  req: Request,
  href: string,
  variant: 'internal' | 'external' = 'internal',
) {
  let cacheName = ASSET_CACHE;
  if (variant === 'external') {
    cacheName = EXTERNAL_ASSET_CACHE;
  }

  const cached = await caches.match(req, {
    cacheName,
    ignoreSearch: true,
    ignoreVary: true,
  });

  if (cached) {
    debug('Serving asset from cache', href);
    return cached;
  }

  try {
    debug('Serving asset from network', href);
    const response = await fetch(req);
    const cache = await caches.open(cacheName);
    await cache.put(req, response.clone());
    return response;
  } catch (error) {
    if (variant === 'external' && href.includes('/image/')) {
      debug('Serving asset from fallback');
      const fallbackResponse = await caches.match(imageFallback, {
        cacheName: ASSET_CACHE,
      });
      if (fallbackResponse) return fallbackResponse;
    }
    throw error;
  }
}

async function fetchLoader(req: Request, href: string) {
  try {
    debug('Serving data from network', href);
    const response = await fetch(req.clone());
    const cache = await caches.open(DATA_CACHE);
    await cache.put(req, response.clone());
    return response;
  } catch {
    debug(
      'Serving data from network failed, falling back to cache',
      href,
    );

    const response = await caches.match(req, {
      cacheName: DATA_CACHE,
    });

    if (response) {
      response.headers.set('X-Service-Worker', 'yes');
      return response;
    }

    const headers = new Headers();
    headers.set('Content-Type', 'application/json; charset=utf-8');
    headers.set('X-Remix-Catch', 'yes');
    headers.set('X-Service-Worker', 'yes');

    return new Response(JSON.stringify(''), {
      headers,
      status: 500,
      statusText: 'You are offline',
    });
  }
}

async function fetchDocument(req: Request, href: string) {
  try {
    debug('Serving document from network', href);
    const response = await fetch(req);
    const cache = await caches.open(DOCUMENT_CACHE);
    await cache.put(req, response.clone());
    return response;
  } catch (error) {
    debug(
      'Serving document from network failed, falling back to cache',
      href,
    );

    let response = await caches.match(req);
    if (response) {
      response.headers.set('X-Service-Worker', 'yes');
      return response;
    }

    response = await caches.match(offlineRoute, {
      cacheName: OFFLINE_CACHE,
    });

    if (response) {
      const headers = new Headers();
      headers.set('Location', offlineRoute);
      return new Response(null, { headers, status: 302 });
    }

    throw error;
  }
}

async function fetcher(request: Request, url: URL) {
  if (isAssetRequest(request, url)) {
    return fetchAsset(request, url.pathname);
  }

  if (isExternalAssetRequest(request, url)) {
    return fetchAsset(request, url.href, 'external');
  }

  if (isLoaderRequest(request, url)) {
    return fetchLoader(request, url.pathname + url.search);
  }

  if (isDocumentRequest(request)) {
    return fetchDocument(request, url.pathname);
  }

  return fetch(request);
}

export function handleFetch(event: FetchEvent) {
  const url = new URL(event.request.url);

  const selfHostname = worker.self.location.hostname;
  const isInternal = selfHostname === url.hostname;

  if (
    isInternal ||
    (cacheableHosts.includes(url.hostname) &&
      !url.pathname.includes('/video/'))
  ) {
    event.respondWith(fetcher(event.request, url));
  }
}
