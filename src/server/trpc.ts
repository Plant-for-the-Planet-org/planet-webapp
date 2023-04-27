import { initTRPC } from '@trpc/server';
//Initialization of tRPC backend
const t  = initTRPC.create()


export const router = t.router;
export const publicProcedure = t.procedure;
