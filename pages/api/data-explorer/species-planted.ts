import { NextApiRequest, NextApiResponse } from 'next';
import db from '../../../src/utils/connectDB';
import nc from 'next-connect';
import { limiter, speedLimiter } from '../../../src/middlewares/rate-limiter';

const handler = nc<NextApiRequest, NextApiResponse>();

handler.use(limiter);
handler.use(speedLimiter);

handler.post(async (req, response) => {
  const { projectId, startDate, endDate } = JSON.parse(req.body);
  try {
    const query =
      'SELECT \
          ps.other_species, \
          ps.scientific_species_id, \
          ss.name, \
          SUM(ps.tree_count) AS total_tree_count \
        FROM planted_species ps \
        INNER JOIN plant_location pl ON ps.plant_location_id = pl.id \
        LEFT JOIN scientific_species ss ON ps.scientific_species_id = ss.id \
        JOIN plant_project pp ON pl.plant_project_id = pp.id \
        WHERE pp.guid = ? AND pl.plant_date BETWEEN ? AND ? \
        GROUP BY ps.scientific_species_id, ss.name, ps.other_species \
        ORDER BY total_tree_count DESC';

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
});

export default handler;
