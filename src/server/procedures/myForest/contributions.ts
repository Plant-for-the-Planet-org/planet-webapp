import { z } from 'zod';
import { TRPCError } from '@trpc/server';

import prisma from '../../../../prisma/client';
import { Purpose } from '../../../utils/constants/myForest';
import { procedure } from '../../trpc';

export const contributions = procedure
  .input(
    z.object({
      profileId: z.string(),
      slug: z.string(),
      purpose: z.nullable(z.nativeEnum(Purpose)).optional(),
      limit: z.number(),
      cursor: z.string().nullish(),
      skip: z.number().optional(),
    })
  )
  .query(
    async ({ input: { profileId, slug, limit, cursor, skip, purpose } }) => {
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

      const profileIds =
        groupTreecounterData.length > 0
          ? groupTreecounterData.map(({ profile_id }) => profile_id)
          : [profileId];

      const _cursor = cursor ? cursor.split(',') : undefined;

      const contributionsCursor =
        _cursor?.[0] !== 'undefined' && _cursor?.[0] !== 'null'
          ? _cursor?.[0]
          : undefined;

      const giftDataCursor =
        _cursor?.[1] !== 'undefined' && _cursor?.[1] !== 'null'
          ? _cursor?.[1]
          : undefined;

      // Fetch contributions and gifts

      const contributions = await prisma.contribution.findMany({
        select: {
          guid: true,
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
                  allowDonations: true,
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
            orderBy: {
              plantDate: 'desc',
            },
          },
          plantProject: {
            select: {
              allowDonations: true,
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
          giftTo: true,
        },
        where: {
          profile: {
            guid: { in: profileIds },
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
          plantDate: {
            lte: contributionsCursor
              ? new Date(contributionsCursor)
              : new Date(),
          },
        },
        orderBy: {
          plantDate: 'desc',
        },
        skip: skip,
        take: _cursor && _cursor[0] === 'undefined' ? 0 : limit + 1,
      });

      const gifts = await prisma.gift.findMany({
        select: {
          plantDate: true,
          value: true,
          guid: true,
          recipient: true,
          metadata: true,
          purpose: true,
          type: true,
          redemptionDate: true,
        },
        where: {
          recipient: {
            guid: { in: profileIds },
          },
          purpose: {
            equals:
              purpose === Purpose.TREES ? Purpose.TREES : Purpose.CONSERVATION,
          },
          OR: [
            {
              plantDate: {
                lte: giftDataCursor ? new Date(giftDataCursor) : new Date(),
              },
            },
            {
              redemptionDate: {
                lte: giftDataCursor ? new Date(giftDataCursor) : new Date(),
              },
            },
          ],
        },
        orderBy: {
          plantDate: 'desc',
        },
        skip: skip,
        take: _cursor && _cursor[1] === 'undefined' ? 0 : limit + 1,
      });

      // There are gifts in the database that don't have an image, so we need to fetch them separately here
      // and fetch the images from the project table and prep them for the response

      const giftProjectsWithoutImage =
        gifts.length > 0
          ? gifts
              .filter(
                (gift) =>
                  !JSON.parse(JSON.stringify(gift.metadata))?.project?.image
              )
              .map(
                (gift) => JSON.parse(JSON.stringify(gift.metadata))?.project?.id
              )
          : [];

      const projectsWithImage = await prisma.project.findMany({
        select: {
          guid: true,
          image: true,
        },
        where: {
          guid: {
            in: giftProjectsWithoutImage,
          },
        },
      });

      // There are gifts in the database that don't have an allowDonations field, so we need to fetch them separately here
      // and fetch the allowDonations from the project table and prep them for the response

      const giftProjectIds =
        gifts.length > 0
          ? gifts.map(
              (gift) => JSON.parse(JSON.stringify(gift.metadata))?.project?.id
            )
          : [];

      const giftProjects = await prisma.project.findMany({
        select: {
          guid: true,
          allowDonations: true,
        },
        where: {
          guid: {
            in: giftProjectIds,
          },
        },
      });

      // Process the prepared data

      function processGiftData(
        giftObjects: typeof gifts,
        projectsWithImage: {
          guid: string;
          image: string | null;
        }[],
        giftProjects: {
          guid: string;
          allowDonations: boolean;
        }[]
      ) {
        return giftObjects.map((giftObject) => {
          const projectId = JSON.parse(JSON.stringify(giftObject.metadata))
            ?.project?.id;
          const projectImage = projectsWithImage.find(
            (project) => project.guid === projectId
          )?.image;
          const projectAllowDonations = giftProjects.find(
            (project) => project.guid === projectId
          )?.allowDonations;

          const giftMetadata = JSON.parse(JSON.stringify(giftObject.metadata));

          const _gift = {
            ...giftObject,
            _type: 'gift',
            quantity: giftObject.value ? giftObject.value / 100 : 0,
            metadata: {
              ...(giftObject?.metadata as object),
              project: {
                ...giftMetadata?.project,
                image: giftMetadata?.project?.image ?? projectImage,
              },
            },
            allowDonations: projectAllowDonations,
            plantDate: giftObject.plantDate
              ? giftObject.plantDate
              : giftObject.redemptionDate,
          };

          delete _gift.redemptionDate;

          return _gift;
        });
      }

      function processContributionData(
        contributionResults: typeof contributions
      ) {
        return contributionResults.map((contribution) => {
          return {
            ...contribution,
            _type: 'contribution',
          };
        });
      }

      const combinedData = [
        ...processContributionData(contributions),
        ...processGiftData(gifts, projectsWithImage, giftProjects),
      ];

      const sortedData = combinedData.sort((a, b) => {
        // Move objects with null plantDate to the beginning
        if (!a.plantDate) return 1;
        if (!b.plantDate) return -1;
        return b.plantDate.getTime() - a.plantDate.getTime();
      });

      const data = sortedData.slice(0, limit);
      let nextCursor;
      if (sortedData.length > limit) {
        const nextItem = sortedData[limit]; // Get the (limit + 1)-th item
        let nextContributionCursor: Date | undefined | null;
        let nextGiftDataCursor: Date | undefined | null;

        // Iterate over the remaining items to find the next cursors
        for (const item of sortedData.slice(limit)) {
          if (item._type === 'contribution' && !nextContributionCursor) {
            nextContributionCursor = item.plantDate;
          } else if (item._type === 'gift' && !nextGiftDataCursor) {
            nextGiftDataCursor = item.plantDate;
          }

          // Break if both cursors are found
          if (nextContributionCursor && nextGiftDataCursor) {
            break;
          }
        }

        // If only one type of data reached the limit, set the cursor for the other type
        if (!nextContributionCursor) {
          nextContributionCursor =
            nextItem._type === 'contribution' ? nextItem.plantDate : undefined;
        }
        if (!nextGiftDataCursor) {
          nextGiftDataCursor =
            nextItem._type === 'gift' ? nextItem.plantDate : undefined;
        }

        nextCursor = `${nextContributionCursor?.toISOString()},${nextGiftDataCursor?.toISOString()}`;
      }

      return {
        data,
        nextCursor,
      };
    }
  );
