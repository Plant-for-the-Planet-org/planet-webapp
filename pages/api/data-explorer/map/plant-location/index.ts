import type { NextApiRequest, NextApiResponse } from 'next';
import type { Point, Polygon } from 'geojson';
import type { SingleInterventionApiResponse } from '../../../../../src/features/common/types/dataExplorer';

import { query } from '../../../../../src/utils/connectDB';
import nc from 'next-connect';
import { QueryType } from '../../../../../src/features/user/TreeMapper/Analytics/constants';

const handler = nc<NextApiRequest, NextApiResponse>();

interface UncleanInterventions {
  geometry: Point | Polygon;
  guid: string;
  treeCount: number;
  name: string;
}

handler.post(async (req, response) => {
  const { projectId, queryType, searchQuery, species, fromDate, toDate } =
    req.body;

  try {
    let queryText = `
			SELECT 
				iv.guid,
				CAST(iv.trees_planted AS INTEGER) as "treeCount",
				iv.geometry,
				COALESCE(ss.name, ps.other_species, iv.other_species, 'Unknown') AS "name"
			FROM intervention iv
			LEFT JOIN planted_species ps ON iv.id = ps.intervention_id
			LEFT JOIN scientific_species ss ON COALESCE(iv.scientific_species_id, ps.scientific_species_id) = ss.id
			JOIN project pp ON iv.plant_project_id = pp.id
			WHERE 
				pp.guid = $1 AND 
				iv.deleted_at IS NULL AND 
				iv.type in ('multi-tree-registration', 'single-tree-registration')
			`;

    const values = [projectId];
    let paramIndex = 2;

    if (queryType !== QueryType.DATE) {
      queryText += ` AND DATE(iv.intervention_start_date) BETWEEN $${paramIndex} AND $${
        paramIndex + 1
      }`;
      values.push(fromDate, toDate);
      paramIndex += 2;
    }

    if (queryType) {
      if (queryType === QueryType.DATE) {
        // Filter by date
        queryText += ` AND DATE(iv.intervention_start_date) = $${paramIndex}`;
        values.push(searchQuery);
        paramIndex++;
      } else if (queryType === QueryType.HID) {
        // Filter by HID
        queryText += ` AND iv.hid = $${paramIndex}`;
        values.push(searchQuery);
        paramIndex++;
      }
    }

    if (species !== 'All') {
      // Filter by species name
      queryText += ` AND (ss.name = $${paramIndex} OR ps.other_species = $${
        paramIndex + 1
      } OR iv.other_species = $${paramIndex + 2})`;
      values.push(species, species, species);
      paramIndex += 3;
    }

    const qRes = await query<UncleanInterventions>(queryText, values);

    const plantLocations: SingleInterventionApiResponse[] = qRes.map(
      (plantLocation) => ({
        type: 'Feature',
        properties: {
          guid: plantLocation.guid,
          treeCount: plantLocation.treeCount,
        },
        geometry: plantLocation.geometry,
      })
    );

    response.setHeader(
      'Cache-Control',
      's-maxage=7200, stale-while-revalidate'
    );

    response.status(200).json({ data: plantLocations });
  } catch (err) {
    console.error('Error fetching plant location data:', err);
    response.status(500).json({ error: 'Internal Server Error' });
  }
});

export default handler;
