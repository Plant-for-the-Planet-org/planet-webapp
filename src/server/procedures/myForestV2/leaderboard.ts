import { z } from 'zod';
import { procedure } from '../../trpc';
import { Leaderboard } from '../../../features/common/types/myForestv2';
import prisma from '../../../../prisma/client';
import { TRPCError } from '@trpc/server';
import { Prisma } from '@prisma/client';
import { fetchProfile } from '../../utils/fetchProfile';
import { fetchGroupTreecounterData } from '../../utils/fetchGroupTreecounterData';

async function fetchMostRecentGifts(profileIds: number[]) {
  return await prisma.$queryRaw<
    {
      quantity: number;
      giverName: string;
      purpose: 'trees' | 'conservation';
    }[]
  >`
		SELECT
			round((value)/100, 2) as quantity,
			COALESCE(NULLIF(metadata->>'$.giver.name', ''), 'anonymous') as giverName,
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
			sum(round((value)/100, 2)) as totalQuantity,
			metadata->>'$.giver.name' as giverName,
			purpose
		FROM gift
		WHERE 
			recipient_id IN (${Prisma.join(profileIds)}) 
			AND deleted_at IS NULL 
			AND value <> 0 
			AND metadata->>'$.giver.name' IS NOT NULL
			AND metadata->>'$.giver.name' <> ''
		GROUP BY giverName, purpose
		ORDER BY totalQuantity DESC
		LIMIT 10;
	`;
}

export const leaderboardProcedure = procedure
  .input(
    z.object({
      profileId: z.string(),
      slug: z.string(),
    })
  )
  .query(async ({ input: { profileId, slug } }) => {
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

    // Check if the profile is associated with a group treecounter, and fetch all profile ids for that group (parent and children)
    // slug and treecounterId are used to identify the group treecounter, if there is a mismatch, it will be treated as a normal profile
    const groupTreecounterData = await fetchGroupTreecounterData(
      slug,
      profile.treecounterId
    );
    const profileIds =
      groupTreecounterData.length > 0
        ? groupTreecounterData.map(({ profileId }) => profileId)
        : [profile.id];

    // Fetch the most recent gifts for the profile(s)
    const mostRecentGifts = await fetchMostRecentGifts(profileIds);

    leaderboard.mostRecent = mostRecentGifts.map((gift) => ({
      name: gift.giverName,
      units: gift.quantity,
      unitType: 'tree',
      purpose: gift.purpose,
    }));

    // Fetch the top 10 gifters for the profile(s)
    const topGifters = await fetchTopGifters(profileIds);

    leaderboard.mostTrees = topGifters.map((gifter) => ({
      name: gifter.giverName,
      units: gifter.totalQuantity,
      unitType: 'tree',
      purpose: gifter.purpose,
    }));

    return leaderboard;
  });
