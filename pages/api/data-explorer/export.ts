import { NextApiRequest, NextApiResponse } from 'next';
import db from '../../../src/utils/connectDB';
import nc from 'next-connect';
import {
  rateLimiter,
  speedLimiter,
} from '../../../src/middlewares/rate-limiter';

const handler = nc<NextApiRequest, NextApiResponse>();

handler.use(rateLimiter);
handler.use(speedLimiter);

export interface ExportData {
  hid: string;
  plant_date: Date;
  species: string;
  tree_count: number;
  geometry: string;
  type: string;
  trees_allocated: number;
  trees_planted: number;
  metadata: string;
  description: null;
  plant_project_id: number;
  sample_tree_count: number;
  capture_status: string;
  created: Date;
}

handler.post(async (req, response) => {
  const { projectId, startDate, endDate } = req.body;
  try {
    const query =
      "SELECT \
          pl.hid, \
          pl.plant_date, \
          COALESCE(ss.name, ps.other_species, pl.other_species) AS species, \
          CASE WHEN pl.type='single' THEN 1 ELSE ps.tree_count END AS tree_count, \
          pl.geometry, \
          pl.type, \
          pl.trees_allocated, \
          pl.trees_planted, \
          pl.metadata, \
          pl.description, \
          pl.plant_project_id, \
          pl.sample_tree_count, \
          pl.capture_status, \
          pl.created \
      FROM plant_location pl \
      LEFT JOIN planted_species ps ON ps.plant_location_id = pl.id \
      LEFT JOIN scientific_species ss ON ps.scientific_species_id = ss.id \
      JOIN plant_project pp ON pl.plant_project_id = pp.id \
      WHERE pp.guid=? AND pl.type IN ('multi','single') AND pl.deleted_at IS NULL AND pl.plant_date BETWEEN ? AND ?";

    const res = await db.query<ExportData[]>(query, [
      projectId,
      startDate,
      `${endDate} 23:59:59.999`,
    ]);

    await db.end();

    response.status(200).json(res);
  } catch (err) {
    console.log(err);
  } finally {
    await db.quit();
  }
});

export default handler;
