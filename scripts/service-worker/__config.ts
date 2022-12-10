/// <reference lib="WebWorker" />

declare const CACHE_VERSION: string;
declare const STATIC_ASSETS: string[];
declare const HOSTS_WITH_CACHEABLE_ASSETS: string[];

export const ASSET_CACHE = `asset-cache__${CACHE_VERSION}`;
export const DATA_CACHE = `data-cache__${CACHE_VERSION}`;
export const DOCUMENT_CACHE = `document-cache__${CACHE_VERSION}`;
export const EXTERNAL_ASSET_CACHE = `external-asset-cache`;
export const OFFLINE_CACHE = `offline-cache__${CACHE_VERSION}`;

export const staticAssets = STATIC_ASSETS;
export const cacheableHosts = HOSTS_WITH_CACHEABLE_ASSETS || [];
export const offlineRoute = '/_offline';
export const imageFallback = '/icons/android-chrome-192x192.png';

export const worker = self as unknown as ServiceWorkerGlobalScope;
