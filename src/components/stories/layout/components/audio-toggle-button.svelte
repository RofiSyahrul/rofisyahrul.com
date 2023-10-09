<script lang="ts">
  import SoundOff from '@/shared/icons/sound-off.svelte';
  import SoundOn from '@/shared/icons/sound-on.svelte';
  import {
    isStoryMuted,
    storiesAction,
  } from '@/shared/stores/stories';

  function handleClick() {
    $storiesAction.toggleAudio();
  }
</script>

<button
  class="btn btn-text text-inherit"
  title="Toggle audio"
  on:click={handleClick}
>
  {#if $isStoryMuted}
    <SoundOff ariaLabel="Audio is muted" size={16} />
  {:else}
    <SoundOn ariaLabel="Audio is playing" size={16} />
  {/if}
  <span class="visually-hidden">Toggle audio</span>
</button>
