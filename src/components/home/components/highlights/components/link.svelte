<script lang="ts">
  export let href: string;
  export let label: string;
</script>

<a {href} title={label}>
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
