<script lang="ts">
  import {
    activeStory,
    storiesAction,
  } from '@/shared/stores/stories';

  $: ({ canNext, canPrev } = $activeStory);
</script>

<button
  class="btn btn-text invisible-nav-btn invisible-nav-btn_prev"
  disabled={!canPrev}
  title="Prev"
  on:click={$storiesAction.prev}
>
  <span class="visually-hidden">Prev</span>
</button>

<button
  class="btn btn-text invisible-nav-btn invisible-nav-btn_next"
  disabled={!canNext}
  title="Next"
  on:click={$storiesAction.next}
>
  <span class="visually-hidden">Next</span>
</button>

<style>
  .invisible-nav-btn {
    position: absolute;
    top: 0;
    width: calc(100% / 3);
    height: 100%;
  }

  .invisible-nav-btn_prev {
    left: 0;
  }

  .invisible-nav-btn_next {
    right: 0;
  }
</style>
