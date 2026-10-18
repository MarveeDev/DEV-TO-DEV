import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CloudinaryService } from './cloudinary.service';
import { MediaType } from '@prisma/client';
import { detectMedia, MAX_IMAGE_BYTES, MAX_VIDEO_BYTES } from './media-detection';

@Injectable()
export class MediaService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService,
  ) {}

  async uploadMedia(userId: string, file: Express.Multer.File) {
    if (!file || !file.buffer) {
      throw new BadRequestException('No file provided');
    }

    // Validate the actual content (magic bytes), never the client-supplied
    // `mimetype`/`Content-Type`. SVG, HTML/XML, and other unsupported or
    // malformed content resolve to null and are rejected.
    const detected = detectMedia(file.buffer);
    if (!detected) {
      throw new BadRequestException(
        'Unsupported file type. Only JPEG, PNG, GIF, WebP, MP4, and WebM files are allowed.',
      );
    }

    // Per-type size validation (images 5MB, videos 50MB).
    const maxSize = detected.kind === 'video' ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
    if (file.size > maxSize) {
      throw new BadRequestException(
        `File exceeds the maximum allowed size of ${
          detected.kind === 'video' ? '50MB' : '5MB'
        }`,
      );
    }

    // Upload to Cloudinary with a resource type derived from validated content.
    const result = await this.cloudinary.uploadFile(
      file,
      detected.kind === 'video' ? 'video' : 'image',
    );

    // Persist trusted metadata derived from validated content.
    const attachment = await this.prisma.mediaAttachment.create({
      data: {
        url: result.secure_url,
        publicId: result.public_id,
        type: detected.kind === 'video' ? MediaType.VIDEO : MediaType.IMAGE,
        mimeType: detected.mimeType,
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
