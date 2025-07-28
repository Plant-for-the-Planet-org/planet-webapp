import type { NextApiRequest, NextApiResponse } from 'next';
import type {
  InterventionDetails,
  InterventionDetailsQueryRes,
} from '../../../../../src/features/common/types/dataExplorer';

import nc from 'next-connect';
import { query } from '../../../../../src/utils/connectDB';

const handler = nc<NextApiRequest, NextApiResponse>();

handler.get(async (req, response) => {
  const { plantLocationId } = req.query;

  const queryText = `
    SELECT 
			JSON_BUILD_OBJECT(
				'properties', (
					SELECT JSON_BUILD_OBJECT(
						'type', iv.type,
						'hid', iv.hid
					)
					FROM intervention iv
					WHERE iv.guid = $1
				),
				'plantedSpecies', (
					SELECT COALESCE(JSON_AGG(
						JSON_BUILD_OBJECT(
							'scientificName', COALESCE(ss.name, ps.other_species, iv.other_species),
							'treeCount', COALESCE(ps.tree_count, iv.trees_planted, 0)
						)
					), '[]'::json)
					FROM intervention iv
					LEFT JOIN planted_species ps ON iv.id = ps.intervention_id
					LEFT JOIN scientific_species ss ON COALESCE(iv.scientific_species_id, ps.scientific_species_id) = ss.id
					WHERE iv.guid = $1
					GROUP BY iv.id
				),
				'totalPlantedTrees', (
					SELECT SUM(COALESCE(ps.tree_count, iv.trees_planted, 0))
					FROM intervention iv
					LEFT JOIN planted_species ps ON iv.id = ps.intervention_id
					LEFT JOIN scientific_species ss ON COALESCE(iv.scientific_species_id, ps.scientific_species_id) = ss.id
					WHERE iv.guid = $1
					GROUP BY iv.id
				),
				'samplePlantLocations', (
					SELECT COALESCE(JSON_AGG(
						JSON_BUILD_OBJECT(
							'measurements', JSON_BUILD_OBJECT(
								'height', (siv.measurements->>'height')::text,
								'width', (siv.measurements->>'width')::text
							),
							'tag', siv.tag,
							'guid', siv.guid,
							'species', (
								SELECT ss.name 
								FROM intervention pl_inner 
								JOIN scientific_species ss ON pl_inner.scientific_species_id = ss.id 
								WHERE pl_inner.guid = siv.guid
								LIMIT 1
							),
							'geometry', JSON_BUILD_OBJECT(
								'type', (siv.geometry->>'type')::text,
								'coordinates', siv.geometry->'coordinates'
							)
						)
					), '[]'::json)
					FROM intervention iv
					INNER JOIN intervention siv ON iv.id = siv.parent_id
					LEFT JOIN scientific_species ss ON iv.scientific_species_id = ss.id
					WHERE iv.guid = $1
					GROUP BY iv.parent_id
				),
				'totalSamplePlantLocations', (
					SELECT COUNT(*) 
					FROM intervention iv
					INNER JOIN intervention siv ON iv.id = siv.parent_id
					WHERE iv.guid = $1
					GROUP BY iv.parent_id
				)
			) as result
  `;

  const res = await query<InterventionDetailsQueryRes>(queryText, [
    plantLocationId,
  ]);

  const interventionDetails: InterventionDetails = res[0]?.result || null;

  response.status(200).json({
    res: interventionDetails,
  });
});

export default handler;
