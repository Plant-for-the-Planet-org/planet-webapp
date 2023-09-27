import { NextApiRequest, NextApiResponse } from 'next';
import db from '../../../src/utils/connectDB';
import { TIME_FRAME } from '../../../src/features/user/TreeMapper/Analytics/components/TreePlanted/TimeFrameSelector';
import nc from 'next-connect';
import {
  rateLimiter,
  speedLimiter,
} from '../../../src/middlewares/rate-limiter';
import NodeCache from 'node-cache';
import { getCachedKey } from '../../../src/utils/getCachedKey';
import {
  IDailyFrame,
  IMonthlyFrame,
  IWeeklyFrame,
  IYearlyFrame,
} from '../../../src/features/common/types/dataExplorer';

const ONE_HOUR_IN_SEC = 60 * 60;
const ONE_DAY = ONE_HOUR_IN_SEC * 24;

const cache = new NodeCache({ stdTTL: ONE_DAY, checkperiod: ONE_HOUR_IN_SEC });

const handler = nc<NextApiRequest, NextApiResponse>();

handler.use(rateLimiter);
handler.use(speedLimiter);

handler.post(async (req, response) => {
  const { projectId, startDate, endDate } = req.body;
  const { timeFrame } = req.query;

  const CACHE_KEY = `TREES_PLANTED__${getCachedKey(
    projectId,
    startDate,
    endDate,
    timeFrame as string
  )}`;

  const cacheHit = cache.get(CACHE_KEY);

  if (cacheHit) {
    response.status(200).json({ data: cacheHit });
    return;
  }

  let query: string;

  switch (timeFrame) {
    case TIME_FRAME.DAYS:
      query =
        'SELECT  \
          pl.plant_date AS plantedDate, \
          SUM(pl.trees_planted) AS treesPlanted \
        FROM plant_location pl \
        JOIN project pp ON pl.plant_project_id = pp.id \
        WHERE pp.guid = ? AND pl.plant_date BETWEEN ? AND ? \
        GROUP BY pl.plant_date \
        ORDER BY pl.plant_date';
      break;

    case TIME_FRAME.WEEKS:
      query =
        'SELECT \
          DATE_SUB(pl.plant_date, INTERVAL WEEKDAY(pl.plant_date) DAY) AS weekStartDate, \
          DATE_ADD(DATE_SUB(pl.plant_date, INTERVAL WEEKDAY(pl.plant_date) DAY), INTERVAL 6 DAY) AS weekEndDate, \
          WEEK(pl.plant_date, 1) AS weekNum, \
          LEFT(MONTHNAME(pl.plant_date), 3) AS month, \
          YEAR(pl.plant_date) AS year, \
          SUM(pl.trees_planted) AS treesPlanted \
        FROM plant_location pl \
        JOIN project pp ON pl.plant_project_id = pp.id \
        WHERE pp.guid = ? AND pl.plant_date BETWEEN ? AND ? \
        GROUP BY weekNum, weekStartDate, weekEndDate, month, year \
        ORDER BY pl.plant_date';
      break;

    case TIME_FRAME.MONTHS:
      query =
        'SELECT \
          LEFT(MONTHNAME(pl.plant_date), 3) AS month, \
          YEAR(pl.plant_date) AS year, \
          SUM(pl.trees_planted) AS treesPlanted \
        FROM plant_location pl \
        JOIN project pp ON pl.plant_project_id = pp.id \
        WHERE pp.guid = ? AND pl.plant_date BETWEEN ? AND ? \
        GROUP BY month, year \
        ORDER BY pl.plant_date;';
      break;

    case TIME_FRAME.YEARS:
      query =
        'SELECT \
          YEAR(pl.plant_date) AS year, \
          SUM(pl.trees_planted) AS treesPlanted \
        FROM plant_location pl \
        JOIN project pp ON pl.plant_project_id = pp.id \
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
          JOIN project pp ON pl.plant_project_id = pp.id \
          WHERE pp.guid = ? AND pl.plant_date BETWEEN ? AND ? \
          GROUP BY year \
          ORDER BY pl.plant_date';
  }

  try {
    const res = await db.query<
      IDailyFrame[] | IWeeklyFrame[] | IMonthlyFrame[] | IYearlyFrame[]
    >(query, [projectId, startDate, `${endDate} 23:59:59.999`]);

    await db.end();

    cache.set(CACHE_KEY, res);

    response.status(200).json({ data: res });
  } catch (err) {
    console.log(err);
  } finally {
    await db.quit();
  }
});

export default handler;
