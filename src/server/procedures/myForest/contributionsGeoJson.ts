import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { Prisma } from '@prisma/client';
import centerOfMass from '@turf/center-of-mass';
import { multiPoint } from '@turf/helpers';
import { Position } from '@turf/turf';

import { procedure } from '../../trpc';
import { Purpose } from '../../../utils/constants/myForest';
import prisma from '../../../../prisma/client';
import {
  ContributionsGeoJsonQueryResult,
  GiftsGeoJsonQueryResult,
} from '../../../features/common/types/myForest';
import { Feature, Point } from 'geojson';

/**
 * Check different types of contribution's geometry and
 * returns appropriate coordinates
 *
 * @param {ContributionsGeoJsonQueryResult} contribution Single contribution from the resulting list of contributionsGeoJson Query
 * @returns {Position} Point Coordinate
 */

const getCoordinates = (contribution: ContributionsGeoJsonQueryResult) => {
  if (contribution.geometry) {
    if (contribution.geometry.type === 'Polygon') {
      const polygonCoordinates = contribution.geometry
        .coordinates[0] as Position[];
      return centerOfMass(multiPoint(polygonCoordinates)).geometry?.coordinates;
    } else if (contribution.geometry.type === 'Point') {
      return [
        contribution.geometry.coordinates[0],
        contribution.geometry.coordinates[1],
      ];
    }
  } else return [contribution.geoLongitude, contribution.geoLatitude];
};

enum ComparisonType {
  BEFORE = 'before',
  AFTER = 'after',
}

/**
 * Compare two dates and return the date that is before or after the other date, depending on the comparisonType
 *
 * @param {Date} date1 - Date to compare
 * @param {Date} date2 - Date to compare
 * @param {ComparisonType} comparisonType - Comparison type to use for comparison (before or after)
 *
 * @returns {Date} - Date that is before or after the other date, depending on the comparisonType
 */
const compareDate = (
  date1: Date,
  date2: Date,
  comparisonType: ComparisonType
) => {
  if (date1 && date2) {
    return comparisonType === ComparisonType.BEFORE
      ? new Date(date1) < new Date(date2)
        ? date1
        : date2
      : new Date(date1) > new Date(date2)
      ? date1
      : date2;
  }
  return date1 || date2;
};

/**
 *  Merge features with same coordinates
 *
 * @param {Feature[]} features - List of features to merge with same coordinates
 *
 * @returns {Feature[]} features - List of features with merged features with same coordinates
 */
const mergeFeaturesWithSameCoordinates = (features: Feature[]): Feature[] => {
  const mergedFeaturesMap = new Map();
  features.forEach((feature: Feature) => {
    const key = JSON.stringify((feature.geometry as Point).coordinates);
    if (!mergedFeaturesMap.has(key)) {
      mergedFeaturesMap.set(key, feature);
    } else {
      // Merge properties, including quantity
      const existingFeature = mergedFeaturesMap.get(key);
      existingFeature.properties = {
        ...existingFeature.properties,
        ...feature.properties,
        quantity:
          (Number(existingFeature.properties.quantity) || 0) +
          (Number(feature.properties?.quantity) || 0),
        totalContributions:
          (Number(existingFeature.properties.totalContributions) || 0) +
          (Number(feature.properties?.totalContributions) || 0),
        startDate: compareDate(
          existingFeature.properties.startDate,
          feature.properties?.created,
          ComparisonType.BEFORE
        ),
        endDate: compareDate(
          existingFeature.properties.endDate,
          feature.properties?.created,
          ComparisonType.AFTER
        ),
        project: {
          guid: existingFeature.properties.project.guid,
          name: existingFeature.properties.project.name,
          image: existingFeature.properties.project.image,
          unitType: existingFeature.properties.project.unitType,
          tpo: existingFeature.properties.project.tpo,
          country: existingFeature.properties.project.country,
        },
      };

      // Keep track of original _type values
      // Update _type only if they differ
      if (existingFeature.properties._type !== feature.properties?._type) {
        existingFeature.properties._type = 'merged_contribution_and_gift';
      }

      delete existingFeature.properties.created;
    }
  });

  return Array.from(mergedFeaturesMap.values());
};

export const contributionsGeoJson = procedure
  .input(
    z.object({
      profileId: z.string(),
      slug: z.string(),
      purpose: z.nullable(z.nativeEnum(Purpose)).optional(),
    })
  )
  .query(async ({ input: { profileId, slug, purpose } }) => {
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

    const profileIds = Prisma.join(
      groupTreecounterData.length > 0
        ? groupTreecounterData.map(({ profile_id }) => profile_id)
        : [profileId]
    );

    let purposes;
    let join = Prisma.sql`LEFT JOIN project pp ON c.plant_project_id = pp.id`;
    let registerTreesClause = Prisma.sql`OR (
      c.contribution_type = 'planting'
      AND c.is_verified = 1
    )`;

    if (purpose) {
      purposes = [purpose];
      if (purpose === Purpose.CONSERVATION) {
        join = Prisma.sql`JOIN project pp ON c.plant_project_id = pp.id`;
        registerTreesClause = Prisma.sql``;
      }
    } else {
      purposes = ['trees', 'conservation'];
    }

    const data = await prisma.$queryRaw<ContributionsGeoJsonQueryResult[]>`
      SELECT COUNT(pp.guid) AS totalContributions, SUM(c.tree_count) AS treeCount, 
        SUM(c.quantity) AS quantity,  c.purpose, MIN(c.plant_date) AS startDate,
        MAX(c.plant_date) AS endDate, c.contribution_type, c.plant_date, pp.country, 
        pp.unit_type, pp.guid, pp.name, pp.image, pp.geo_latitude AS geoLatitude, 
        pp.geo_longitude AS geoLongitude, c.geometry, tpo.name AS tpoName, pp.accept_donations as allowDonations
      FROM contribution c
              ${join}
              JOIN profile p ON p.id = c.profile_id
              LEFT JOIN profile tpo ON pp.tpo_id = tpo.id
      WHERE p.guid IN (${profileIds})
        AND c.deleted_at IS null
        AND (
              (
                c.contribution_type = 'donation'
                AND c.payment_status = 'paid'
                AND pp.purpose in (${Prisma.join(purposes)})
              )
              ${registerTreesClause}
          )
      GROUP BY pp.guid, c.geometry`;

    const giftData = await prisma.$queryRaw<GiftsGeoJsonQueryResult[]>`
      SELECT g.type as type, g.purpose as purpose, (g.value)/100 as value,
        g.metadata as metadata, g.created as created
      FROM gift g 
      JOIN profile p ON g.recipient_id = p.id
      WHERE p.guid IN (${profileIds}) AND g.purpose IN (${Prisma.join(
      purposes
    )})
    `;

    const giftProjectsWithoutImage =
      giftData.length > 0
        ? giftData
            .filter(
              (gift) =>
                !JSON.parse(JSON.stringify(gift.metadata))?.project?.image
            )
            .map(
              (gift) => JSON.parse(JSON.stringify(gift.metadata))?.project?.id
            )
            .filter((id) => id !== null && id !== undefined)
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
      giftData.length > 0
        ? giftData
            .map(
              (gift) => JSON.parse(JSON.stringify(gift.metadata))?.project?.id
            )
            .filter((id) => id !== null && id !== undefined)
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

    const contributions = data.map((contribution) => {
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
          totalContributions: contribution.totalContributions,
          project: {
            guid: contribution.guid,
            name: contribution.name,
            image: contribution.image,
            country: contribution.country,
            unitType: contribution.unit_type,
            allowDonations: contribution.allowDonations ? true : false,
            tpo: {
              name: contribution.tpoName,
            },
          },
          _type: 'contribution',
        },
        geometry: {
          type: 'Point',
          coordinates: getCoordinates(contribution),
        },
      };
    }) as Feature[];

    const gifts = giftData
      .map((gift) => {
        const image = projectsWithImage.find(
          (project) =>
            project.guid ===
            JSON.parse(JSON.stringify(gift.metadata))?.project?.id
        )?.image;

        const _giftProject = JSON.parse(JSON.stringify(gift.metadata));

        const projectAllowDonations = giftProjects.find(
          (project) => project.guid === _giftProject?.project?.id
        )?.allowDonations;

        const _gift = {
          type: 'Feature',
          properties: {
            cluster: false,
            purpose: gift.purpose,
            quantity: gift.value,
            project: {
              guid: _giftProject?.project?.id,
              name: _giftProject?.project?.name,
              image: _giftProject?.project?.image
                ? _giftProject?.project?.image
                : image,
              country: _giftProject?.project?.country,
              allowDonations: projectAllowDonations,
              tpo: {
                name: _giftProject?.project?.organization?.name,
              },
            },
            created: gift.created,
            totalContributions: 1,
            _type: 'gift',
          },
          geometry: {
            type: 'Point',
            coordinates: gift?.metadata?.project?.coordinates,
          },
        };

        return _gift;
      })
      .filter(
        (gift) =>
          gift.geometry.coordinates !== null &&
          gift.geometry.coordinates !== undefined
      ) as Feature[];

    const mergedFeatures = mergeFeaturesWithSameCoordinates([
      ...contributions,
      ...gifts,
    ]);

    return mergedFeatures;
  });
