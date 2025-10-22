import { router } from '../trpc';

export const appRouter = router({
  // myForest endpoints now handled by external API
});

// export type definition of API
export type AppRouter = typeof appRouter;
