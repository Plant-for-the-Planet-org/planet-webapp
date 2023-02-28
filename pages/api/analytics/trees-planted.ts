import { NextApiRequest, NextApiResponse } from 'next';
import db from '../../../src/utils/connectDB';

export default async function handler(
  req: NextApiRequest,
  response: NextApiResponse
) {
  const { projectId, startDate, endDate } = JSON.parse(req.body);

  if (req.method === 'POST') {
    try {
      const res = await db.query(
        'SELECT \
          DATE_SUB(pl.plant_date, INTERVAL WEEKDAY(pl.plant_date) DAY) AS week_start_date, \
          DATE_ADD(DATE_SUB(pl.plant_date, INTERVAL WEEKDAY(pl.plant_date) DAY), INTERVAL 6 DAY) AS week_end_date, \
          WEEK(pl.plant_date, 1) AS week_data, \
          SUM(pl.trees_planted) AS trees_planted \
        FROM plant_location pl \
        JOIN plant_project pp ON pl.plant_project_id = pp.id \
        WHERE pp.guid = ? AND pl.plant_date BETWEEN ? AND ? \
        GROUP BY week_data \
        ORDER BY plant_date\
        ',
        [projectId, startDate, `${endDate} 23:59:59.999`]
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
