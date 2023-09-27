import { NextApiRequest, NextApiResponse } from 'next';
import db from '../../../src/utils/connectDB';
import nc from 'next-connect';
import {
  rateLimiter,
  speedLimiter,
} from '../../../src/middlewares/rate-limiter';
import NodeCache from 'node-cache';
import { getCachedKey } from '../../../src/utils/getCachedKey';
import { TotalTreesPlanted } from '../../../src/features/common/types/dataExplorer';

const ONE_HOUR_IN_SEC = 60 * 60;
const ONE_DAY = ONE_HOUR_IN_SEC * 24;

const cache = new NodeCache({ stdTTL: ONE_DAY, checkperiod: ONE_HOUR_IN_SEC });

const handler = nc<NextApiRequest, NextApiResponse>();

handler.use(rateLimiter);
handler.use(speedLimiter);

handler.post(async (req, response) => {
  const { projectId, startDate, endDate } = req.body;

  const CACHE_KEY = `TOTAL_TREES_PLANTED__${getCachedKey(
    projectId,
    startDate,
    endDate
  )}`;

  const cacheHit = cache.get(CACHE_KEY);

  if (cacheHit) {
    response.status(200).json({ data: cacheHit });
    return;
  }

  try {
    const query =
      'SELECT \
        COALESCE(SUM(pl.trees_planted), 0) AS totalTreesPlanted \
      FROM plant_location pl \
      JOIN project pp ON pl.plant_project_id = pp.id \
      WHERE pp.guid = ? AND pl.plant_date BETWEEN ? AND ?';

    const res = await db.query<TotalTreesPlanted[]>(query, [
      projectId,
      startDate,
      `${endDate} 23:59:59.999`,
    ]);

    await db.end();

    cache.set(CACHE_KEY, res[0]);
    response.status(200).json({ data: res[0] });
  } catch (err) {
    console.log(err);
  } finally {
    await db.quit();
  }
});

export default handler;
