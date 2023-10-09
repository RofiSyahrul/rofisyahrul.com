<script lang="ts">
  import { storyProgress } from '@/shared/stores/stories';

  export let slug: string;

  $: progress = $storyProgress[slug];
</script>

<div class="progress" style:width={Math.min(progress, 100) + '%'} />

<style>
  .progress {
    position: absolute;
    top: 0;
    background-color: var(--color-neutral-bright);
    transition-property: width;
    transition-timing-function: linear;
    transition-duration: 10ms;
    will-change: width;
  }
</style>
