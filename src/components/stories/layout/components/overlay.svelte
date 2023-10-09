<script lang="ts">
  import goBack from '@/shared/lib/client/go-back';

  let overlay: HTMLDivElement;

  function handleDocumentClick(e: Event) {
    if (e.target === overlay) goBack();
  }
</script>

<svelte:document on:click={handleDocumentClick} />
<div class="overlay" bind:this={overlay} />

<style>
  .overlay {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
</style>
