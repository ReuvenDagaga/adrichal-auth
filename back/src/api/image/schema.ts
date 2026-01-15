import { z } from 'zod';

export const imageFolderSchema = z.enum(['projects', 'blog', 'general', 'gallery']);

export const createImageSchema = z.object({
  publicId: z.string().min(1),
  url: z.string().url(),
  folder: imageFolderSchema,
  altText: z.string().optional(),
  tags: z.array(z.string()).optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  bytes: z.number().optional(),
  format: z.string().optional(),
});

export const updateImageSchema = z.object({
  id: z.string().min(1),
  altText: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export const listImagesSchema = z.object({
  folder: imageFolderSchema.optional(),
  tags: z.array(z.string()).optional(),
  page: z.number().default(1),
  limit: z.number().default(50),
});

export const getImageByUrlSchema = z.object({
  url: z.string().min(1),
});

export const deleteImageSchema = z.object({
  id: z.string().min(1),
});
