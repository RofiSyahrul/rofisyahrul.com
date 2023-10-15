<script lang="ts">
  import { scale } from 'svelte/transition';

  import { isWaitingStory } from '@/shared/stores/stories';
</script>

{#if !$isWaitingStory}
  <div in:scale out:scale>
    <slot />
  </div>
{/if}

<style>
  div {
    display: contents;
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: center;
    justify-content: center;
    width: 100%;
  }
</style>
