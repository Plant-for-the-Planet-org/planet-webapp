import { NextApiRequest } from 'next';
import db from '../../../src/utils/connectDB';

export default async function handler(req: NextApiRequest, response) {
  const { projectId, startDate, endDate } = req.body;

  if (req.method === 'POST') {
    try {
      const res = await db.query(
        'SELECT \
          plant_project_id, \
          DATE_SUB(plant_date, INTERVAL WEEKDAY(plant_date) DAY) AS week_start_date, \
          DATE_ADD(DATE_SUB(plant_date, INTERVAL WEEKDAY(plant_date) DAY), INTERVAL 6 DAY) AS week_end_date, \
          WEEK(plant_date) AS week_data, \
          SUM(trees_planted) AS trees_planted \
        FROM plant_location \
        WHERE plant_project_id = ? AND plant_date BETWEEN ? AND ? \
        GROUP BY plant_project_id, week_data \
        ORDER BY plant_date;',
        [projectId, startDate, endDate]
      );

      await db.end();

      response.status(200).json({ trees_planted: res });
    } catch (err) {
      console.log(err);
    } finally {
      await db.quit();
    }
  } else {
    response.status(400).send(`${req.method} Method not supported`);
  }
}
