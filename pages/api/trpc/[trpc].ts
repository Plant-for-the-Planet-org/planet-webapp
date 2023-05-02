import { initTRPC } from '@trpc/server';
import * as trpcNext from "@trpc/server/adapters/next"
import { connectDB } from '../../../src/utils/prisma';
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const t = initTRPC.create();

connectDB()
const  appRouter = t.router({
    //procedure is most likely an REST endpoint
    profile: t.procedure.query(async()=>{
        try{
            const data = await prisma.accounting_record.findMany()
            return data
        }catch(err){
            console.log(err)
        }
    })
})

export type AppRouter = typeof appRouter

export default trpcNext.createNextApiHandler({
    router: appRouter,
    createContext: () => ({})
})




