import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { router, procedure } from '../trpc';
import prisma from '../../../prisma/client';
import { Purpose } from '../../utils/constants/myForest';


export interface QueryResult {
  treeCount: number;
  squareMeters: number;
  conserved: number;
  projects: number;
  countries: number;
  donations: number;
}

export const myForestRouter = router({
  contributions: procedure
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
          plantDate: true,
          contributionType: true,
          bouquetContributions: {
            select: {
              purpose: true,
              treeCount: true,
              quantity: true,
              plantDate: true,
              contributionType: true,
              plantProject: {
                select: {
                  guid: true,
                  name: true,
                  image: true,
                  country: true,
                  unit: true,
                  location: true,
                  geoLatitude: true,
                  geoLongitude: true,
                  tpo: true,
                },
              },
            },
          },
          plantProject: {
            select: {
              guid: true,
              name: true,
              image: true,
              country: true,
              unit: true,
              location: true,
              geoLatitude: true,
              geoLongitude: true,
              tpo: true,
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
                  in: ['trees', 'conservation', 'bouquet'],
                },
              },
              bouquetDonationId: {
                equals: null,
              },
            },
            {
              contributionType: 'planting',
              isVerified: 1,
              bouquetDonationId: {
                equals: null,
              },
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
        COUNT(DISTINCT pp.country) AS countries,
        COUNT(*) AS donations
      FROM
        contribution c
        LEFT JOIN project pp ON c.plant_project_id = pp.id
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

  contributionsGeoJson: procedure
    .input(
      z.object({
        profileId: z.string(),
        purpose: z.nullable(z.nativeEnum(Purpose)).optional(),
      })
    )
    .query(async ({ input: { profileId, purpose } }) => {
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
          plantDate: true,
          contributionType: true,
          plantProject: {
            select: {
              guid: true,
              name: true,
              image: true,
              country: true,
              unit: true,
              location: true,
              geoLatitude: true,
              geoLongitude: true,
              tpo: true,
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
                  in: purpose ? purpose : ['trees', 'conservation'],
                },
              },
            },
            {
              contributionType: 'planting',
              isVerified: 1,
            },
          ],
        },
      });

      return data.map((contribution) => {
        return {
          type: 'Feature',
          properties: {
            cluster: false,
            category: contribution.purpose,
            quantity: contribution.quantity,
            plantDate: contribution.plantDate,
            contributionType: contribution.contributionType,
            plantProject: contribution.plantProject,
          },
          geometry: {
            type: 'Point',
            coordinates: [
              contribution.plantProject?.geoLatitude,
              contribution.plantProject?.geoLongitude,
            ],
          },
        };
      });
    }),
});
