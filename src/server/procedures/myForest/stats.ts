import { z } from 'zod';
import { TRPCError } from '@trpc/server';

import { procedure } from '../../trpc';
import prisma from '../../../../prisma/client';
import {
  ContributionStatsQueryResult,
  CountryProjectStatsResult,
  GiftStatsQueryResult,
  StatsResult,
} from '../../../features/common/types/myForest';
import { Prisma } from '@prisma/client';

export const stats = procedure
  .input(
    z.object({
      profileId: z.string(),
      slug: z.string(),
    })
  )
  .query(async ({ input: { profileId, slug } }) => {
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

    const groupTreecounterData = await prisma.$queryRaw<
      {
        profile_id: string;
      }[]
    >`
			SELECT p.guid as profile_id
			FROM profile p
				INNER JOIN treecounter t ON p.treecounter_id = t.id
				INNER JOIN treecounter_group child ON child.treecounter_id = t.id
				INNER JOIN treecounter_group parent ON child.root_id = parent.id
			WHERE parent.slug = ${slug};
		`;

    // console.log('groupTreecounterData:', groupTreecounterData);

    const profileIds = Prisma.join(
      groupTreecounterData.length > 0
        ? groupTreecounterData.map(({ profile_id }) => profile_id)
        : [profileId]
    );

    // console.log(profileIds);

    const contributionData = await prisma.$queryRaw<
      ContributionStatsQueryResult[]
    >`
      SELECT
        SUM(CASE WHEN (pp.purpose = 'trees' AND pp.unit_type = 'tree') OR c.contribution_type = 'planting' THEN COALESCE(c.quantity, c.tree_count) ELSE 0 END) AS treeCount,
        SUM(CASE WHEN pp.purpose = 'trees' AND pp.unit_type = 'm2' THEN COALESCE(c.quantity, c.tree_count) ELSE 0 END) AS squareMeters,
        SUM(CASE WHEN pp.purpose = 'conservation' THEN c.quantity ELSE 0 END) AS conserved,
        SUM(CASE WHEN c.contribution_type = 'donation' THEN 1 ELSE 0 END) AS donations
      FROM
        contribution c
        LEFT JOIN project pp ON c.plant_project_id = pp.id
        JOIN profile p ON p.id = c.profile_id
      WHERE
        p.guid IN (${profileIds})
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
        )
      `;
    // console.log('contributionData:', contributionData);

    const giftData = await prisma.$queryRaw<GiftStatsQueryResult[]>`
        SELECT 
          SUM(CASE WHEN (g.purpose = 'trees') THEN (value/100) ELSE 0 END) AS treeCount,
            SUM(CASE WHEN (g.purpose = 'conservation') THEN (value/100) ELSE 0 END) AS conserved
        FROM gift g 
        JOIN profile p ON g.recipient_id = p.id
        WHERE p.guid IN (${profileIds})
      `;
    // console.log('giftData:', giftData);

    const countryProjectStats = await prisma.$queryRaw<
      CountryProjectStatsResult[]
    >`
			SELECT
				sub.projectid,
				sub.country
			FROM
				(
					SELECT
						pp.guid AS projectId,
						pp.country AS country
					FROM
						contribution c
						LEFT JOIN project pp ON c.plant_project_id = pp.id
						JOIN profile p ON p.id = c.profile_id
					WHERE
						p.guid IN (${profileIds})
						AND c.deleted_at IS NULL
						AND pp.guid IS NOT NULL
						AND pp.country IS NOT NULL
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
						)
					UNION
					SELECT
						(metadata ->> '$.project.id') AS projectId,
						(metadata ->> '$.project.country') AS country
					FROM
						gift g
						JOIN profile p ON g.recipient_id = p.id
					WHERE
						p.guid IN (${profileIds})
						AND g.deleted_at IS NULL
						AND g.purpose IN ('trees', 'conservation')
						AND (metadata ->> '$.project.id') IS NOT NULL
						AND (metadata ->> '$.project.country') IS NOT NULL
				) AS sub
			GROUP BY
				sub.projectid,
				sub.country;
		`;
    // console.log('countryProjectStats:', countryProjectStats);

    const uniqueCountries = new Set([
      ...countryProjectStats.map(({ country }) => country),
    ]);

    const uniqueProjects = countryProjectStats.map(
      ({ projectId }) => projectId
    );

    const constributionsStats = contributionData[0];
    const giftStats = giftData[0];

    const finalStats: StatsResult = {
      projects: uniqueProjects.length ?? 0,
      countries: uniqueCountries.size ?? 0,
      donations: constributionsStats.donations ?? 0,
      squareMeters: constributionsStats.squareMeters ?? 0,
      treeCount:
        Number(constributionsStats.treeCount) + Number(giftStats.treeCount),
      conserved:
        Number(constributionsStats.conserved) + Number(giftStats.conserved),
    };

    return finalStats;
  });
