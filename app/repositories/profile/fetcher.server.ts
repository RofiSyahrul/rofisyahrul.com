import fetcher from '~/repositories/fetcher.server';

import type { ProfileContent, ProfileResponse } from './types';

const profileKeys: Array<keyof ProfileContent> = [
  'description',
  'fullName',
  'jobRole',
  'photoPublicID',
  'shortName',
];

const path = '/api/profile-contents';

export async function fetchProfile() {
  const profileContent: ProfileContent = {} as any;
  const res = await fetcher<ProfileResponse>({ path });

  res.data.forEach(({ attributes }) => {
    const { content, name } = attributes;
    if (profileKeys.includes(name)) {
      profileContent[name] = content;
    }
  });

  return profileContent;
}
