import { router } from './trpc';
import { userRouter } from './user/router';
import { tenantRouter } from './tenant/router';
import { uploadRouter } from './upload/router';
import { imageRouter } from './image/router';

export const appRouter = router({
  user: userRouter,
  tenant: tenantRouter,
  upload: uploadRouter,
  image: imageRouter,
});

export type AppRouter = typeof appRouter;
