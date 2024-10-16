import { NextApiRequest, NextApiResponse } from 'next';
import db from '../../../src/utils/connectDB';
import nc from 'next-connect';
import {
  rateLimiter,
  speedLimiter,
} from '../../../src/middlewares/rate-limiter';
import { getCachedKey } from '../../../src/utils/getCachedKey';
import { TotalSpeciesPlanted } from '../../../src/features/common/types/dataExplorer';
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

  const cachingKeyPrefix =
    process.env.API_ENDPOINT?.replace('https://', '').split('.')[0] ||
    'env_missing';

  const CACHE_KEY = `${cachingKeyPrefix}_TOTAL_SPECIES_PLANTED__${getCachedKey(
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
    const query =
      "SELECT \
            COUNT(DISTINCT COALESCE(ss.name, CASE WHEN ps.other_species='Unknown' THEN null ELSE ps.other_species END, \
            CASE WHEN iv.other_species='Unknown' THEN null ELSE iv.other_species END)) as totalSpeciesPlanted \
            FROM planted_species ps \
        INNER JOIN intervention iv ON ps.intervention_id = iv.id \
        LEFT JOIN scientific_species ss ON ps.scientific_species_id = ss.id \
        JOIN project pp ON iv.plant_project_id = pp.id \
        WHERE pp.guid = ? AND iv.intervention_start_date BETWEEN ? AND ?";

    const res = await db.query<TotalSpeciesPlanted[]>(query, [
      projectId,
      startDate,
      `${endDate} 23:59:59.999`,
    ]);

    await redisClient.set(CACHE_KEY, JSON.stringify(res[0]), {
      ex: TWO_HOURS,
    });

    response.status(200).json({ data: res[0] });
  } catch (err) {
    console.error('Error fetching total species planted:', err);
  } finally {
    await db.quit();
  }
});

export default handler;
