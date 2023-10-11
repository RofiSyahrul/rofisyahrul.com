<script lang="ts" type="module">
  import clsx from 'clsx';
  import type { ComponentType } from 'svelte';

  import Github from '@/shared/icons/github.svelte';
  import Instagram from '@/shared/icons/instagram.svelte';
  import Linkedin from '@/shared/icons/linkedin.svelte';
  import TwitterX from '@/shared/icons/twitter-x.svelte';

  interface SocialItem {
    icon: ComponentType;
    name: 'github' | 'instagram' | 'linkedin' | 'twitter-x';
    title: string;
    url: string;
  }

  const socials: SocialItem[] = [
    {
      icon: Github,
      name: 'github',
      title: 'GitHub: RofiSyahrul',
      url: 'https://github.com/RofiSyahrul',
    },
    {
      icon: Linkedin,
      name: 'linkedin',
      title: 'LinkedIn: Syahrul Rofi',
      url: 'https://www.linkedin.com/in/syahrul-rofi/',
    },
    {
      icon: TwitterX,
      name: 'twitter-x',
      title: 'X: @RofiSyahrul',
      url: 'https://x.com/RofiSyahrul',
    },
    {
      icon: Instagram,
      name: 'instagram',
      title: 'Instagram: rofisyahrul',
      url: 'https://www.instagram.com/rofisyahrul/',
    },
  ];
</script>

<ul>
  {#each socials as social (social.url)}
    <li>
      <a
        class={clsx(
          'btn btn-solid btn-primary',
          `umami--click--social__${social.name}`,
        )}
        href={social.url}
        target="_blank"
        rel="noreferrer noopener"
        title={social.title}
      >
        <svelte:component this={social.icon} />
        <span class="visually-hidden">{social.title}</span>
      </a>
    </li>
  {/each}
</ul>

<style>
  ul {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    flex: 1;
    align-items: center;
  }

  a.btn {
    height: 32px;
  }

  @media (min-width: 640px) {
    ul {
      padding-left: 8px;
      height: 36px;
      border-left: 1px solid var(--color-neutral-bright1);
    }

    :global(.dark) ul {
      border-left-color: var(--color-neutral-dim1);
    }
  }
</style>
