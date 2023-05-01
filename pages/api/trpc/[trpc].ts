import { initTRPC } from '@trpc/server';
import * as trpcNext from "@trpc/server/adapters/next"
import { connectDB, getAccount } from '../../../src/utils/prisma';



const t = initTRPC.create();

connectDB()
const  appRouter = t.router({
    //procedure is most likely an REST endpoint
    profile: t.procedure.query(getAccount)
})

export type AppRouter = typeof appRouter

export default trpcNext.createNextApiHandler({
    router: appRouter,
    createContext: () => ({})
})




