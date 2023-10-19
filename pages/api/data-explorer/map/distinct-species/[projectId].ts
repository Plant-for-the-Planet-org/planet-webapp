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

const handler = nc<NextApiRequest, NextApiResponse>();

handler.use(rateLimiter);
handler.use(speedLimiter);

handler.get(async (req, response) => {
  const { projectId } = req.query;

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

    response.status(200).json({ data: disctinctSpecies });
  } catch (err) {
    console.log(err);
  } finally {
    db.quit();
  }
});

export default handler;
