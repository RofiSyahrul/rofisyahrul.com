<script lang="ts">
  import Cookies from 'js-cookie';

  import { COLOR_MODE } from '@/shared/constants/cookie-keys';
  import { ONE_YEAR_IN_DAYS } from '@/shared/constants/times';
  import Moon from '@/shared/icons/moon.svelte';
  import Sun from '@/shared/icons/sun.svelte';
  import type { ColorMode } from '@/shared/lib/color-mode';

  export let currentColorMode: ColorMode;

  const description = 'Change color mode';

  function getOppositeColorMode(colorMode: ColorMode): ColorMode {
    return colorMode === 'dark' ? 'light' : 'dark';
  }

  function toggleColorMode() {
    const prevColorMode = currentColorMode;
    currentColorMode = getOppositeColorMode(currentColorMode);

    Cookies.set(COLOR_MODE, currentColorMode, {
      expires: ONE_YEAR_IN_DAYS,
      path: '/',
      sameSite: 'Lax',
    });

    document.documentElement.classList.remove(prevColorMode);
    document.documentElement.classList.add(currentColorMode);
  }
</script>

<button
  class="btn btn-solid btn-primary h-8
    umami--click--header__toggle-color-mode"
  on:click={toggleColorMode}
  title={description}
>
  <Sun />
  <Moon />
  <span class="visually-hidden">{description}</span>
</button>
