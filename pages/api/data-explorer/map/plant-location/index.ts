import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import db from '../../../../../src/utils/connectDB';
import { Geometry } from '@turf/turf';

const handler = nc<NextApiRequest, NextApiResponse>();

enum QueryType {
  DATE = 'date',
  HID = 'hid',
}

interface UncleanPlantLocations {
  geometry: string;
  guid: string;
}

interface PlantLocation {
  geometry: Geometry;
  guid: string;
}

type PlantLocations = PlantLocation[];

handler.post(async (req, response) => {
  const { projectId, queryType, searchQuery, species } = req.body;

  try {
    let query =
      'SELECT pl.guid, pl.geometry, COALESCE(ss.name, ps.other_species, pl.other_species) AS name \
        FROM planted_species ps \
        INNER JOIN plant_location pl ON ps.plant_location_id = pl.id \
        LEFT JOIN scientific_species ss ON ps.scientific_species_id = ss.id \
        JOIN project pp ON pl.plant_project_id = pp.id \
        WHERE pp.guid = ?';

    const values = [projectId];

    if (queryType === QueryType.DATE) {
      // Filter by date
      query += ' AND DATE(pl.plant_date) = ?';
      values.push(searchQuery);
    } else if (queryType === QueryType.HID) {
      // Filter by HID
      query += ' AND pl.hid = ?';
      values.push(searchQuery);
    }

    if (species !== 'all') {
      // Filter by species name
      query +=
        ' AND (ss.name = ? OR ps.other_species = ? OR pl.other_species = ?)';
      values.push(species, species, species);
    }

    const qRes = await db.query<UncleanPlantLocations[]>(query, values);

    const plantLocations: PlantLocations = [];

    for (const plantLocation of qRes) {
      plantLocations.push({
        geometry: JSON.parse(plantLocation.geometry),
        guid: plantLocation.guid,
      });
    }
    await db.end();

    response.status(200).json({ data: plantLocations });
  } catch (err) {
    console.log(err);
  } finally {
    db.quit();
  }
});

export default handler;
