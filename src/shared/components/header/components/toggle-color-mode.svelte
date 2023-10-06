<script lang="ts">
  import Cookies from 'js-cookie';

  import { COLOR_MODE } from '@/shared/constants/cookie-keys';
  import { ONE_YEAR_IN_DAYS } from '@/shared/constants/times';
  import Moon from '@/shared/icons/moon.svelte';
  import Sun from '@/shared/icons/sun.svelte';
  import { colorMode } from '@/shared/stores/color-mode';

  const description = 'Change color mode';

  function toggleColorMode() {
    const prevColorMode = $colorMode;
    const newColorMode = prevColorMode === 'dark' ? 'light' : 'dark';

    $colorMode = newColorMode;
    Cookies.set(COLOR_MODE, newColorMode, {
      expires: ONE_YEAR_IN_DAYS,
      path: '/',
      sameSite: 'Lax',
    });

    document.documentElement.classList.remove(prevColorMode);
    document.documentElement.classList.add(newColorMode);
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
