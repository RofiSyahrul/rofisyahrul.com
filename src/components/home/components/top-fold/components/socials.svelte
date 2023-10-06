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

<ul
  class={clsx(
    'flex flex-1 flex-wrap w-full gap-2 items-center',
    'sm:pl-2 sm:h-9 sm:border-solid sm:border-l',
    'sm:border-l-neutral-bright1 sm:dark:border-l-neutral-dim1',
  )}
>
  {#each socials as social (social.url)}
    <li>
      <a
        class={clsx(
          'btn btn-solid btn-primary h-8',
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
