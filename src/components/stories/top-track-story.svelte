<script lang="ts">
  import { activeStory } from '@/shared/stores/stories';
  import type { TopTrackStoryItem } from '@/shared/types/stories';

  import Audio from './components/audio.svelte';
  import ToggleAudioPlayingButton from './components/toggle-audio-playing-button.svelte';

  const MAX_IMAGE_SIZE = 300;
  const SIZE_RATIO_PER_RANK = 10;

  let audio: Audio;
  let isAudioPlaying: boolean;

  $: story = $activeStory.story as unknown as TopTrackStoryItem;

  $: ({ artists, image, previewURL, rank, title, trackURL } =
    story.detail);
</script>

<div class="title">
  <slot name="title-text" />
  <strong class="title__rank text-5xl">
    #{rank}
  </strong>
</div>

{#if image?.url}
  {@const size = MAX_IMAGE_SIZE - (rank - 1) * SIZE_RATIO_PER_RANK}
  <img
    alt={title}
    src={image.url}
    height={size}
    width={size}
    loading="eager"
    {title}
  />
{/if}

{#if title}
  {#if trackURL}
    <a
      href={trackURL}
      target="_blank"
      class="track-title text-4xl"
      rel="noreferrer noopener"
      title="Play in Spotify"
    >
      {title}
    </a>
  {:else}
    <p class="track-title text-4xl">{title}</p>
  {/if}
{/if}

{#if artists?.length}
  <p class="text-lg">{artists.join(', ')}</p>
{/if}

<Audio
  bind:this={audio}
  bind:isPlaying={isAudioPlaying}
  src={previewURL}
/>
<ToggleAudioPlayingButton {audio} {isAudioPlaying} />

<style>
  .title {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin-bottom: 16px;
  }

  :global(.dark) .title__rank,
  .title__rank {
    color: var(--color-secondary-bright);
  }

  img {
    object-fit: contain;
    border-radius: 8px;
  }

  :global(.dark) .track-title,
  .track-title {
    z-index: 10;
    font-weight: 700;
    color: var(--color-secondary-bright);
    text-align: center;
  }
</style>
