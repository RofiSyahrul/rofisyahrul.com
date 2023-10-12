<script lang="ts">
  import { onMount } from 'svelte';
  import type { MouseEventHandler } from 'svelte/elements';

  import { requestIdleCallback } from '@/shared/lib/client/idle-callback';

  import type { TabName } from './config';
  import { tabs } from './config';

  export let scrollerSelector: string | undefined = undefined;

  const tabNames = tabs.map(tab => tab.name);
  let selectedTab: TabName | undefined = undefined;

  function getHashValue() {
    return window.location.hash.replace(/^#/, '');
  }

  function isValidTabName(value: string): value is TabName {
    return tabNames.includes(value);
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
      window.scrollTo({
        top: scroller.offsetTop,
        behavior: 'smooth',
      });
      requestIdleCallback(() => {
        scroller.scrollTo({
          left: tabPanel.offsetLeft,
          top: 0,
          behavior: 'smooth',
        });
      });
    } else {
      tabPanel.scrollIntoView({ behavior: 'smooth' });
    }
  }

  function updateTabPanelsState(currentTab: TabName) {
    for (const tabName of tabNames) {
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
      scrollToTabPanel(hashValue);
    } else {
      selectedTab = 'grid';
    }
  }

  const handleTabClick: MouseEventHandler<HTMLAnchorElement> = e => {
    if (location.hash === e.currentTarget.hash) return;
    e.preventDefault();
    history.replaceState({ ...history.state, intraPage: true }, '');
    history.pushState({ scrollX, scrollY }, '', e.currentTarget.href);
    updateSelectedTab();
  };

  onMount(() => {
    updateSelectedTab();
  });

  $: if (selectedTab) {
    updateTabPanelsState(selectedTab);
  }
</script>

<svelte:window on:hashchange={updateSelectedTab} />

<section role="tablist">
  {#each tabs as tab (tab.name)}
    {@const isSelected = tab.name === selectedTab}
    <a
      aria-controls={tab.name}
      aria-label={tab.title}
      aria-selected={isSelected}
      data-astro-reload
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
