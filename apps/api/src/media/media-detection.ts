export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const MAX_VIDEO_BYTES = 50 * 1024 * 1024;

/**
 * Hard ceiling used by the multipart parser so an upload is rejected before it
 * can be fully buffered into memory. It is the larger of the two per-type
 * limits; the per-type limit (image vs video) is still enforced after content
 * detection.
 */
export const MAX_UPLOAD_BYTES = MAX_VIDEO_BYTES;

export type DetectedMediaKind = 'image' | 'video';

export interface DetectedMedia {
  kind: DetectedMediaKind;
  mimeType: string;
}

/**
 * Detects the media type from the file's leading magic bytes rather than the
 * client-supplied `Content-Type`/`mimetype`.
 *
 * Supported formats mirror the existing upload allowlist:
 *   images: JPEG, PNG, GIF, WebP
 *   videos: MP4 (ISO BMFF), WebM (EBML)
 *
 * Returns `null` for anything else — including SVG, HTML/XML, malformed files,
 * and content whose header does not match a supported signature.
 */
export function detectMedia(buffer: Buffer): DetectedMedia | null {
  if (!buffer || buffer.length === 0) {
    return null;
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer.length >= 8 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return { kind: 'image', mimeType: 'image/png' };
  }

  // JPEG: FF D8 FF
  if (
    buffer.length >= 3 &&
    buffer[0] === 0xff &&
    buffer[1] === 0xd8 &&
    buffer[2] === 0xff
  ) {
    return { kind: 'image', mimeType: 'image/jpeg' };
  }

  // GIF: GIF87a / GIF89a
  if (buffer.length >= 6) {
    const gif = buffer.toString('ascii', 0, 6);
    if (gif === 'GIF87a' || gif === 'GIF89a') {
      return { kind: 'image', mimeType: 'image/gif' };
    }
  }

  // WebP: "RIFF" .... "WEBP"
  if (
    buffer.length >= 12 &&
    buffer.toString('ascii', 0, 4) === 'RIFF' &&
    buffer.toString('ascii', 8, 12) === 'WEBP'
  ) {
    return { kind: 'image', mimeType: 'image/webp' };
  }

  // WebM: EBML 1A 45 DF A3
  if (
    buffer.length >= 4 &&
    buffer[0] === 0x1a &&
    buffer[1] === 0x45 &&
    buffer[2] === 0xdf &&
    buffer[3] === 0xa3
  ) {
    return { kind: 'video', mimeType: 'video/webm' };
  }

  // MP4/MOV: ISO BMFF "ftyp" box at offset 4
  if (buffer.length >= 12 && buffer.toString('ascii', 4, 8) === 'ftyp') {
    return { kind: 'video', mimeType: 'video/mp4' };
  }

  return null;
}
