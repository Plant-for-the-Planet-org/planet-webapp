import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { router, procedure } from '../trpc';
import prisma from '../../../prisma/client';
import { Purpose } from '../../utils/constants/myForest';
import { Prisma } from '@prisma/client';
import {
  ContributionsGeoJsonQueryResult,
  StatsQueryResult,
} from '../../features/common/types/myForest';

export const myForestRouter = router({
  contributions: procedure
    .input(
      z.object({
        profileId: z.string(),
        purpose: z.nullable(z.nativeEnum(Purpose)).optional(),
        limit: z.number(),
        cursor: z.string().nullish(),
        skip: z.number().optional(),
      })
    )
    .query(async ({ input: { profileId, limit, cursor, skip, purpose } }) => {
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
          guid: true,
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
                  in: !purpose
                    ? ['trees', 'conservation', 'bouquet']
                    : purpose === Purpose.TREES
                    ? ['trees', 'bouquet']
                    : ['conservation', 'bouquet'],
                },
                ...(purpose
                  ? {
                      OR: [
                        { bouquetPurpose: purpose },
                        { bouquetPurpose: null },
                      ],
                    }
                  : {}),
              },
              bouquetDonationId: {
                equals: null,
              },
            },
            {
              ...(purpose === undefined || purpose === Purpose.TREES
                ? {
                    contributionType: 'planting',
                    isVerified: 1,
                    bouquetDonationId: {
                      equals: null,
                    },
                  }
                : {}),
            },
          ],
        },
        skip: skip,
        take: limit + 1,
        cursor: cursor ? { guid: cursor } : undefined,
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (data.length > limit) {
        const nextItem = data.pop();
        nextCursor = nextItem?.guid;
      }

      return {
        data,
        nextCursor,
      };
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

      const data = await prisma.$queryRaw<StatsQueryResult[]>`
      SELECT
        SUM(CASE WHEN pp.purpose = 'trees' AND pp.unit_type = 'tree' THEN COALESCE(c.quantity, c.tree_count) ELSE 0 END) AS treeCount,
        SUM(CASE WHEN pp.purpose = 'trees' AND pp.unit_type = 'm2' THEN COALESCE(c.quantity, c.tree_count) ELSE 0 END) AS squareMeters,
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

      return data[0];
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

      let purposes;
      let join = Prisma.sql`LEFT JOIN project pp ON c.plant_project_id = pp.id`;

      if (purpose) {
        purposes = [purpose];
        if (purpose === Purpose.CONSERVATION) {
          join = Prisma.sql`JOIN project pp ON c.plant_project_id = pp.id`;
        }
      } else {
        purposes = ['trees', 'conservation'];
      }

      const data = await prisma.$queryRaw<ContributionsGeoJsonQueryResult[]>`
      SELECT COUNT(pp.guid) AS totalContribution, SUM(c.tree_count) AS treeCount, 
	      quantity,  c.purpose, MIN(c.plant_date) AS startDate,
	      MAX(c.plant_date) AS endDate, c.contribution_type, c.plant_date, pp.location, pp.country, 
        pp.unit_type, pp.guid, pp.name, pp.image,
        CASE WHEN c.contribution_type = 'planting' THEN JSON_EXTRACT(c.geometry, '$.coordinates[0]') ELSE pp.geo_latitude END AS geoLatitude,
        CASE WHEN c.contribution_type = 'planting' THEN JSON_EXTRACT(c.geometry, '$.coordinates[1]') ELSE pp.geo_longitude END AS geoLongitude,
        c.geometry, tpo.name AS tpo, tpo.guid AS tpoGuid
      FROM contribution c
              ${join}
              JOIN profile p ON p.id = c.profile_id
              LEFT JOIN profile tpo ON pp.tpo_id = tpo.id
      WHERE p.guid = ${profileId}
        AND c.deleted_at IS null
        AND (
              (
                c.contribution_type = 'donation'
                AND c.payment_status = 'paid'
                AND pp.purpose in (${Prisma.join(purposes)})
              )
              OR (
                c.contribution_type = 'planting'
                AND c.is_verified = 1
              )
          )
      GROUP BY pp.guid, c.geometry`;

      return data.map((contribution) => {
        return {
          type: 'Feature',
          properties: {
            cluster: false,
            purpose: contribution.purpose,
            quantity: contribution.treeCount
              ? contribution.treeCount
              : contribution.quantity,
            startDate: contribution.startDate,
            endDate: contribution.endDate,
            contributionType: contribution.contribution_type,
            totalContribution: contribution.totalContribution,
            plantProject: {
              guid: contribution.guid,
              name: contribution.name,
              image: contribution.image,
              country: contribution.country,
              unit: contribution.unit_type,
              location: contribution.location,
              tpo: {
                guid: contribution.tpoGuid,
                name: contribution.name,
              },
            },
          },
          geometry: {
            type: 'Point',
            coordinates: [
              contribution.geoLongitude,
              contribution.geoLatitude,
            ],
          },
        };
      });
    }),
});
