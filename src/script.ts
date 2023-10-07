import Cookies from 'js-cookie';

import { COLOR_MODE } from './shared/constants/cookie-keys';
import { requestIdleCallback } from './shared/lib/client/idle-callback';
import { isColorMode, type ColorMode } from './shared/lib/color-mode';
import { colorMode } from './shared/stores/color-mode';

function injectColorModeToDOM(doc: Document, value: ColorMode) {
  doc.documentElement.classList.add(value);
  doc.documentElement.dataset.colorMode = value;
}

function getPreferredColorMode(win: Window): ColorMode {
  let isPreferDark = false;
  try {
    isPreferDark = win.matchMedia(
      '(prefers-color-scheme: dark)',
    ).matches;
  } catch {
    // silent error
  }

  return isPreferDark ? 'dark' : 'light';
}

function initColorModeStore(win: Window, doc: Document) {
  const colorModeFromDOM = doc.documentElement.dataset.colorMode;
  if (isColorMode(colorModeFromDOM)) {
    colorMode.set(colorModeFromDOM);
    return;
  }

  const colorModeCookie = Cookies.get(COLOR_MODE);
  if (isColorMode(colorModeCookie)) {
    injectColorModeToDOM(doc, colorModeCookie);
    colorMode.set(colorModeCookie);
    return;
  }

  colorMode.set('light');

  const preferredColorMode = getPreferredColorMode(win);
  injectColorModeToDOM(doc, preferredColorMode);
  Cookies.set(COLOR_MODE, preferredColorMode);

  if (preferredColorMode === 'dark') {
    requestIdleCallback(() => {
      colorMode.set(preferredColorMode);
    });
  }
}

function initClientSide(win: Window, doc: Document) {
  initColorModeStore(win, doc);

  doc.addEventListener('astro:after-swap', () => {
    initColorModeStore(win, doc);
  });
}

initClientSide(window, document);
