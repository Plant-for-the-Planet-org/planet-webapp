import type { Leaderboard } from '../../../features/common/types/myForest';

import { z } from 'zod';
import { procedure } from '../../trpc';
import prisma from '../../../../prisma/client';
import { TRPCError } from '@trpc/server';
import { Prisma } from '@prisma/client';
import { fetchProfile } from '../../utils/fetchProfile';
import { fetchProfileGroupData } from '../../utils/fetchProfileGroupData';
import { getCachedData } from '../../utils/cache';
import { cacheKeyPrefix } from '../../../utils/constants/cacheKeyPrefix';

async function fetchMostRecentGifts(profileIds: number[]) {
  return await prisma.$queryRaw<
    {
      quantity: number;
      giverName: string;
      purpose: 'trees' | 'conservation';
    }[]
  >`
		SELECT
			ROUND(CAST(value AS NUMERIC)/100, 2) as "quantity",
			COALESCE(NULLIF(metadata->'giver'->>'name', ''), 'anonymous') as "giverName",
			purpose
		FROM gift
		WHERE 
			recipient_id IN (${Prisma.join(profileIds)}) 
			AND deleted_at IS NULL 
			AND value <> 0
		ORDER BY payment_date DESC
		LIMIT 10;
	`;
}

async function fetchTopGifters(profileIds: number[]) {
  return await prisma.$queryRaw<
    {
      totalQuantity: number;
      giverName: string;
      purpose: 'trees' | 'conservation';
    }[]
  >`
		SELECT
			SUM(ROUND(CAST(value AS NUMERIC)/100, 2)) as "totalQuantity",
			metadata->'giver'->>'name' as "giverName",
			purpose
		FROM gift
		WHERE 
			recipient_id IN (${Prisma.join(profileIds)}) 
			AND deleted_at IS NULL 
			AND value <> 0 
			AND metadata->'giver'->>'name' IS NOT NULL
			AND metadata->'giver'->>'name' <> ''
		GROUP BY "giverName", "purpose"
		ORDER BY "totalQuantity" DESC
		LIMIT 10;
	`;
}

export const leaderboardProcedure = procedure
  .input(
    z.object({
      profileId: z.string(),
      isPublicProfile: z.boolean().optional(),
    })
  )
  .query(async ({ input: { profileId, isPublicProfile } }) => {
    const fetchLeaderboardData = async () => {
      // Initialize return values
      const leaderboard: Leaderboard = {
        mostRecent: [],
        mostTrees: [],
      };

      // Check that the profile actually exists
      const profile = await fetchProfile(profileId);

      if (!profile) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Profile not found',
        });
      }

      // Check if the profile is associated with a profile group, and fetch all profile ids for that group (parent and children)
      const profileGroupData = await fetchProfileGroupData(profile.id);
      const profileIds =
        profileGroupData.length > 0
          ? profileGroupData.map(({ profileId }) => profileId)
          : [profile.id];

      // Fetch the most recent gifts for the profile(s)
      const mostRecentGifts = await fetchMostRecentGifts(profileIds);

      leaderboard.mostRecent = mostRecentGifts.map((gift) => ({
        name: gift.giverName,
        units: Number(gift.quantity),
        unitType: 'tree',
        purpose: gift.purpose,
      }));

      // Fetch the top 10 gifters for the profile(s)
      const topGifters = await fetchTopGifters(profileIds);

      leaderboard.mostTrees = topGifters.map((gifter) => ({
        name: gifter.giverName,
        units: Number(gifter.totalQuantity),
        unitType: 'tree',
        purpose: gifter.purpose,
      }));

      return leaderboard;
    };

    if (isPublicProfile) {
      try {
        return await getCachedData(
          `${cacheKeyPrefix}_pp-leaderboard_${profileId}`,
          fetchLeaderboardData
        );
      } catch (err) {
        console.error(`Error fetching profile leaderboard: ${err}`);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Error fetching public profile leaderboard',
        });
      }
    }

    return await fetchLeaderboardData();
  });
