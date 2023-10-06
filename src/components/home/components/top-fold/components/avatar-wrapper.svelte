<script lang="ts">
  import clsx from 'clsx';

  let className: string;

  export let hasStories: boolean;
  export { className as class };
</script>

{#if hasStories}
  <a
    class={clsx(
      'rounded-full border-solid',
      'border-secondary-dim dark:border-secondary-bright',
      className,
    )}
    href="/stories"
    title="See my stories"
  >
    <slot />
    <span class="visually-hidden">See my stories</span>
  </a>
{:else}
  <div class={clsx('border-transparent', className)}>
    <slot />
  </div>
{/if}
