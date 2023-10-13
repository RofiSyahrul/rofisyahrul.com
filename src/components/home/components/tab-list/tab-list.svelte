<script lang="ts">
  import { onMount } from 'svelte';
  import type { MouseEventHandler } from 'svelte/elements';

  import { isBrowser } from '@/shared/lib/client/env';
  import { requestIdleCallback } from '@/shared/lib/client/idle-callback';

  import type { TabName } from './config';
  import { TAB_NAMES, tabs } from './config';

  export let scrollerSelector: string | undefined = undefined;

  let autoScrollWindow = false;
  let selectedTab: TabName | undefined = undefined;
  let shouldScroll = false;

  function getHashValue() {
    return window.location.hash.replace(/^#/, '');
  }

  function isValidTabName(value: string): value is TabName {
    return TAB_NAMES.includes(value as any);
  }

  function getTabPanel(tabName: TabName) {
    return document.querySelector<HTMLDivElement>('#' + tabName);
  }

  function scrollToTabPanel(tabName: TabName) {
    if (!scrollerSelector) return;

    const tabPanel = getTabPanel(tabName);
    if (!tabPanel) return;

    const scroller =
      document.querySelector<HTMLElement>(scrollerSelector);

    if (scroller) {
      const prevScrollY = autoScrollWindow
        ? history.state?.[tabName]?.scrollY
        : 0;

      if (autoScrollWindow) {
        window.scrollTo({
          top: prevScrollY || scroller.offsetTop,
          behavior: 'smooth',
        });
        autoScrollWindow = false;
      }

      requestIdleCallback(() => {
        let scrollerScrollTop = 0;
        if (prevScrollY) {
          scrollerScrollTop = prevScrollY - scroller.offsetTop;
          if (scrollerScrollTop < 0) scrollerScrollTop = 0;
        }

        scroller.scrollTo({
          left: tabPanel.offsetLeft,
          top: scrollerScrollTop,
          behavior: 'smooth',
        });
      });
    } else {
      tabPanel.scrollIntoView({ behavior: 'smooth' });
    }
  }

  function updateTabPanelsState(currentTab: TabName) {
    for (const tabName of TAB_NAMES) {
      const tabPanel = getTabPanel(tabName);
      tabPanel?.setAttribute(
        'aria-hidden',
        `${currentTab !== tabName}`,
      );
    }
  }

  function updateSelectedTab() {
    const hashValue = getHashValue();
    if (isValidTabName(hashValue)) {
      selectedTab = hashValue;
      shouldScroll = true;
    } else {
      selectedTab = 'grid';
      shouldScroll = false;
    }
  }

  function handleHashChange() {
    updateSelectedTab();
    autoScrollWindow = true;
  }

  const handleTabClick: MouseEventHandler<HTMLAnchorElement> = e => {
    const currentHashValue = getHashValue();
    if (location.hash === e.currentTarget.hash) return;

    e.preventDefault();
    const state = history.state ?? {};
    state[currentHashValue] = { scrollX, scrollY };

    history.replaceState({ ...state, intraPage: true }, '');
    history.pushState(
      { ...state, scrollX, scrollY },
      '',
      e.currentTarget.href,
    );

    updateSelectedTab();
    autoScrollWindow = true;
  };

  onMount(() => {
    updateSelectedTab();
    return () => {
      autoScrollWindow = false;
    };
  });

  $: if (selectedTab) {
    updateTabPanelsState(selectedTab);
    if (isBrowser && shouldScroll) {
      scrollToTabPanel(selectedTab);
    }
  }
</script>

<svelte:window on:hashchange={handleHashChange} />

<section role="tablist">
  {#each tabs as tab (tab.name)}
    {@const isSelected = tab.name === selectedTab}
    <a
      aria-controls={tab.name}
      aria-label={tab.title}
      aria-selected={isSelected}
      data-astro-reload
      data-umami-event="feeds-tablist"
      data-umami-event-name={tab.name}
      id={'tab-' + tab.name}
      role="tab"
      href={tab.href}
      title={tab.title}
      on:click={handleTabClick}
    >
      <svelte:component this={tab.icon} />
      <span class="visually-hidden">{tab.title}</span>
    </a>
  {/each}
</section>

<style>
  section {
    position: sticky;
    top: 0;
    z-index: 11;
    display: flex;
    align-items: center;
    width: 100%;
    height: 48px;
    margin-bottom: -12px;
    background-color: var(--color-neutral-bright);
    border-top: 1px solid var(--color-neutral-bright1);
  }

  :global(.dark) section {
    background-color: var(--color-neutral-dim);
    border-top-color: var(--color-neutral-dim1);
  }

  :global(.desktop) section {
    display: none;
  }

  a {
    display: flex;
    flex: 1 1 auto;
    align-items: center;
    justify-content: center;
    height: 44px;
    color: var(--color-neutral-bright2);
  }

  :global(.dark) a {
    color: var(--color-neutral-dim2);
  }

  a[aria-selected='true'] {
    color: var(--color-primary-dim);
    pointer-events: none;
  }

  :global(.dark) a[aria-selected='true'] {
    color: var(--color-primary-bright);
  }

  @media (min-width: 768px) {
    section {
      height: 64px;
    }
  }
</style>
