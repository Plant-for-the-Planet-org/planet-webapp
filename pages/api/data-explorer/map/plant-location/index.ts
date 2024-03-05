import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import db from '../../../../../src/utils/connectDB';
import { Geometry } from '@turf/turf';
import { PlantLocation } from '../../../../../src/features/common/types/dataExplorer';
import { QueryType } from '../../../../../src/features/user/TreeMapper/Analytics/constants';

const handler = nc<NextApiRequest, NextApiResponse>();

interface UncleanPlantLocations {
  geometry: string;
  guid: string;
  treeCount: number;
}

handler.post(async (req, response) => {
  const { projectId, queryType, searchQuery, species, fromDate, toDate } =
    req.body;

  try {
    let query =
      'SELECT pl.guid, pl.trees_planted as treeCount, pl.geometry, COALESCE(ss.name, ps.other_species, pl.other_species) AS name \
        FROM planted_species ps \
        INNER JOIN plant_location pl ON ps.plant_location_id = pl.id \
        LEFT JOIN scientific_species ss ON ps.scientific_species_id = ss.id \
        JOIN project pp ON pl.plant_project_id = pp.id \
        WHERE pp.guid = ?';

    const values = [projectId];

    if (queryType !== QueryType.DATE) {
      query += ' AND DATE(pl.plant_date) BETWEEN ? AND ?';
      values.push(fromDate, toDate);
    }

    if (queryType) {
      if (queryType === QueryType.DATE) {
        // Filter by date
        query += ' AND DATE(pl.plant_date) = ?';
        values.push(searchQuery);
      } else if (queryType === QueryType.HID) {
        // Filter by HID
        query += ' AND pl.hid = ?';
        values.push(searchQuery);
      }
    }

    if (species !== 'All') {
      // Filter by species name
      query +=
        ' AND (ss.name = ? OR ps.other_species = ? OR pl.other_species = ?)';
      values.push(species, species, species);
    }

    const qRes = await db.query<UncleanPlantLocations[]>(query, values);

    const plantLocations: PlantLocation[] = qRes.map((plantLocation) => ({
      type: 'Feature',
      properties: {
        guid: plantLocation.guid,
        treeCount: plantLocation.treeCount,
      },
      geometry: JSON.parse(plantLocation.geometry) as Geometry,
    }));

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
