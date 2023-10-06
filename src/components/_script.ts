import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';

import type { ColorMode } from '@/shared/lib/color-mode';
import { isColorMode } from '@/shared/lib/color-mode';
import { colorMode } from '@/shared/stores/color-mode';

dayjs.extend(advancedFormat);

function initStores() {
  const { colorMode: colorModeFromDOM } =
    document.documentElement.dataset;

  const initialColorMode: ColorMode = isColorMode(colorModeFromDOM)
    ? colorModeFromDOM
    : 'light';

  colorMode.set(initialColorMode);
}

initStores();
