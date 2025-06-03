import type {
  MyForestProject,
  ProjectQueryResult,
} from '../../../features/common/types/myForest';

import { procedure } from '../../trpc';
import prisma from '../../../../prisma/client';
import { getCachedData } from '../../utils/cache';
import { cacheKeyPrefix } from '../../../utils/constants/cacheKeyPrefix';
import { TRPCError } from '@trpc/server';

export const projectListsProcedure = procedure.query(async () => {
  const fetchProjectList = async () => {
    // Get the list of projects
    const projects = await prisma.$queryRaw<ProjectQueryResult[]>`
		SELECT 
			p.guid,
			p.name,
			p.slug,
			p.classification,
			COALESCE(metadata ->> 'ecosystem', metadata ->> 'ecosystems') as ecosystem,
			p.purpose,
			p.unit_type AS "unitType",
			p.country,
			p.geometry,
			p.image,
			CASE 
				WHEN p.accept_donations IS TRUE 
					AND p.prohibit_donations IS FALSE 
					AND p.is_active IS TRUE 
					AND p.is_published IS TRUE 
					AND p.is_verified IS TRUE 
				THEN TRUE 
				ELSE FALSE 
			END AS "allowDonations",
			prof.name AS "tpoName"
		FROM
			project p
				INNER JOIN profile prof ON p.tpo_id = prof.id
		WHERE
			p.purpose IN ('trees' , 'conservation')
				AND p.deleted_at IS NULL
				AND p.verification_status NOT IN ('incomplete' , 'pending', 'processing')
		;
			`;

    // Convert projects to an object with index as guid, and value as project
    const projectsDictionary = projects.reduce<{
      [key: string]: MyForestProject;
    }>((dictionary, project) => {
      const newProject: MyForestProject = {
        ...project,
        allowDonations: Boolean(project.allowDonations),
      };
      dictionary[project.guid] = newProject;
      return dictionary;
    }, {});

    return projectsDictionary;
  };

  // Cache the project list for 15 minutes since it changes less frequently
  try {
    return await getCachedData(
      `${cacheKeyPrefix}_project-list`,
      fetchProjectList,
      15 * 60 // 15 minutes TTL
    );
  } catch (err) {
    console.error(`Error fetching project list: ${err}`);
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Error fetching project list',
    });
  }
});
