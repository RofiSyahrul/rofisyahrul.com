<script lang="ts">
  import type { SpotifyNowPlayingData } from '@/shared/types/spotify';

  import Detail from './components/detail.svelte';
  import RefreshButton from './components/refresh-button.svelte';

  export let data: SpotifyNowPlayingData | null;

  let isLoading = false;

  async function handleRefresh() {
    try {
      isLoading = true;
      const response = await fetch('/api/now-playing');
      data = response.ok ? await response.json() : null;
    } catch {
      // silent
    } finally {
      isLoading = false;
    }
  }
</script>

<div class="now-playing__header">
  <slot name="title" />
  <RefreshButton {isLoading} on:click={handleRefresh} />
</div>

{#if data}
  <Detail {data} />
{:else}
  <em>No activity</em>
{/if}

<style>
  .now-playing__header {
    display: flex;
    align-items: center;
    gap: 4px;
  }
</style>
