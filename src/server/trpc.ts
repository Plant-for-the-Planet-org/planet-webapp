import { initTRPC } from '@trpc/server';
import superjson from 'superjson';
import { ZodError } from 'zod';

const t = initTRPC.create({
  transformer: superjson,
  errorFormatter({ error, shape }) {
    if (error.cause?.name === ZodError.name) {
      const { issues } = error.cause as ZodError;
      return {
        code: 400,
        message: 'Invalid request parameters',
        data: {
          ...shape.data,
          issues,
        },
      };
    }

    return shape;
  },
});
// Base router and procedure helpers
export const router = t.router;
export const procedure = t.procedure;
