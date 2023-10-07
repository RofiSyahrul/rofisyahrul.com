<script lang="ts">
  import goBack from '@/shared/lib/client/go-back';

  export let title = '';
</script>

<button
  class="btn btn-text py-2 px-0 umami--click--header__go-back"
  {title}
  on:click={goBack}
>
  <slot />
</button>
