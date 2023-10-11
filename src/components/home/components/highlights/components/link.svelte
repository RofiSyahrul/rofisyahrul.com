<script lang="ts">
  import type { HighlightName } from '@/shared/types/highlights';

  export let href: string;
  export let label: string;
  export let name: HighlightName;

  function trackSeeHighlight(_name: HighlightName) {
    // TODO: analytics implementation
  }

  function handleClick() {
    trackSeeHighlight(name);
  }
</script>

<a {href} title={label} on:click={handleClick}>
  <slot name="icon" />
  <span class="visually-hidden">{label}</span>
</a>

<style>
  a {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background-color: var(--color-primary-dim);
    border-radius: 50%;
  }

  :global(.dark) a {
    background-color: var(--color-primary-bright);
  }

  a:hover {
    filter: brightness(0.8);
  }
</style>
