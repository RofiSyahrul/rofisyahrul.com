import { fill } from '@cloudinary/url-gen/actions/resize';
import { face } from '@cloudinary/url-gen/qualifiers/focusOn';
import { focusOn } from '@cloudinary/url-gen/qualifiers/gravity';

import { cld } from '~/lib/cloudinary';

import type { ProfileContent } from './types';

export async function fetchProfile() {
  const profileContent: ProfileContent = {
    description: `Hi guys! Welcome to my personal web,
      an instagram-like website. You can call me Rofi,
      a front-end web development enthusiast who always
      uses React.js or Svelte to build user interfaces.
      Currently, I work at a property tech company in Indonesia.
      You can reach me via my accounts above.`,
    fullName: 'Syahrul Rofi',
    jobRole: 'Software Engineer (Web Platform)',
    photoPublicID: 'rofisyahrul.com/rofi',
    shortName: 'Rofi',
  };

  const profileImage = cld.image(profileContent.photoPublicID);
  profileContent.photoPublicID = profileImage
    .resize(fill().width(200).height(200).gravity(focusOn(face())))
    .toURL();

  return profileContent;
}
