import { v2 as cloudinary } from 'cloudinary';
import { config } from '../config';

cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
});

export interface UploadResult {
  url: string;
  secureUrl: string;
  publicId: string;
  width: number;
  height: number;
  bytes: number;
  format: string;
}

export interface MediaItem {
  publicId: string;
  url: string;
  secureUrl: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
  createdAt: string;
  folder: string;
}

export interface MediaListResult {
  items: MediaItem[];
  nextCursor?: string;
  totalCount: number;
}

/**
 * Upload a single image (base64)
 */
export async function uploadImage(
  base64: string,
  folder: string
): Promise<UploadResult> {
  const result = await cloudinary.uploader.upload(base64, {
    folder,
    resource_type: 'image',
  });

  return {
    url: result.url,
    secureUrl: result.secure_url,
    publicId: result.public_id,
    width: result.width,
    height: result.height,
    bytes: result.bytes,
    format: result.format,
  };
}

/**
 * Upload image with optimization (resize, quality, format)
 */
export async function uploadImageOptimized(
  base64: string,
  folder: string,
  options?: {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
  }
): Promise<UploadResult> {
  const { maxWidth = 2000, maxHeight = 2000, quality = 85 } = options || {};

  const result = await cloudinary.uploader.upload(base64, {
    folder,
    resource_type: 'image',
    transformation: [
      {
        width: maxWidth,
        height: maxHeight,
        crop: 'limit',
        quality,
        fetch_format: 'auto',
      },
    ],
  });

  return {
    url: result.url,
    secureUrl: result.secure_url,
    publicId: result.public_id,
    width: result.width,
    height: result.height,
    bytes: result.bytes,
    format: result.format,
  };
}

/**
 * Upload multiple images
 */
export async function uploadMultipleImages(
  images: { base64: string; folder: string }[]
): Promise<UploadResult[]> {
  return Promise.all(images.map((img) => uploadImageOptimized(img.base64, img.folder)));
}

/**
 * Delete a single image by public ID
 */
export async function deleteImage(publicId: string): Promise<boolean> {
  const result = await cloudinary.uploader.destroy(publicId);
  return result.result === 'ok';
}

/**
 * Delete multiple images
 */
export async function deleteMultipleImages(publicIds: string[]): Promise<void> {
  await cloudinary.api.delete_resources(publicIds);
}

/**
 * Get images from a folder (paginated)
 */
export async function getImages(
  folder: string,
  options?: { maxResults?: number; nextCursor?: string }
): Promise<MediaListResult> {
  const { maxResults = 50, nextCursor } = options || {};

  const result = await cloudinary.api.resources({
    type: 'upload',
    prefix: folder,
    max_results: maxResults,
    next_cursor: nextCursor,
  });

  const items: MediaItem[] = result.resources.map(
    (r: {
      public_id: string;
      url: string;
      secure_url: string;
      format: string;
      width: number;
      height: number;
      bytes: number;
      created_at: string;
      folder: string;
    }) => ({
      publicId: r.public_id,
      url: r.url,
      secureUrl: r.secure_url,
      format: r.format,
      width: r.width,
      height: r.height,
      bytes: r.bytes,
      createdAt: r.created_at,
      folder: r.folder,
    })
  );

  return {
    items,
    nextCursor: result.next_cursor,
    totalCount: result.rate_limit_remaining,
  };
}

/**
 * Extract public ID from Cloudinary URL
 */
export function extractPublicId(url: string): string | null {
  const match = url.match(/\/v\d+\/(.+)\.\w+$/);
  return match ? match[1] : null;
}
