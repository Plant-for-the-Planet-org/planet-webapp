import { PrismaClient } from '@prisma/client';
import { router, procedure } from '../trpc';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { TRPC_ERROR_CODES_BY_KEY } from '@trpc/server/rpc';
import { APIError } from '@planet-sdk/common';

const prisma = new PrismaClient();
prisma.$connect();

export const appRouter = router({
  contribution: procedure
    .input(
      z.object({
        profileId: z.string(),
      })
    )
    .query(async ({ input }) => {
      const data = await prisma.contribution.findMany({
        select: {
          purpose: true,
          tree_count: true,
          quantity: true,
          plant_project: {
            select: {
              country_code: true,
              unit: true,
              location: true,
              geo_latitude: true,
              geo_longitude: true,
            },
          },
        },
        where: {
          profile: {
            guid: input.profileId,
          },
          deleted_at: null,
          OR: [
            {
              contribution_type: 'donation',
              payment_status: 'paid',
              plant_project: {
                purpose: {
                  in: ['trees', 'conservation'],
                },
              },
            },
            {
              contribution_type: 'planting',
              is_verified: true,
            },
          ],
        },
      });
      return data;
    }),

  stats: procedure
    .input(
      z.object({
        profileId: z.string(),
      })
    )
    .query(async ({ input }) => {
      interface QueryResult {
        tree_count: number;
        square_meters: number;
        conserved: number;
        projects: number;
        countries: number;
        donations: number;
      }

      const data = await prisma.$queryRaw<QueryResult[]>`
    SELECT
      SUM(CASE WHEN pp.purpose = 'trees' AND pp.unit = 'tree' THEN COALESCE(c.quantity, c.tree_count) ELSE 0 END) AS tree_count,
      SUM(CASE WHEN pp.purpose = 'trees' AND pp.unit = 'm2' THEN COALESCE(c.quantity, c.tree_count) ELSE 0 END) AS square_meters,
      SUM(CASE WHEN pp.purpose = 'conservation' THEN c.quantity ELSE 0 END) AS conserved,
      COUNT(DISTINCT pp.id) AS projects,
      COUNT(DISTINCT pp.country_code) AS countries,
      COUNT(*) AS donations
    FROM
      contribution c
      LEFT JOIN plant_project pp ON c.plant_project_id = pp.id
      JOIN profile p ON p.id = c.profile_id
    WHERE
      p.guid = ${input.profileId}
      AND c.deleted_at IS NULL
      AND (
        (
          c.contribution_type = 'donation'
          AND c.payment_status = 'paid'
          AND pp.purpose IN ('trees', 'conservation')
        )
        OR (
          c.contribution_type = 'planting'
          AND c.is_verified = 1
        )
      )`;

      return data;
    }),

  // testError: procedure.query(async () => {
  //   throw new TRPCError({ message: 'Boiii', code: 'BAD_REQUEST' });
  // }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
