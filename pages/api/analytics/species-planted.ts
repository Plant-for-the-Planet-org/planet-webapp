import { NextApiRequest, NextApiResponse } from 'next';
import db from '../../../src/utils/connectDB';

export default async function handler(
  req: NextApiRequest,
  response: NextApiResponse
) {
  const { projectId, startDate, endDate } = req.body;

  if (req.method === 'POST') {
    try {
      const res = await db.query(
        'SELECT \
            pl.plant_project_id, \
            pl.plant_date, \
            ps.tree_count, \
            ps.scientific_species_id, \
            ss.name, \
            ps.other_species \
            FROM planted_species ps \
        INNER JOIN plant_location pl ON ps.plant_location_id = pl.id \
        LEFT JOIN scientific_species ss ON ps.scientific_species_id = ss.id \
        WHERE pl.plant_project_id = ? AND plant_date BETWEEN ? AND ?',
        [projectId, startDate, endDate]
      );

      await db.end();

      response.status(200).json({ species_planted: res });
    } catch (err) {
      console.log(err);
    } finally {
      await db.quit();
    }
  } else {
    response.status(400).send(`${req.method} Method not supported`);
  }
}
