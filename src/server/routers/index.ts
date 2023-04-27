import { publicProcedure, router } from "../trpc";
import { createHTTPServer } from '@trpc/server/adapters/standalone'

export const appRouter = router({
    data: publicProcedure.query(async()=>{
        const getData = `cool`
        return getData
    })
})
export type AppRouter = typeof appRouter

const server = createHTTPServer({
    router:appRouter
})
server.listen(3000)
