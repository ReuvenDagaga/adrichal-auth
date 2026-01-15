import { z } from 'zod';
import { router, tenantAdminProcedure } from '../trpc';
import {
  uploadImageOptimized,
  deleteImage as deleteCloudinaryImage,
} from '../../utils/cloudinary';
import { ImageManager } from '../image/manager';
import { imageFolderSchema } from '../image/schema';

export const uploadRouter = router({
  /**
   * Upload a single image
   */
  uploadImage: tenantAdminProcedure
    .input(
      z.object({
        base64: z.string().min(1),
        folder: imageFolderSchema,
        altText: z.string().optional(),
        tags: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const tenantSlug = ctx.tenant?.slug ?? 'super-admin';
      const folder = `adrichal3/${tenantSlug}/${input.folder}`;

      const result = await uploadImageOptimized(input.base64, folder);

      // Store metadata in database
      const image = await ImageManager.create({
        tenantId: ctx.tenant?._id,
        publicId: result.publicId,
        url: result.secureUrl,
        folder: input.folder,
        altText: input.altText,
        tags: input.tags,
        width: result.width,
        height: result.height,
        bytes: result.bytes,
        format: result.format,
      });

      return {
        ...result,
        id: image._id.toString(),
      };
    }),

  /**
   * Upload multiple images
   */
  uploadMultiple: tenantAdminProcedure
    .input(
      z.object({
        images: z.array(
          z.object({
            base64: z.string().min(1),
            altText: z.string().optional(),
          })
        ),
        folder: imageFolderSchema,
        tags: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const tenantSlug = ctx.tenant?.slug ?? 'super-admin';
      const folder = `adrichal3/${tenantSlug}/${input.folder}`;

      const results = await Promise.all(
        input.images.map(async (img) => {
          const result = await uploadImageOptimized(img.base64, folder);

          const image = await ImageManager.create({
            tenantId: ctx.tenant?._id,
            publicId: result.publicId,
            url: result.secureUrl,
            folder: input.folder,
            altText: img.altText,
            tags: input.tags,
            width: result.width,
            height: result.height,
            bytes: result.bytes,
            format: result.format,
          });

          return {
            ...result,
            id: image._id.toString(),
          };
        })
      );

      return results;
    }),

  /**
   * Delete an image
   */
  deleteImage: tenantAdminProcedure
    .input(
      z.object({
        id: z.string().min(1),
      })
    )
    .mutation(async ({ input }) => {
      const image = await ImageManager.getById(input.id);
      if (!image) {
        return { success: false };
      }

      // Delete from Cloudinary
      await deleteCloudinaryImage(image.publicId);

      // Delete from database
      await ImageManager.delete(input.id);

      return { success: true };
    }),

  /**
   * Get images (paginated)
   */
  getImages: tenantAdminProcedure
    .input(
      z.object({
        folder: imageFolderSchema.optional(),
        tags: z.array(z.string()).optional(),
        page: z.number().default(1),
        limit: z.number().default(50),
      })
    )
    .query(async ({ input, ctx }) => {
      return ImageManager.list({
        tenantId: ctx.tenant?._id,
        folder: input.folder,
        tags: input.tags,
        page: input.page,
        limit: input.limit,
      });
    }),
});
