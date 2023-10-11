<script lang="ts">
  import Refresh from '@/shared/icons/refresh.svelte';

  export let isLoading: boolean;
</script>

<button
  class="btn btn-text btn-secondary"
  disabled={isLoading}
  title="Refresh"
  on:click
>
  {#if isLoading}
    <span class="spinner spinner-secondary" />
  {:else}
    <Refresh />
  {/if}
  <span class="visually-hidden">Refresh</span>
</button>

<style>
  button {
    height: 32px;
    z-index: 1;
  }

  .spinner {
    width: 20px;
    height: 20px;
  }
</style>
