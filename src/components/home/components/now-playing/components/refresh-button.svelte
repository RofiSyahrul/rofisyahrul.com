<script lang="ts">
  import Refresh from '@/shared/icons/refresh.svelte';
</script>

<button
  class="btn btn-text btn-secondary h-8 z-[1]"
  title="Refresh"
  on:click
>
  <Refresh />
  <span class="visually-hidden">Refresh</span>
</button>
