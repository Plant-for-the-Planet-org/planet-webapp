import { initTRPC } from '@trpc/server';
import superjson from 'superjson';

const t = initTRPC.create({
  transformer: superjson,
  // errorFormatter({ error, shape }) {
  //   return {
  //     ...shape,
  //     data: {
  //       ...shape.data,
  //       zodError: `Hey there it is a zod error ${error.message}`,
  //       somethingElse: 'It is something else',
  //     },
  //   };
  // },
});
// Base router and procedure helpers
export const router = t.router;
export const procedure = t.procedure;
