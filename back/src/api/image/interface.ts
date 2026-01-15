import type { Types } from 'mongoose';

export type ImageFolder = 'projects' | 'blog' | 'general' | 'gallery';

export interface Image {
  tenantId?: Types.ObjectId;
  publicId: string;
  url: string;
  folder: ImageFolder;
  altText: string;
  tags: string[];
  width?: number;
  height?: number;
  bytes?: number;
  format?: string;
}

export interface ImageDocument extends Image {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateImageData {
  tenantId?: Types.ObjectId;
  publicId: string;
  url: string;
  folder: ImageFolder;
  altText?: string;
  tags?: string[];
  width?: number;
  height?: number;
  bytes?: number;
  format?: string;
}

export interface UpdateImageData {
  altText?: string;
  tags?: string[];
}

export interface ListImagesOptions {
  tenantId?: Types.ObjectId;
  folder?: ImageFolder;
  tags?: string[];
  page?: number;
  limit?: number;
}
