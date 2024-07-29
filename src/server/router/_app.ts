import { router } from '../trpc';
import { myForestRouter, myForestV2Router } from './myForest';

export const appRouter = router({
  myForest: myForestRouter,
  myForestV2: myForestV2Router,
});

// export type definition of API
export type AppRouter = typeof appRouter;
