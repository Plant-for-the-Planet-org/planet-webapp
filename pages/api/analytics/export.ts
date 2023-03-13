import { NextApiRequest, NextApiResponse } from 'next';
import db from '../../../src/utils/connectDB';

export default async function handler(
  req: NextApiRequest,
  response: NextApiResponse
) {
  const { projectId, startDate, endDate } = JSON.parse(req.body);

  if (req.method === 'POST') {
    try {
      const query =
        "SELECT \
            pl.hid, \
            pl.plant_date, \
            COALESCE(ss.name, ps.other_species, pl.other_species) AS species, \
            CASE WHEN pl.type='single' THEN 1 ELSE ps.tree_count END AS tree_count, \
            pl.geometry, \
            pl.type, \
            pl.trees_allocated, \
            pl.trees_planted, \
            pl.metadata, \
            pl.description, \
            pl.plant_project_id, \
            pl.sample_tree_count, \
            pl.capture_status, \
            pl.created \
        FROM plant_location pl \
        LEFT JOIN planted_species ps ON ps.plant_location_id = pl.id \
        LEFT JOIN scientific_species ss ON ps.scientific_species_id = ss.id \
        JOIN plant_project pp ON pl.plant_project_id = pp.id \
        WHERE pp.guid=? AND pl.type IN ('multi','single') AND pl.deleted_at IS NULL AND pl.plant_date BETWEEN ? AND ? \
        LIMIT 4";

      const res = await db.query(query, [
        projectId,
        startDate,
        `${endDate} 23:59:59.999`,
      ]);

      await db.end();

      response.status(200).json({ data: res });
    } catch (err) {
      console.log(err);
    } finally {
      await db.quit();
    }
  } else {
    response.status(400).send(`${req.method} Method not supported`);
  }
}
