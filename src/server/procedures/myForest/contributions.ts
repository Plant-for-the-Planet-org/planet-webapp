import { z } from 'zod';
import { TRPCError } from '@trpc/server';

import prisma from '../../../../prisma/client';
import { Purpose } from '../../../utils/constants/myForest';
import { procedure } from '../../trpc';

export const contributions = procedure
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
                    OR: [{ bouquetPurpose: purpose }, { bouquetPurpose: null }],
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
      orderBy: {
        plantDate: 'desc',
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
  });
