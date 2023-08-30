import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { Prisma } from '@prisma/client';
import centerOfMass from '@turf/center-of-mass';
import { multiPoint } from '@turf/helpers';
import { Position } from '@turf/turf';

import { procedure } from '../../trpc';
import { Purpose } from '../../../utils/constants/myForest';
import prisma from '../../../../prisma/client';
import { ContributionsGeoJsonQueryResult } from '../../../features/common/types/myForest';

/**
 *
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

export const contributionsGeoJson = procedure
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
  SELECT COUNT(pp.guid) AS totalContribution, SUM(c.tree_count) AS treeCount, 
    SUM(c.quantity) AS quantity,  c.purpose, MIN(c.plant_date) AS startDate,
    MAX(c.plant_date) AS endDate, c.contribution_type, c.plant_date, pp.location, pp.country, 
    pp.unit_type, pp.guid, pp.name, pp.image, pp.geo_latitude AS geoLatitude, 
    pp.geo_longitude AS geoLongitude, c.geometry, tpo.name AS tpo, tpo.guid AS tpoGuid
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
          ${registerTreesClause}
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
            unitType: contribution.unit_type,
            location: contribution.location,
            tpo: {
              guid: contribution.tpoGuid,
              name: contribution.name,
            },
          },
        },
        geometry: {
          type: 'Point',
          coordinates: getCoordinates(contribution),
        },
      };
    });
  });
