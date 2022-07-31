import UAParser from 'ua-parser-js';

import type { UserAgent } from '~/types/general';

export function parseUserAgent(req: Request): UserAgent {
  const mobileDeviceTypes = [
    UAParser.DEVICE.MOBILE,
    UAParser.DEVICE.TABLET,
    UAParser.DEVICE.WEARABLE,
  ];

  const userAgent = req.headers.get('user-agent') ?? '';
  const parsedUA = UAParser(userAgent);
  const { browser, device } = parsedUA;
  const deviceType = device.type ?? '';
  const isMobile = mobileDeviceTypes.includes(deviceType as any);

  return {
    browser: {
      name: browser.name ?? '',
      version: browser.version ?? '',
    },
    device: {
      model: device.model ?? '',
      type: deviceType,
      vendor: device.vendor ?? '',
    },
    isMobile,
  };
}
