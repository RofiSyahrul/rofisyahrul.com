<script lang="ts">
  import type Audio from './audio.svelte';

  export let audio: Audio;
  export let isAudioPlaying: boolean;

  $: title = isAudioPlaying ? 'Pause' : 'Play';

  function handleClick() {
    audio.toggleAudioPlaying();
  }
</script>

<button class="btn btn-text" {title} on:click={handleClick}>
  <span class="visually-hidden">{title}</span>
</button>

<style>
  button {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
</style>
