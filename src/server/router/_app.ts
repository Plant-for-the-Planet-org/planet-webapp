import { PrismaClient } from '@prisma/client';
import { router, procedure } from '../trpc';

const prisma = new PrismaClient();
prisma.$connect();

export const appRouter = router({
  contribution: procedure.query(async () => {
    const data = await prisma.contribution.findMany({ take: 5 });
    console.log(data);
    return data;
  }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
