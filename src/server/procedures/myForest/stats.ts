import { z } from 'zod';
import { TRPCError } from '@trpc/server';

import { procedure } from '../../trpc';
import prisma from '../../../../prisma/client';
import {
  ContributionStatsQueryResult,
  GiftStatsQueryResult,
  StatsResult,
} from '../../../features/common/types/myForest';

export const stats = procedure
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

    const contributionData = await prisma.$queryRaw<
      ContributionStatsQueryResult[]
    >`
      SELECT
        SUM(CASE WHEN (pp.purpose = 'trees' AND pp.unit_type = 'tree') OR c.contribution_type = 'planting' THEN COALESCE(c.quantity, c.tree_count) ELSE 0 END) AS treeCount,
        SUM(CASE WHEN pp.purpose = 'trees' AND pp.unit_type = 'm2' THEN COALESCE(c.quantity, c.tree_count) ELSE 0 END) AS squareMeters,
        SUM(CASE WHEN pp.purpose = 'conservation' THEN c.quantity ELSE 0 END) AS conserved,
        COUNT(DISTINCT pp.id) AS projects,
        COUNT(DISTINCT pp.country) AS countries,
        SUM(CASE WHEN c.contribution_type = 'donation' THEN 1 ELSE 0 END) AS donations
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
        )
      `;

    const giftData = await prisma.$queryRaw<GiftStatsQueryResult[]>`
        SELECT 
          SUM(CASE WHEN (g.purpose = 'trees') THEN (value/100) ELSE 0 END) AS treeCount,
            SUM(CASE WHEN (g.purpose = 'conservation') THEN (value/100) ELSE 0 END) AS conserved
        FROM gift g 
        JOIN profile p ON g.recipient_id = p.id
        WHERE p.guid = ${profileId}
      `;

    const constributionsStats = contributionData[0];
    const giftStats = giftData[0];

    const finalStats: StatsResult = {
      projects: constributionsStats.projects ?? 0,
      countries: constributionsStats.countries ?? 0,
      donations: constributionsStats.donations ?? 0,
      squareMeters: constributionsStats.squareMeters ?? 0,
      treeCount:
        Number(constributionsStats.treeCount) + Number(giftStats.treeCount),
      conserved:
        Number(constributionsStats.conserved) + Number(giftStats.conserved),
    };

    return finalStats;
  });
