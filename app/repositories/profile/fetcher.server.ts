import { fill } from '@cloudinary/url-gen/actions/resize';
import { face } from '@cloudinary/url-gen/qualifiers/focusOn';
import { focusOn } from '@cloudinary/url-gen/qualifiers/gravity';

import { cld } from '~/lib/cloudinary';
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

  if (profileContent.photoPublicID) {
    const profileImage = cld.image(profileContent.photoPublicID);
    profileContent.photoPublicID = profileImage
      .resize(fill().width(200).height(200).gravity(focusOn(face())))
      .toURL();
  }

  return profileContent;
}
