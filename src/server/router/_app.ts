import { router } from '../trpc';
import { myForestRouter } from './myForest';

export const appRouter = router({
  myForest: myForestRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
