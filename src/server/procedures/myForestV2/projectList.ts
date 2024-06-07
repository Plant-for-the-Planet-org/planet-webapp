import { procedure } from '../../trpc';
import prisma from '../../../../prisma/client';
import {
  MyForestProject,
  ProjectQueryResult,
} from '../../../features/common/types/myForestv2';

export const projectListsProcedure = procedure.query(async () => {
  // Get the list of projects
  const projects = await prisma.$queryRaw<ProjectQueryResult[]>`
		SELECT 
			p.guid,
			p.name,
			p.slug,
			p.classification,
			COALESCE(metadata ->> '$.ecosystem', metadata ->> '$.ecosystems') as ecosystem,
			p.purpose,
			p.unit_type AS unitType,
			p.country,
			p.geometry,
			p.image,
			CASE 
				WHEN p.accept_donations = 1 AND p.prohibit_donations = 0 AND p.is_active = 1 AND p.is_published = 1 AND p.is_verified = 1 
				THEN TRUE 
				ELSE FALSE 
			END AS allowDonations,
			prof.name AS tpoName
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
      allowDonations: project.allowDonations ? true : false,
    };
    dictionary[project.guid] = newProject;
    return dictionary;
  }, {});

  return projectsDictionary;
});
