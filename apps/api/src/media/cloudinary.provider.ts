import { v2 as cloudinary } from 'cloudinary';
import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export const CloudinaryProvider: Provider = {
  provide: 'CLOUDINARY',
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    return cloudinary.config({
      cloud_name: configService.get<string>('CLOUDINARY_CLOUD_NAME') || 'demo',
      api_key: configService.get<string>('CLOUDINARY_API_KEY') || 'demo_key',
      api_secret: configService.get<string>('CLOUDINARY_API_SECRET') || 'demo_secret',
    });
  },
};
