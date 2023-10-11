<script lang="ts">
  import Image from '@/shared/components/image.svelte';
  import { activeStory } from '@/shared/stores/stories';
  import type {
    NowPlayingStoryItem,
    RecentPlayedStoryItem,
  } from '@/shared/types/stories';

  import Audio from './components/audio.svelte';
  import ToggleAudioPlayingButton from './components/toggle-audio-playing-button.svelte';

  let audio: Audio;
  let isAudioPlaying: boolean;

  $: story = $activeStory.story as unknown as
    | NowPlayingStoryItem
    | RecentPlayedStoryItem;

  $: ({ artists, image, previewURL, title, trackURL } = story.detail);
</script>

{#if image?.url}
  <Image
    alt={title}
    src={image.url}
    class="object-contain rounded"
    loading="eager"
    height={image.height}
    width={image.width}
    {title}
  />
{/if}

{#if title}
  {#if trackURL}
    <a
      href={trackURL}
      target="_blank"
      class="track-title"
      rel="noreferrer noopener"
      title="Play in Spotify"
    >
      {title}
    </a>
  {:else}
    <p class="track-title">{title}</p>
  {/if}
{/if}

{#if artists?.length}
  <p class="artists">{artists.join(', ')}</p>
{/if}

<Audio
  bind:this={audio}
  bind:isPlaying={isAudioPlaying}
  src={previewURL}
/>

<ToggleAudioPlayingButton {audio} {isAudioPlaying} />

<style>
  :global(.dark) .track-title,
  .track-title {
    z-index: 10;
    font-weight: 700;
    color: var(--color-secondary-bright);
    font-size: 36px;
    line-height: 40px;
    text-align: center;
  }

  .artists {
    font-size: 18px;
    line-height: 28px;
    text-align: center;
  }
</style>
