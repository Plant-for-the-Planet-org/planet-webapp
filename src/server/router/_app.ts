import {router, procedure} from "../trpc"

export const appRouter = router({
    data: procedure.query(()=>{
        const sendData = "Hello"
        return sendData
    })
})

// export type definition of API
export type AppRouter = typeof appRouter;