<script lang="ts">
  import { activeStory } from '@/shared/stores/stories';
  import type {
    NowPlayingStoryItem,
    RecentPlayedStoryItem,
  } from '@/shared/types/stories';

  import Audio from './components/audio.svelte';
  import ToggleAudioPlayingButton from './components/toggle-audio-playing-button.svelte';
  import Transition from './components/transition.svelte';

  let audio: Audio;
  let isAudioPlaying: boolean;

  $: story = $activeStory.story as unknown as
    | NowPlayingStoryItem
    | RecentPlayedStoryItem;

  $: ({ artists, image, previewURL, title, trackURL } = story.detail);
</script>

<Transition>
  {#if image?.url}
    <img
      alt={title}
      loading="eager"
      src={image.url}
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
</Transition>

<Audio
  bind:this={audio}
  bind:isPlaying={isAudioPlaying}
  src={previewURL}
/>

<ToggleAudioPlayingButton {audio} {isAudioPlaying} />

<style>
  img {
    border-radius: 4px;
    object-fit: contain;
  }

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
