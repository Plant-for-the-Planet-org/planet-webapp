import { NextApiRequest, NextApiResponse } from 'next';
import db from '../../../../../src/utils/connectDB';
import nc from 'next-connect';
import {
  rateLimiter,
  speedLimiter,
} from '../../../../../src/middlewares/rate-limiter';
import {
  DistinctSpecies,
  UncleanDistinctSpecies,
} from '../../../../../src/features/common/types/dataExplorer';
import redisClient from '../../../../../src/redis-client';

const ONE_HOUR_IN_SEC = 60 * 60;
const TWO_HOURS = ONE_HOUR_IN_SEC * 2;

const KEY = 'DISTINCT_SPECIES';

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

  let disctinctSpecies: DistinctSpecies;

  try {
    const query =
      'SELECT \
        DISTINCT COALESCE(ss.name, ps.other_species, pl.other_species) AS name \
        FROM planted_species ps \
        INNER JOIN plant_location pl ON ps.plant_location_id = pl.id \
        LEFT JOIN scientific_species ss ON ps.scientific_species_id = ss.id \
        JOIN project pp ON pl.plant_project_id = pp.id \
        WHERE pp.guid = ?';

    const res = await db.query<UncleanDistinctSpecies[]>(query, [projectId]);

    disctinctSpecies = res.map((species) => species.name);

    disctinctSpecies.unshift('All');

    await redisClient.set(key, JSON.stringify(disctinctSpecies), {
      ex: TWO_HOURS,
    });

    response.status(200).json({ data: disctinctSpecies });
  } catch (err) {
    console.error(`Error fetching distinct species for ${projectId}`, err);
  } finally {
    db.quit();
  }
});

export default handler;
