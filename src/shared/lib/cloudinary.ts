import { Cloudinary } from '@cloudinary/url-gen/instance/Cloudinary';

export const cld = new Cloudinary({
  cloud: {
    cloudName: 'rofi',
  },
});
