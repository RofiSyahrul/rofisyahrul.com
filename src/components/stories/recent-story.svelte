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

  $: story = $activeStory.story as unknown as
    | NowPlayingStoryItem
    | RecentPlayedStoryItem;

  $: ({ artists, image, previewURL, title, trackURL } = story.detail);

  function handleToggleClick() {
    audio.toggleAudioPlaying();
  }
</script>

{#if image?.url}
  <Image
    alt={title}
    src={image.url}
    class="object-contain rounded"
    loading="eager"
    height={250}
    width={250}
    {title}
  />
{/if}

{#if trackURL && title}
  <a
    href={trackURL}
    target="_blank"
    class="link"
    rel="noreferrer noopener"
    title="Play in Spotify"
  >
    {title}
  </a>
{/if}

{#if artists?.length}
  <p class="text-lg">{artists.join(', ')}</p>
{/if}

<Audio bind:this={audio} src={previewURL} />
<ToggleAudioPlayingButton on:click={handleToggleClick} />

<style>
  :global(.dark) .link,
  .link {
    z-index: 10;
    font-size: 36px;
    line-height: 40px;
    font-weight: 700;
    color: var(--color-secondary-bright);
    text-align: center;
  }
</style>
