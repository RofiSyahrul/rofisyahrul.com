import type { AstroCookies } from 'astro';
import { defineMiddleware } from 'astro:middleware';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import UAParser from 'ua-parser-js';

import { COLOR_MODE } from './shared/constants/cookie-keys';
import { isColorMode, type ColorMode } from './shared/lib/color-mode';
import type { UABrowser, UserAgent } from './shared/types/user-agent';

dayjs.extend(advancedFormat);

function getColorMode(cookies: AstroCookies): ColorMode | null {
  const colorModeCookie = cookies.get(COLOR_MODE);
  if (colorModeCookie && isColorMode(colorModeCookie.value)) {
    return colorModeCookie.value;
  }
  return null;
}

const mobileDeviceTypes = new Set([
  UAParser.DEVICE.MOBILE,
  UAParser.DEVICE.WEARABLE,
]);

function isSupportAvif(browser: UABrowser): boolean {
  if (!browser.name) return false;

  const browserName = browser.name.toLowerCase();
  const isSafari = browserName.includes('safari');

  if (isSafari) {
    const SUPPORTED_SAFARI_VERSION_FOR_AVIF = 16;
    const majorVersion = parseInt(
      browser.version.split('.')[0] || '0',
    );
    return majorVersion >= SUPPORTED_SAFARI_VERSION_FOR_AVIF;
  }

  const isEdge = browserName.includes('edge');
  return !isEdge;
}

function parseUserAgent(request: Request): UserAgent {
  const userAgent = request.headers.get('user-agent') ?? '';
  const parsedUA = UAParser(userAgent);

  const { browser, device } = parsedUA ?? {};
  const deviceType = device?.type ?? '';
  const isMobile = mobileDeviceTypes.has(deviceType);

  const uaBrowser: UABrowser = {
    name: browser?.name ?? '',
    version: browser?.version ?? '',
  };

  return {
    browser: uaBrowser,
    device: {
      model: device?.model ?? '',
      type: deviceType,
      vendor: device?.vendor ?? '',
    },
    isMobile,
    isSupportAvif: isSupportAvif(uaBrowser),
  };
}

export const onRequest = defineMiddleware((context, next) => {
  context.locals.colorMode = getColorMode(context.cookies);
  context.locals.userAgent = parseUserAgent(context.request);
  return next();
});
