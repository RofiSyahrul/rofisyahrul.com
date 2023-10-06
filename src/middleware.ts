import type { AstroCookies } from 'astro';
import { defineMiddleware } from 'astro:middleware';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import UAParser from 'ua-parser-js';

import { COLOR_MODE } from './shared/constants/cookie-keys';
import { isColorMode, type ColorMode } from './shared/lib/color-mode';
import type { UserAgent } from './shared/types/user-agent';

dayjs.extend(advancedFormat);

function getColorMode(cookies: AstroCookies): ColorMode {
  const colorModeCookie = cookies.get(COLOR_MODE);
  if (colorModeCookie && isColorMode(colorModeCookie.value)) {
    return colorModeCookie.value;
  }
  return 'light';
}

const mobileDeviceTypes = new Set([
  UAParser.DEVICE.MOBILE,
  UAParser.DEVICE.TABLET,
  UAParser.DEVICE.WEARABLE,
]);

function parseUserAgent(request: Request): UserAgent {
  const userAgent = request.headers.get('user-agent') ?? '';
  const parsedUA = UAParser(userAgent);

  const { browser, device } = parsedUA ?? {};
  const deviceType = device?.type ?? '';
  const isMobile = mobileDeviceTypes.has(deviceType);

  return {
    browser: {
      name: browser?.name ?? '',
      version: browser?.version ?? '',
    },
    device: {
      model: device?.model ?? '',
      type: deviceType,
      vendor: device?.vendor ?? '',
    },
    isMobile,
  };
}

// `context` and `next` are automatically typed
export const onRequest = defineMiddleware((context, next) => {
  context.locals.colorMode = getColorMode(context.cookies);
  context.locals.userAgent = parseUserAgent(context.request);
  return next();
});
