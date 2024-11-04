import { NextApiRequest, NextApiResponse } from 'next';
import db from '../../../../../src/utils/connectDB';
import nc from 'next-connect';
import {
  rateLimiter,
  speedLimiter,
} from '../../../../../src/middlewares/rate-limiter';
import {
  FeatureCollection,
  UncleanSite,
} from '../../../../../src/features/common/types/dataExplorer';
import redisClient from '../../../../../src/redis-client';
import { cacheKeyPrefix } from '../../../../../src/utils/constants/cacheKeyPrefix';

const ONE_HOUR_IN_SEC = 60 * 60;
const TWO_HOURS = ONE_HOUR_IN_SEC * 2;

const KEY = `${cacheKeyPrefix}_SITES`;

const handler = nc<NextApiRequest, NextApiResponse>();

handler.use(rateLimiter);
handler.use(speedLimiter);

handler.get(async (req, response) => {
  if (!redisClient) {
    throw new Error(
      'Redis client not initialized. If this is not a Storybook environment, please ensure Redis is properly configured and connected.'
    );
  }

  const { projectId } = req.query;

  const key = `${KEY}_${projectId}`;

  const cachedSites = (await redisClient.get(key)) as string;

  if (cachedSites) {
    return response.status(200).json({ data: cachedSites });
  }

  try {
    const query = `
			SELECT 
					s.name, s.geometry 
				FROM plant_project_site s
        INNER JOIN project p ON s.plant_project_id = p.id
        WHERE 
						p.guid = ?`;

    const res = await db.query<UncleanSite[]>(query, [projectId]);

    const sites: FeatureCollection['features'] = [];

    for (const site of res) {
      sites.push({
        geometry: JSON.parse(site.geometry),
        properties: {
          name: site.name,
        },
        type: 'Feature',
      });
    }

    await db.end();

    const featureCollection = {
      type: 'FeatureCollection',
      features: sites,
    };

    await redisClient.set(key, JSON.stringify(featureCollection), {
      ex: TWO_HOURS,
    });

    response.status(200).json({ data: featureCollection });
  } catch (err) {
    console.error(`Error fetching sites for ${projectId}:`, err);
  } finally {
    db.quit();
  }
});

export default handler;
