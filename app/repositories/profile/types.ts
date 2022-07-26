import type { GeneralResponse } from '~/types/response';

export interface ProfileContent {
  description: string;
  fullName: string;
  shortName: string;
  photoPublicID: string;
  jobRole: string;
}

interface ProfileItem {
  content: string;
  name: keyof ProfileContent;
}

export type ProfileResponse = GeneralResponse<ProfileItem>;
