import { BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CloudinaryService } from './cloudinary.service';
import { MediaService } from './media.service';
import { detectMedia } from './media-detection';

const PNG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0]);
const JPEG = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0, 0, 0]);
const GIF = Buffer.from('GIF89a', 'ascii');
const WEBP = Buffer.concat([
  Buffer.from('RIFF', 'ascii'),
  Buffer.from([0, 0, 0, 0]),
  Buffer.from('WEBP', 'ascii'),
]);
const WEBM = Buffer.from([0x1a, 0x45, 0xdf, 0xa3, 0, 0, 0]);
const MP4 = Buffer.concat([
  Buffer.from([0x00, 0x00, 0x00, 0x18]),
  Buffer.from('ftyp', 'ascii'),
  Buffer.from('isom', 'ascii'),
]);
const SVG = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"></svg>', 'ascii');
const HTML = Buffer.from('<html><body>hi</body></html>', 'ascii');

function makeFile(
  buffer: Buffer,
  mimetype = 'image/png',
  size = buffer.length,
): Express.Multer.File {
  return {
    buffer,
    size,
    mimetype,
    originalname: 'file.bin',
  } as Express.Multer.File;
}

describe('detectMedia', () => {
  it('detects PNG by signature', () => {
    expect(detectMedia(PNG)).toEqual({ kind: 'image', mimeType: 'image/png' });
  });

  it('detects JPEG by signature', () => {
    expect(detectMedia(JPEG)).toEqual({ kind: 'image', mimeType: 'image/jpeg' });
  });

  it('detects GIF by signature', () => {
    expect(detectMedia(GIF)).toEqual({ kind: 'image', mimeType: 'image/gif' });
  });

  it('detects WebP by signature', () => {
    expect(detectMedia(WEBP)).toEqual({ kind: 'image', mimeType: 'image/webp' });
  });

  it('detects WebM by signature', () => {
    expect(detectMedia(WEBM)).toEqual({ kind: 'video', mimeType: 'video/webm' });
  });

  it('detects MP4 by signature', () => {
    expect(detectMedia(MP4)).toEqual({ kind: 'video', mimeType: 'video/mp4' });
  });

  it('rejects SVG', () => {
    expect(detectMedia(SVG)).toBeNull();
  });

  it('rejects HTML/XML content', () => {
    expect(detectMedia(HTML)).toBeNull();
  });

  it('rejects empty buffers', () => {
    expect(detectMedia(Buffer.alloc(0))).toBeNull();
  });
});

describe('MediaService.uploadMedia', () => {
  const prisma = { mediaAttachment: { create: jest.fn() } };
  const cloudinary = { uploadFile: jest.fn() };

  let service: MediaService;

  beforeEach(() => {
    jest.clearAllMocks();
    prisma.mediaAttachment.create.mockResolvedValue({ id: 'm1' });
    cloudinary.uploadFile.mockResolvedValue({
      secure_url: 'https://res.cloudinary.com/demo/image/upload/v1/x.png',
      public_id: 'dev2dev/x',
    });
    service = new MediaService(
      prisma as unknown as PrismaService,
      cloudinary as unknown as CloudinaryService,
    );
  });

  it('accepts valid content even when the client MIME type is spoofed', async () => {
    await service.uploadMedia('u1', makeFile(PNG, 'image/svg+xml'));

    expect(cloudinary.uploadFile).toHaveBeenCalledWith(
      expect.any(Object),
      'image',
    );
    expect(prisma.mediaAttachment.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        type: 'IMAGE',
        mimeType: 'image/png',
        uploaderId: 'u1',
      }),
    });
  });

  it('rejects SVG bytes labeled as a PNG', async () => {
    await expect(
      service.uploadMedia('u1', makeFile(SVG, 'image/png')),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(cloudinary.uploadFile).not.toHaveBeenCalled();
  });

  it('rejects malformed/unknown content', async () => {
    await expect(
      service.uploadMedia('u1', makeFile(Buffer.from('not an image'), 'image/png')),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('rejects a missing file', async () => {
    await expect(
      service.uploadMedia('u1', undefined as never),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('enforces the 5MB image limit based on detected content', async () => {
    await expect(
      service.uploadMedia('u1', makeFile(PNG, 'image/png', 5 * 1024 * 1024 + 1)),
    ).rejects.toThrow(/maximum allowed size/);
    expect(cloudinary.uploadFile).not.toHaveBeenCalled();
  });

  it('accepts video content and uses the video resource type', async () => {
    await service.uploadMedia('u1', makeFile(MP4, 'video/mp4'));

    expect(cloudinary.uploadFile).toHaveBeenCalledWith(
      expect.any(Object),
      'video',
    );
    expect(prisma.mediaAttachment.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        type: 'VIDEO',
        mimeType: 'video/mp4',
      }),
    });
  });
});
