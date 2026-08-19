import { Module } from '@nestjs/common';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { CloudinaryProvider } from './cloudinary.provider';
import { CloudinaryService } from './cloudinary.service';
import { PrismaModule } from '../prisma/prisma.module';
import { SessionsModule } from '../sessions/sessions.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [PrismaModule, SessionsModule, ConfigModule],
  controllers: [MediaController],
  providers: [MediaService, CloudinaryProvider, CloudinaryService],
  exports: [MediaService, CloudinaryProvider, CloudinaryService],
})
export class MediaModule {}
