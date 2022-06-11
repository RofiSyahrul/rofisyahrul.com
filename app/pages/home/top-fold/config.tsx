import type { Item } from '~/types/general';

import GithubIconPath from './icons/github';
import InstagramIconPath from './icons/instagram';
import LinkedinIconPath from './icons/linkedin';
import TwitterIconPath from './icons/twitter';

export const socials: Item[] = [
  {
    iconPath: <GithubIconPath />,
    name: 'GitHub: RofiSyahrul',
    url: 'https://github.com/RofiSyahrul',
  },
  {
    iconPath: <LinkedinIconPath />,
    name: 'LinkedIn: Syahrul Rofi',
    url: 'https://www.linkedin.com/in/syahrul-rofi/',
  },
  {
    iconPath: <TwitterIconPath />,
    name: 'Twitter: @RofiSyahrul',
    url: 'https://twitter.com/RofiSyahrul',
  },
  {
    iconPath: <InstagramIconPath />,
    name: 'Instagram: rofisyahrul',
    url: 'https://www.instagram.com/rofisyahrul/',
  },
];
