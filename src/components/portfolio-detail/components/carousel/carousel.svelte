<script lang="ts">
  import type {
    MouseEventHandler,
    UIEventHandler,
  } from 'svelte/elements';

  import Arrow from '@/shared/icons/arrow.svelte';
  import type { SimpleMediaItem } from '@/shared/types/general';

  import CarouselItem from './carousel-item.svelte';

  export let mediaList: SimpleMediaItem[] = [];

  const totalMedia = mediaList.length;
  const indicatorIndices = Array.from(
    { length: totalMedia },
    (_, index) => index,
  );

  let scrollerElement: HTMLDivElement;
  let activeIndex = 0;
  let isFirstIndex = true;
  let isLastIndex = false;
  let translateXIndicator = 0;

  function getTranslateXIndicator(
    currentActiveIndex: number,
  ): number {
    const startThreshold = 2;
    const minimumTotalMedia = 5;

    if (
      currentActiveIndex < startThreshold ||
      totalMedia < minimumTotalMedia
    ) {
      return 0;
    }

    const endThreshold = totalMedia - (minimumTotalMedia - 1);
    const ratio = -12;
    if (currentActiveIndex > endThreshold) {
      const endCenteringIndex = totalMedia - minimumTotalMedia;
      return endCenteringIndex * ratio;
    }

    const startCenteringIndex = currentActiveIndex - startThreshold;
    return startCenteringIndex * ratio;
  }

  function updateIndex(index: number) {
    let newIndex = index;
    if (index < 0) newIndex = 0;
    else if (index >= totalMedia) newIndex = totalMedia - 1;

    scrollerElement.scrollTo({
      left: scrollerElement.clientWidth * newIndex,
      top: 0,
      behavior: 'smooth',
    });
  }

  const handlePrevClick: MouseEventHandler<HTMLButtonElement> = e => {
    e.stopPropagation();
    updateIndex(activeIndex - 1);
  };

  const handleNextClick: MouseEventHandler<HTMLButtonElement> = e => {
    e.stopPropagation();
    updateIndex(activeIndex + 1);
  };

  const handleScroll: UIEventHandler<HTMLDivElement> = e => {
    const scroller = e.currentTarget;
    const nextIndex = Math.round(
      scroller.scrollLeft / scroller.clientWidth,
    );
    if (nextIndex !== activeIndex) {
      activeIndex = nextIndex;
    }
  };

  $: {
    isFirstIndex = activeIndex === 0;
    isLastIndex = activeIndex === totalMedia - 1;
    translateXIndicator = getTranslateXIndicator(activeIndex);
  }
</script>

<div class="carousel">
  <div
    bind:this={scrollerElement}
    on:scroll={handleScroll}
    class="carousel__scroller scrollbar-none"
  >
    <div class="carousel__media-list">
      {#each mediaList as media, index (`${media.url}-${index}`)}
        <CarouselItem
          {media}
          {scrollerElement}
          isActive={activeIndex === index}
          shouldEagerImageLoading={index === 0}
        />
      {/each}
    </div>
  </div>

  {#if mediaList.length > 1}
    <div class="carousel__indicator-list-wrapper">
      <div
        class="carousel__indicator-list"
        style:transform={`translate3d(${translateXIndicator}px, 0, 0)`}
      >
        {#each indicatorIndices as index}
          <span
            aria-current={index === activeIndex ? 'step' : 'false'}
            class="carousel__indicator-item"
          />
        {/each}
      </div>
    </div>

    <button
      class="carousel__arrow carousel__arrow_prev"
      disabled={isFirstIndex}
      on:click={handlePrevClick}
    >
      <Arrow />
      <span class="visually-hidden">Previous</span>
    </button>

    <button
      class="carousel__arrow carousel__arrow_next"
      disabled={isLastIndex}
      on:click={handleNextClick}
    >
      <Arrow />
      <span class="visually-hidden">Next</span>
    </button>
  {/if}
</div>

<style>
  .carousel {
    position: relative;
    width: 100%;
    background-color: var(--color-neutral-bright);
  }

  :global(.dark) .carousel {
    background-color: var(--color-neutral-dim);
  }

  .carousel__scroller {
    position: relative;
    width: 100%;
    overflow-x: scroll;
    scroll-snap-type: x mandatory;
  }

  .carousel__media-list {
    display: flex;
  }

  .carousel__indicator-list-wrapper {
    width: fit-content;
    max-width: 56px;
    margin: 16px auto;
    overflow-x: hidden;
  }

  .carousel__indicator-list {
    display: flex;
    gap: 4px;
    width: 100%;
    transition: transform 150ms ease-in;
  }

  .carousel__indicator-item {
    flex: 0 0 auto;
    width: 8px;
    height: 8px;
    background-color: var(--color-neutral-bright2);
    border-radius: 50%;
  }

  .carousel__indicator-item[aria-current='step'] {
    background-color: var(--color-neutral-dim);
  }

  :global(.dark) .carousel__indicator-item {
    background-color: var(--color-neutral-dim2);
  }

  :global(.dark) .carousel__indicator-item[aria-current='step'] {
    background-color: var(--color-neutral-bright);
  }

  .carousel__arrow {
    position: absolute;
    top: 50%;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    background-color: var(--color-neutral-bright0);
    color: var(--color-neutral-dim);
    border: none;
    border-radius: 50%;
    opacity: 0;
    @apply outline-none transition-opacity;
  }

  :global(.dark) .carousel__arrow {
    background-color: var(--color-neutral-dim0);
    color: var(--color-neutral-bright);
  }

  :global(.desktop) .carousel__arrow {
    display: flex;
  }

  :global(.mobile) .carousel__arrow {
    display: none;
  }

  .carousel__arrow:disabled {
    opacity: 0;
  }

  .carousel:hover > .carousel__arrow:not(:disabled) {
    opacity: 1;
    @apply shadow-lg;
  }

  .carousel__arrow_next {
    right: 10px;
    transform: rotate(180deg) translate(0, 50%);
  }

  .carousel__arrow_prev {
    left: 10px;
    transform: translate(0, -50%);
  }
</style>
