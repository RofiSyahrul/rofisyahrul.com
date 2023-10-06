import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';

import type { ColorMode } from '@/shared/lib/color-mode';
import { colorMode } from '@/shared/stores/color-mode';

dayjs.extend(advancedFormat);

function initStores() {
  const { classList } = document.documentElement;
  const isDark = classList.contains('dark');
  const initialColorMode: ColorMode = isDark ? 'dark' : 'light';
  colorMode.set(initialColorMode);
}

initStores();
