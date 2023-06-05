import { PrismaClient } from '@prisma/client';
import { router, procedure } from '../trpc';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';



const prisma = new PrismaClient()
prisma.$connect()

export const appRouter = router({
  contribution: procedure
    .input(
      z.object({
        profileId: z.string(),
      })
    )
    .query(async ({ input: { profileId } }) => {
      const profile = await prisma.profile.findFirst({
        where: {
          guid: profileId,
        },
      });

      if (!profile) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Profile not found',
        });
      }

      const data = await prisma.contribution.findMany({
        select: {
          purpose: true,
          treeCount: true,
          quantity: true,
          plantProject: {
            select: {
              countryCode: true,
              unit: true,
              location: true,
              geoLatitude: true,
              geoLongitude: true,
            },
          },
        },
        where: {
          profile: {
            guid: profileId,
          },
          deletedAt: null,
          OR: [
            {
              contributionType: 'donation',
              paymentStatus: 'paid',
              plantProject: {
                purpose: {
                  in: ['trees', 'conservation'],
                },
              },
            },
            {
              contributionType: 'planting',
              isVerified: true,
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
    .query(async ({ input: { profileId } }) => {
      interface QueryResult {
        treeCount: number;
        squareMeters: number;
        conserved: number;
        projects: number;
        countries: number;
        donations: number;
      }

      const profile = await prisma.profile.findFirst({
        where: {
          guid: profileId,
        },
      });

      if (!profile) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Profile not found',
        });
      }

      const data = await prisma.$queryRaw<QueryResult[]>`
    SELECT
      SUM(CASE WHEN pp.purpose = 'trees' AND pp.unit = 'tree' THEN COALESCE(c.quantity, c.tree_count) ELSE 0 END) AS treeCount,
      SUM(CASE WHEN pp.purpose = 'trees' AND pp.unit = 'm2' THEN COALESCE(c.quantity, c.tree_count) ELSE 0 END) AS squareMeters,
      SUM(CASE WHEN pp.purpose = 'conservation' THEN c.quantity ELSE 0 END) AS conserved,
      COUNT(DISTINCT pp.id) AS projects,
      COUNT(DISTINCT pp.country_code) AS countries,
      COUNT(*) AS donations
    FROM
      contribution c
      LEFT JOIN plant_project pp ON c.plant_project_id = pp.id
      JOIN profile p ON p.id = c.profile_id
    WHERE
      p.guid = ${profileId}
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
});

// export type definition of API
export type AppRouter = typeof appRouter;
