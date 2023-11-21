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

    const _cursor = cursor ? cursor.split(',') : undefined;
    const contributionsCursor =
      _cursor?.[0] !== 'undefined' ? _cursor?.[0] : undefined;
    const giftDataCursor =
      _cursor?.[1] !== 'undefined' ? _cursor?.[1] : undefined;

    const contributions = await prisma.contribution.findMany({
      select: {
        guid: true,
        purpose: true,
        treeCount: true,
        quantity: true,
        plantDate: true,
        contributionType: true,
        created: true,
        tenant: {
          select: {
            guid: true,
            name: true,
          },
        },
        bouquetContributions: {
          select: {
            purpose: true,
            treeCount: true,
            quantity: true,
            plantDate: true,
            contributionType: true,
            tenant: {
              select: {
                guid: true,
                name: true,
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
        gift: {
          select: {
            guid: true,
            metadata: true,
          },
        },
        giftData: true,
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
      cursor: contributionsCursor ? { guid: contributionsCursor } : undefined,
    });

    const giftData = await prisma.contribution.findMany({
      select: {
        guid: true,
        purpose: true,
        treeCount: true,
        quantity: true,
        plantDate: true,
        created: true,
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
        gift: true,
        giftData: true,
      },
      where: {
        gift: {
          some: {
            recipient: {
              guid: profileId,
            },
          },
        },
        deletedAt: null,
      },
      orderBy: {
        plantDate: 'desc',
      },
      skip: skip,
      take: limit + 1,
      cursor: giftDataCursor ? { guid: giftDataCursor } : undefined,
    });

    console.log('giftData', giftData);

    // console.log(
    //   limit,
    //   'giftData.length',
    //   giftData,
    //   'contributions.length',
    //   contributions.length
    // );

    const combinedData = [...contributions, ...giftData];

    const sortedData = combinedData.sort(
      (a, b) => new Date(b.plantDate) - new Date(a.plantDate)
    );

    // console.log('data', sortedData.length);

    const data = sortedData.slice(0, limit + 2);

    console.log(
      'lost data ',
      limit,
      sortedData.length,
      sortedData.slice(limit + 1, 1000)
    );

    // console.log('data2', data.length);

    let nextCursor: typeof cursor | undefined = undefined;
    if (sortedData.length > limit) {
      const nextItem = data.pop();
      console.log('nextItem', nextItem);
      nextCursor = `${contributions[contributions.length - 1]?.guid},${
        giftData[giftData.length - 1]?.guid
      }`;
    }

    return {
      data,
      nextCursor,
    };
  });
