<script lang="ts">
  let className: string;

  export let hasStories: boolean;
  export { className as class };
</script>

{#if hasStories}
  <a
    class={className}
    data-umami-event="see-my-stories"
    href="/stories"
    title="See my stories"
  >
    <slot />
    <span class="visually-hidden">See my stories</span>
  </a>
{:else}
  <div class={className}>
    <slot />
  </div>
{/if}

<style>
  a {
    border-color: var(--color-secondary-dim);
  }

  :global(.dark) a {
    border-color: var(--color-secondary-bright);
  }

  div {
    border-color: transparent;
  }
</style>
