import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CloudinaryService } from './cloudinary.service';
import { MediaType } from '@prisma/client';

@Injectable()
export class MediaService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService,
  ) {}

  async uploadMedia(userId: string, file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const isVideo = file.mimetype.startsWith('video/');
    const isImage = file.mimetype.startsWith('image/');
    
    if (!isVideo && !isImage) {
      throw new BadRequestException('Invalid file type');
    }

    // Strict validation
    if (isVideo && !['video/mp4', 'video/webm'].includes(file.mimetype)) {
      throw new BadRequestException('Only MP4 and WebM videos are allowed');
    }
    if (isImage && !['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.mimetype)) {
      throw new BadRequestException('Only JPEG, PNG, GIF, and WebP images are allowed');
    }

    // Size validation
    const maxSize = isVideo ? 50 * 1024 * 1024 : 5 * 1024 * 1024; // 50MB for video, 5MB for image
    if (file.size > maxSize) {
      throw new BadRequestException(`File exceeds the maximum allowed size of ${isVideo ? '50MB' : '5MB'}`);
    }

    // Upload to Cloudinary
    const result = await this.cloudinary.uploadFile(file);

    // Save to Database
    const attachment = await this.prisma.mediaAttachment.create({
      data: {
        url: result.secure_url,
        publicId: result.public_id,
        type: isVideo ? MediaType.VIDEO : MediaType.IMAGE,
        mimeType: file.mimetype,
        filename: file.originalname,
        size: file.size,
        uploaderId: userId,
      },
    });

    return attachment;
  }

  async deleteMedia(userId: string, id: string) {
    const attachment = await this.prisma.mediaAttachment.findUnique({
      where: { id },
    });

    if (!attachment) {
      throw new NotFoundException('Media not found');
    }

    // Check ownership
    // In a real app we might also check for admin roles here
    if (attachment.uploaderId !== userId) {
      throw new ForbiddenException('You do not have permission to delete this media');
    }

    // Delete from Cloudinary
    await this.cloudinary.deleteFile(attachment.publicId, attachment.type === MediaType.VIDEO ? 'video' : 'image');

    // Delete from Database
    await this.prisma.mediaAttachment.delete({
      where: { id },
    });

    return { success: true };
  }
}
