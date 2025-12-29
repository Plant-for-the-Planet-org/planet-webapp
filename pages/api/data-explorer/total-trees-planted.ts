import type { NextApiRequest, NextApiResponse } from 'next';
import type { TotalTreesPlanted } from '../../../src/features/common/types/dataExplorer';

import { query } from '../../../src/utils/connectDB';
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

  const CACHE_KEY = `${cacheKeyPrefix}_TOTAL_TREES_PLANTED__${getCachedKey(
    projectId,
    startDate,
    endDate
  )}`;

  const cacheHit = await redisClient.get(CACHE_KEY);

  if (cacheHit) {
    response.status(200).json({ data: cacheHit });
    return;
  }

  try {
    const queryText = `
			SELECT
				COALESCE(SUM(iv.trees_planted), 0)::integer AS "totalTreesPlanted"
			FROM intervention iv
			JOIN project pp ON iv.plant_project_id = pp.id
			WHERE 
				iv.deleted_at IS NULL
				AND iv.type IN ('single-tree-registration', 'multi-tree-registration')
				AND pp.guid = $1
				AND COALESCE(iv.intervention_start_date, iv.intervention_date) BETWEEN $2 AND $3`;

    // Ensure endDate includes time
    const endDateTime = new Date(endDate);
    endDateTime.setHours(23, 59, 59, 999);

    const res = await query<TotalTreesPlanted>(queryText, [
      projectId,
      startDate,
      endDateTime,
    ]);

    await redisClient.set(CACHE_KEY, JSON.stringify(res[0]), {
      ex: TWO_HOURS,
    });

    response.status(200).json({ data: res[0] });
  } catch (err) {
    console.error('Error fetching total trees planted:', err);
    response.status(500).json({ error: 'Failed to fetch total trees planted' });
  }
});

export default handler;
