<script lang="ts">
  import ExternalLink from '@/shared/icons/external-link.svelte';
  import type { TechSkillFields } from '@/shared/types/response';

  export let data: TechSkillFields[];
</script>

<ul>
  {#each data as item (item.name)}
    <li>
      <span>{item.name}</span>
      {#if item.url}
        {@const title = 'Visit ' + item.name}
        <a
          class="btn btn-text btn-primary"
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          {title}
        >
          <ExternalLink size={32} />
          <span class="visually-hidden">{title}</span>
        </a>
      {/if}
    </li>
  {/each}
</ul>

<style>
  ul {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  li {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px;
    border-bottom: 1px solid var(--color-neutral-bright1);
  }

  :global(.dark) li {
    border-bottom-color: var(--color-neutral-dim1);
  }

  a.btn {
    padding: 0;
  }
</style>
