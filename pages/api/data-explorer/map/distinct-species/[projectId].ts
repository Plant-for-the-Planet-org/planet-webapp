import type { NextApiRequest, NextApiResponse } from 'next';
import type {
  DistinctSpecies,
  UncleanDistinctSpecies,
} from '../../../../../src/features/common/types/dataExplorer';

import db from '../../../../../src/utils/connectDB';
import nc from 'next-connect';
import {
  rateLimiter,
  speedLimiter,
} from '../../../../../src/middlewares/rate-limiter';
import redisClient from '../../../../../src/redis-client';
import { cacheKeyPrefix } from '../../../../../src/utils/constants/cacheKeyPrefix';

const ONE_HOUR_IN_SEC = 60 * 60;
const TWO_HOURS = ONE_HOUR_IN_SEC * 2;

const KEY = `${cacheKeyPrefix}_DISTINCT_SPECIES`;

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

  const cachedDistinctSpecies = await redisClient.get(key);

  if (cachedDistinctSpecies) {
    return response.status(200).json({ data: cachedDistinctSpecies });
  }

  let distinctSpecies: DistinctSpecies;

  try {
    const query = `
			SELECT 
        	DISTINCT COALESCE(ss.name, ps.other_species, iv.other_species, 'Unknown') AS name 
        FROM intervention iv
				LEFT JOIN planted_species ps ON iv.id = ps.intervention_id
        LEFT JOIN scientific_species ss ON COALESCE(iv.scientific_species_id, ps.scientific_species_id) = ss.id
        JOIN project pp ON iv.plant_project_id = pp.id 
        WHERE 
						pp.guid = ?
						AND iv.deleted_at IS NULL
						AND iv.type IN ('single-tree-registration', 'multi-tree-registration')
			`;

    const res = await db.query<UncleanDistinctSpecies[]>(query, [projectId]);

    distinctSpecies = res.map((species) => species.name);

    distinctSpecies.unshift('All');

    await redisClient.set(key, JSON.stringify(distinctSpecies), {
      ex: TWO_HOURS,
    });

    response.status(200).json({ data: distinctSpecies });
  } catch (err) {
    console.error(`Error fetching distinct species for ${projectId}`, err);
  } finally {
    db.quit();
  }
});

export default handler;
