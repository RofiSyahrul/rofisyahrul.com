<script lang="ts">
  import goBack from '@/shared/lib/client/go-back';

  export let title: string;
</script>

<button
  class="btn btn-text umami--click--header__go-back"
  {title}
  on:click={goBack}
>
  <slot />
</button>

<style>
  .btn {
    padding: 8px 0;
  }
</style>
