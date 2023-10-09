<script lang="ts">
  import { onMount } from 'svelte';

  import {
    initStoriesStore,
    type InitStoriesStoreParams,
  } from '@/shared/stores/stories';

  export let initialData: InitStoriesStoreParams;

  const unsubscribe = initStoriesStore(initialData);

  onMount(() => unsubscribe);
</script>
