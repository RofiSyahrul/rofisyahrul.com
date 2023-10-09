<script lang="ts">
  import { onMount } from 'svelte';

  import goBack from '@/shared/lib/client/go-back';
  import {
    activeStory,
    handleTimeUpdate,
    isStoryMuted,
    storiesAction,
  } from '@/shared/stores/stories';

  export let src: string;

  let audio: HTMLAudioElement;

  $: ({ canNext } = $activeStory);

  function handleAudioEnded() {
    if (canNext) $storiesAction.next();
    else goBack();
  }

  export function toggleAudioPlaying() {
    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
  }

  onMount(() => {
    audio.load();
  });
</script>

{#key src}
  <audio
    autoplay
    muted={$isStoryMuted}
    bind:this={audio}
    on:ended={handleAudioEnded}
    on:timeupdate={handleTimeUpdate}
  >
    <source {src} type="audio/mpeg" />
    <em> Your browser does not support to play audio </em>
  </audio>
{/key}

<style>
  audio em {
    font-size: 12px;
    line-height: 16px;
  }
</style>
