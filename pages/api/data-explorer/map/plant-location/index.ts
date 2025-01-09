import type { NextApiRequest, NextApiResponse } from 'next';
import type { Geometry } from '@turf/turf';
import type { SinglePlantLocationApiResponse } from '../../../../../src/features/common/types/dataExplorer';

import nc from 'next-connect';
import db from '../../../../../src/utils/connectDB';
import { QueryType } from '../../../../../src/features/user/TreeMapper/Analytics/constants';

const handler = nc<NextApiRequest, NextApiResponse>();

interface UncleanPlantLocations {
  geometry: string;
  guid: string;
  treeCount: number;
  name: string;
}

handler.post(async (req, response) => {
  const { projectId, queryType, searchQuery, species, fromDate, toDate } =
    req.body;

  try {
    let query = `
			SELECT 
					iv.guid,
					iv.trees_planted as treeCount,
					iv.geometry,
					COALESCE(ss.name, ps.other_species, iv.other_species, 'Unknown') AS name
        FROM intervention iv
        LEFT JOIN planted_species ps ON iv.id = ps.intervention_id
        LEFT JOIN scientific_species ss ON COALESCE(iv.scientific_species_id, ps.scientific_species_id) = ss.id
        JOIN project pp ON iv.plant_project_id = pp.id
        WHERE 
						pp.guid = ? AND 
						iv.deleted_at IS NULL AND 
						iv.type in ('multi-tree-registration', 'single-tree-registration')
			`;

    const values = [projectId];

    if (queryType !== QueryType.DATE) {
      query += ' AND DATE(iv.intervention_start_date) BETWEEN ? AND ?';
      values.push(fromDate, toDate);
    }

    if (queryType) {
      if (queryType === QueryType.DATE) {
        // Filter by date
        query += ' AND DATE(iv.intervention_start_date) = ?';
        values.push(searchQuery);
      } else if (queryType === QueryType.HID) {
        // Filter by HID
        query += ' AND iv.hid = ?';
        values.push(searchQuery);
      }
    }

    if (species !== 'All') {
      // Filter by species name
      query +=
        ' AND (ss.name = ? OR ps.other_species = ? OR iv.other_species = ?)';
      values.push(species, species, species);
    }

    const qRes = await db.query<UncleanPlantLocations[]>(query, values);

    const plantLocations: SinglePlantLocationApiResponse[] = qRes.map(
      (plantLocation) => ({
        type: 'Feature',
        properties: {
          guid: plantLocation.guid,
          treeCount: plantLocation.treeCount,
        },
        geometry: JSON.parse(plantLocation.geometry) as Geometry,
      })
    );

    await db.end();

    response.setHeader(
      'Cache-Control',
      's-maxage=7200, stale-while-revalidate'
    );

    response.status(200).json({ data: plantLocations });
  } catch (err) {
    console.error('Error fetching plant location data:', err);
    response.status(500).json({ error: 'Internal Server Error' });
  } finally {
    db.quit();
  }
});

export default handler;
