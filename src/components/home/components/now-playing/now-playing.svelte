<script lang="ts">
  import Spotify from '@/shared/icons/spotify.svelte';
  import type { SpotifyNowPlayingData } from '@/shared/types/spotify';

  import Detail from './components/detail.svelte';
  import RefreshButton from './components/refresh-button.svelte';

  export let data: SpotifyNowPlayingData | null;

  async function handleRefresh() {
    const response = await fetch('/api/now-playing');
    data = response.ok ? await response.json() : null;
  }
</script>

<div class="flex gap-1 items-center">
  <Spotify class="text-secondary-bright" />
  <h3 class="font-bold text-xl flex-1">Now Playing</h3>
  <RefreshButton on:click={handleRefresh} />
</div>

{#if data}
  <Detail {data} />
{:else}
  <em>No activity</em>
{/if}
