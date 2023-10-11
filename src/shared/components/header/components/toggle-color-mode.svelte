<script lang="ts">
  import Cookies from 'js-cookie';

  import { COLOR_MODE } from '@/shared/constants/cookie-keys';
  import { ONE_YEAR_IN_DAYS } from '@/shared/constants/times';
  import { colorMode } from '@/shared/stores/color-mode';

  export let title: string;

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
  class="btn btn-solid btn-primary
    umami--click--header__toggle-color-mode"
  {title}
  on:click={toggleColorMode}
>
  <slot />
</button>

<style>
  .btn {
    height: 32px;
  }
</style>
