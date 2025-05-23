import type { NextApiRequest, NextApiResponse } from 'next';
import type {
  IDailyFrame,
  IMonthlyFrame,
  IWeeklyFrame,
  IYearlyFrame,
} from '../../../src/features/common/types/dataExplorer';

import { query } from '../../../src/utils/connectDB';
import { TIME_FRAME } from '../../../src/features/user/TreeMapper/Analytics/components/TreePlanted/TimeFrameSelector';
import nc from 'next-connect';
import {
  rateLimiter,
  speedLimiter,
} from '../../../src/middlewares/rate-limiter';
import { getCachedKey } from '../../../src/utils/getCachedKey';
import redisClient from '../../../src/redis-client';
import { cacheKeyPrefix } from '../../../src/utils/constants/cacheKeyPrefix';

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

  const CACHE_KEY = `${cacheKeyPrefix}_TREES_PLANTED__${getCachedKey(
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

  let queryText: string;

  switch (timeFrame) {
    case TIME_FRAME.DAYS:
      queryText = `
        SELECT
          iv.intervention_start_date AS "plantedDate",
          SUM(iv.trees_planted) AS "treesPlanted"
        FROM intervention iv
        JOIN project pp ON iv.plant_project_id = pp.id
        WHERE
          iv.deleted_at IS NULL AND
          iv.type IN ('single-tree-registration', 'multi-tree-registration') AND
          pp.guid = $1 AND 
          iv.intervention_start_date BETWEEN $2 AND $3
        GROUP BY iv.intervention_start_date
        ORDER BY iv.intervention_start_date
      `;
      break;

    case TIME_FRAME.WEEKS:
      queryText = `
         WITH week_ranges AS (
          SELECT
            DATE_TRUNC('week', iv.intervention_start_date)::timestamptz AS week_start,
            EXTRACT(WEEK FROM iv.intervention_start_date)::integer AS week_num,
            SUM(iv.trees_planted) AS trees
          FROM intervention iv
          JOIN project pp ON iv.plant_project_id = pp.id
          WHERE
            iv.deleted_at IS NULL AND
            iv.type IN ('single-tree-registration', 'multi-tree-registration') AND 
            pp.guid = $1 AND 
            iv.intervention_start_date BETWEEN $2 AND $3
          GROUP BY 
            week_start,
            week_num
        )
        SELECT
          week_start AS "weekStartDate",
          (week_start + INTERVAL '6 days')::timestamptz AS "weekEndDate",
          week_num AS "weekNum",
          TO_CHAR(week_start, 'Mon') AS month,
          EXTRACT(YEAR FROM week_start)::integer AS year,
          trees::integer AS "treesPlanted"
        FROM week_ranges
        ORDER BY week_start
      `;
      break;

    case TIME_FRAME.MONTHS:
      queryText = `
        SELECT 
          TO_CHAR(iv.intervention_start_date, 'Mon') AS month,
          EXTRACT(YEAR FROM iv.intervention_start_date) AS year,
          SUM(iv.trees_planted) AS "treesPlanted"
        FROM intervention iv
        JOIN project pp ON iv.plant_project_id = pp.id 
        WHERE
          iv.deleted_at IS NULL AND
          iv.type IN ('single-tree-registration', 'multi-tree-registration') AND 
          pp.guid = $1 AND 
          iv.intervention_start_date BETWEEN $2 AND $3
        GROUP BY month, year, DATE_TRUNC('month', iv.intervention_start_date)
        ORDER BY DATE_TRUNC('month', iv.intervention_start_date)
      `;
      break;

    case TIME_FRAME.YEARS:
      queryText = `
        SELECT 
          EXTRACT(YEAR FROM iv.intervention_start_date) AS year,
          SUM(iv.trees_planted) AS "treesPlanted"
        FROM intervention iv 
        JOIN project pp ON iv.plant_project_id = pp.id 
        WHERE
          iv.deleted_at IS NULL AND
          iv.type IN ('single-tree-registration', 'multi-tree-registration') AND
          pp.guid = $1 AND 
          iv.intervention_start_date BETWEEN $2 AND $3
        GROUP BY year 
        ORDER BY year
      `;
      break;

    default:
      queryText = `
        SELECT
          EXTRACT(YEAR FROM iv.intervention_start_date) AS year,
          SUM(iv.trees_planted) AS "treesPlanted"
        FROM intervention iv
        JOIN project pp ON iv.plant_project_id = pp.id
        WHERE
          iv.deleted_at IS NULL AND
          iv.type IN ('single-tree-registration', 'multi-tree-registration') AND 
          pp.guid = $1 AND 
          iv.intervention_start_date BETWEEN $2 AND $3
        GROUP BY year
        ORDER BY year
      `;
  }

  try {
    // Ensure endDate includes time up to the last millisecond of the day
    const endDateTime = new Date(endDate);
    endDateTime.setHours(23, 59, 59, 999);

    const res = await query<
      IDailyFrame | IWeeklyFrame | IMonthlyFrame | IYearlyFrame
    >(queryText, [projectId, startDate, endDateTime]);

    await redisClient.set(CACHE_KEY, JSON.stringify(res), {
      ex: TWO_HOURS,
    });

    response.status(200).json({ data: res });
  } catch (err) {
    console.error('Error fetching trees planted:', err);
    response.status(500).json({ error: 'Failed to fetch trees planted data' });
  }
});

export default handler;
