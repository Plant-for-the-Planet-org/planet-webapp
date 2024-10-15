import { NextApiRequest, NextApiResponse } from 'next';
import db from '../../../src/utils/connectDB';
import { TIME_FRAME } from '../../../src/features/user/TreeMapper/Analytics/components/TreePlanted/TimeFrameSelector';
import nc from 'next-connect';
import {
  rateLimiter,
  speedLimiter,
} from '../../../src/middlewares/rate-limiter';
import { getCachedKey } from '../../../src/utils/getCachedKey';
import {
  IDailyFrame,
  IMonthlyFrame,
  IWeeklyFrame,
  IYearlyFrame,
} from '../../../src/features/common/types/dataExplorer';
import redisClient from '../../../src/redis-client';

const ONE_HOUR_IN_SEC = 60 * 60;
const TWO_HOURS = ONE_HOUR_IN_SEC * 2;

const handler = nc<NextApiRequest, NextApiResponse>();

handler.use(rateLimiter);
handler.use(speedLimiter);

handler.post(async (req, response) => {
  if (!redisClient) {
    throw new Error(
      'Redis client not initialized. If this is not a Storybook environment, please ensure Redis is properly configured and connected.'
    );
  }

  const { projectId, startDate, endDate } = req.body;
  const { timeFrame } = req.query;

  const cachingKeyPrefix =
    process.env.API_ENDPOINT?.replace('https://', '').split('.')[0] ||
    'env_missing';

  const CACHE_KEY = `${cachingKeyPrefix}_TREES_PLANTED__${getCachedKey(
    projectId,
    startDate,
    endDate,
    timeFrame as string
  )}`;

  const cacheHit = await redisClient.get(CACHE_KEY);

  if (cacheHit) {
    response.status(200).json({ data: cacheHit });
    return;
  }

  let query: string;

  switch (timeFrame) {
    case TIME_FRAME.DAYS:
      query =
        'SELECT  \
          iv.intervention_start_date AS plantedDate, \
          SUM(iv.trees_planted) AS treesPlanted \
        FROM intervention iv \
        JOIN project pp ON iv.plant_project_id = pp.id \
        WHERE pp.guid = ? AND iv.intervention_start_date BETWEEN ? AND ? \
        GROUP BY iv.intervention_start_date \
        ORDER BY iv.intervention_start_date';
      break;

    case TIME_FRAME.WEEKS:
      query =
        'SELECT \
          DATE_SUB(iv.intervention_start_date, INTERVAL WEEKDAY(iv.intervention_start_date) DAY) AS weekStartDate, \
          DATE_ADD(DATE_SUB(iv.intervention_start_date, INTERVAL WEEKDAY(iv.intervention_start_date) DAY), INTERVAL 6 DAY) AS weekEndDate, \
          WEEK(iv.intervention_start_date, 1) AS weekNum, \
          LEFT(MONTHNAME(iv.intervention_start_date), 3) AS month, \
          YEAR(iv.intervention_start_date) AS year, \
          SUM(iv.trees_planted) AS treesPlanted \
        FROM intervention iv \
        JOIN project pp ON iv.plant_project_id = pp.id \
        WHERE pp.guid = ? AND iv.intervention_start_date BETWEEN ? AND ? \
        GROUP BY weekNum, weekStartDate, weekEndDate, month, year \
        ORDER BY iv.intervention_start_date';
      break;

    case TIME_FRAME.MONTHS:
      query =
        'SELECT \
          LEFT(MONTHNAME(iv.intervention_start_date), 3) AS month, \
          YEAR(iv.intervention_start_date) AS year, \
          SUM(iv.trees_planted) AS treesPlanted \
        FROM intervention iv \
        JOIN project pp ON iv.plant_project_id = pp.id \
        WHERE pp.guid = ? AND iv.intervention_start_date BETWEEN ? AND ? \
        GROUP BY month, year \
        ORDER BY iv.intervention_start_date;';
      break;

    case TIME_FRAME.YEARS:
      query =
        'SELECT \
          YEAR(iv.intervention_start_date) AS year, \
          SUM(iv.trees_planted) AS treesPlanted \
        FROM intervention iv \
        JOIN project pp ON iv.plant_project_id = pp.id \
        WHERE pp.guid = ? AND iv.intervention_start_date BETWEEN ? AND ? \
        GROUP BY year \
        ORDER BY iv.intervention_start_date';
      break;

    default:
      query =
        'SELECT \
            YEAR(iv.intervention_start_date) AS year, \
            SUM(iv.trees_planted) AS treesPlanted \
          FROM intervention iv \
          JOIN project pp ON iv.plant_project_id = pp.id \
          WHERE pp.guid = ? AND iv.intervention_start_date BETWEEN ? AND ? \
          GROUP BY year \
          ORDER BY iv.intervention_start_date';
  }

  try {
    const res = await db.query<
      IDailyFrame[] | IWeeklyFrame[] | IMonthlyFrame[] | IYearlyFrame[]
    >(query, [projectId, startDate, `${endDate} 23:59:59.999`]);

    await redisClient.set(CACHE_KEY, JSON.stringify(res), {
      ex: TWO_HOURS,
    });

    response.status(200).json({ data: res });
  } catch (err) {
    console.error('Error fetching trees planted:', err);
  } finally {
    await db.quit();
  }
});

export default handler;
