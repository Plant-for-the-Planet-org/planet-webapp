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
        created: {
          lte: contributionsCursor ? new Date(contributionsCursor) : new Date(),
        },
      },
      orderBy: {
        created: 'desc',
      },
      skip: skip,
      take: limit,
    });

    const giftData = await prisma.gift.findMany({
      select: {
        created: true,
        value: true,
        guid: true,
        donationId: true,
        recipient: true,
        metadata: true,
        contribution: {
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
          },
        },
      },
      where: {
        recipient: {
          guid: profileId,
        },
        created: {
          lte: giftDataCursor ? new Date(giftDataCursor) : new Date(),
        },
      },
      orderBy: {
        created: 'desc',
      },
      skip: skip,
      take: limit,
    });

    function convertGiftsToContributions(giftObjects: typeof giftData) {
      return giftObjects.map((giftObject) => {
        return {
          type: 'gift',
          guid: giftObject.guid,
          purpose: giftObject.contribution?.purpose,
          treeCount: giftObject.contribution?.treeCount,
          quantity: giftObject.contribution?.quantity
            ? giftObject.contribution?.quantity
            : giftObject.value
            ? giftObject.value / 100
            : 0,
          plantDate: giftObject.contribution?.plantDate,
          contributionType: giftObject.contribution?.contributionType,
          created: giftObject.contribution?.created ?? giftObject.created,
          tenant: giftObject.contribution?.tenant,
          bouquetContributions: giftObject.contribution?.bouquetContributions,
          plantProject: giftObject.contribution?.plantProject,
          gift: [
            {
              guid: giftObject.guid,
              metadata: giftObject.metadata,
            },
          ],
          giftData: null,
        };
      });
    }

    const combinedData = [
      ...contributions,
      ...convertGiftsToContributions(giftData),
    ];

    const sortedData = combinedData.sort(
      (a, b) => b.created.getTime() - a.created.getTime()
    );

    const data = sortedData.slice(0, limit);

    let nextCursor: string | undefined;

    if (sortedData.length > limit) {
      const omittedData = sortedData.slice(limit);

      let nextContributionCursor: Date | undefined;
      let nextGiftDataCursor: Date | undefined;

      for (const item of omittedData) {
        if (!nextContributionCursor && item.giftData === null) {
          nextContributionCursor = item.created;
        } else if (!nextGiftDataCursor && item.type === 'gift') {
          nextGiftDataCursor = item.created;
        }

        // Break the loop if both cursors are found
        if (nextContributionCursor && nextGiftDataCursor) {
          break;
        }
      }

      // Determine the nextCursor based on the extracted cursors
      if (nextContributionCursor || nextGiftDataCursor) {
        nextCursor = `${nextContributionCursor},${nextGiftDataCursor}`;
      }
    }

    return {
      data,
      nextCursor,
    };
  });
