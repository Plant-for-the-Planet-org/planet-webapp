import { router } from '../trpc';
import { myForestV2Router } from './myForest';

export const appRouter = router({
  myForestV2: myForestV2Router,
});

// export type definition of API
export type AppRouter = typeof appRouter;
