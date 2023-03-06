import { NextApiRequest, NextApiResponse } from 'next';
import db from '../../../src/utils/connectDB';
import { TIME_FRAMES } from '../../../src/features/common/Layout/AnalyticsContext';

export default async function handler(
  req: NextApiRequest,
  response: NextApiResponse
) {
  if (req.method === 'POST') {
    const { projectId, startDate, endDate } = JSON.parse(req.body);
    const { timeFrame } = req.query;

    let query: string;

    switch (timeFrame) {
      case TIME_FRAMES.DAYS:
        query =
          'SELECT  \
            pl.plant_date AS plantedDate, \
            SUM(pl.trees_planted) AS treesPlanted \
          FROM plant_location pl \
          JOIN plant_project pp ON pl.plant_project_id = pp.id \
          WHERE pp.guid = ? AND pl.plant_date BETWEEN ? AND ? \
          GROUP BY pl.plant_date \
          ORDER BY pl.plant_date';
        break;

      case TIME_FRAMES.WEEKS:
        query =
          'SELECT \
            DATE_SUB(pl.plant_date, INTERVAL WEEKDAY(pl.plant_date) DAY) AS weekStartDate, \
            DATE_ADD(DATE_SUB(pl.plant_date, INTERVAL WEEKDAY(pl.plant_date) DAY), INTERVAL 6 DAY) AS weekEndDate, \
            WEEK(pl.plant_date, 1) AS weekNum, \
            LEFT(MONTHNAME(pl.plant_date), 3) AS month, \
            YEAR(pl.plant_date) AS year, \
            SUM(pl.trees_planted) AS treesPlanted \
          FROM plant_location pl \
          JOIN plant_project pp ON pl.plant_project_id = pp.id \
          WHERE pp.guid = ? AND pl.plant_date BETWEEN ? AND ? \
          GROUP BY weekNum, weekStartDate, weekEndDate, month, year \
          ORDER BY pl.plant_date';
        break;

      case TIME_FRAMES.MONTHS:
        query =
          'SELECT \
            LEFT(MONTHNAME(pl.plant_date), 3) AS month, \
            YEAR(pl.plant_date) AS year, \
            SUM(pl.trees_planted) AS treesPlanted \
          FROM plant_location pl \
          JOIN plant_project pp ON pl.plant_project_id = pp.id \
          WHERE pp.guid = ? AND pl.plant_date BETWEEN ? AND ? \
          GROUP BY month, year \
          ORDER BY pl.plant_date;';
        break;

      case TIME_FRAMES.YEARS:
        query =
          'SELECT \
            YEAR(pl.plant_date) AS year, \
            SUM(pl.trees_planted) AS treesPlanted \
          FROM plant_location pl \
          JOIN plant_project pp ON pl.plant_project_id = pp.id \
          WHERE pp.guid = ? AND pl.plant_date BETWEEN ? AND ? \
          GROUP BY year \
          ORDER BY pl.plant_date';
        break;

      default:
        query =
          'SELECT \
              YEAR(pl.plant_date) AS year, \
              SUM(pl.trees_planted) AS treesPlanted \
            FROM plant_location pl \
            JOIN plant_project pp ON pl.plant_project_id = pp.id \
            WHERE pp.guid = ? AND pl.plant_date BETWEEN ? AND ? \
            GROUP BY year \
            ORDER BY pl.plant_date';
    }

    try {
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
