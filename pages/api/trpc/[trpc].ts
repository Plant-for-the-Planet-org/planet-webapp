import * as trpcNext from '@trpc/server/adapters/next';
import { appRouter } from '../../../src/server/routers';
console.log(appRouter)
export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: () => ({}),
});