import { NextApiRequest, NextApiResponse } from 'next';
import db from '../../../src/utils/connectDB';
import nc from 'next-connect';
import {
  rateLimiter,
  speedLimiter,
} from '../../../src/middlewares/rate-limiter';
import { IExportData } from '../../../src/features/common/types/dataExplorer';

const handler = nc<NextApiRequest, NextApiResponse>();

handler.use(rateLimiter);
handler.use(speedLimiter);

handler.post(async (req, response) => {
  const { projectId, startDate, endDate } = req.body;
  try {
    const query = `
			SELECT 
          iv.hid, 
          iv.intervention_start_date, 
          COALESCE(ss.name, ps.other_species, iv.other_species, 'Unknown') AS species, 
          CASE WHEN iv.type='single-tree-registration' THEN 1 ELSE ps.tree_count END AS tree_count, 
          iv.geometry, 
          iv.type, 
          iv.trees_allocated, 
          iv.trees_planted, 
          iv.metadata, 
          iv.description, 
          iv.plant_project_id, 
          iv.sample_tree_count, 
          iv.capture_status, 
          iv.created 
				FROM intervention iv 
				LEFT JOIN planted_species ps ON ps.intervention_id = iv.id 
				LEFT JOIN scientific_species ss ON COALESCE(iv.scientific_species_id, ps.scientific_species_id) = ss.id 
				JOIN project pp ON iv.plant_project_id = pp.id 
				WHERE 
						pp.guid=? AND 
						iv.type IN ('multi-tree-registration','single-tree-registration') AND 
						iv.deleted_at IS NULL AND 
						iv.intervention_start_date BETWEEN ? AND ?
			`;

    const res = await db.query<IExportData[]>(query, [
      projectId,
      startDate,
      `${endDate} 23:59:59.999`,
    ]);

    await db.end();

    response.status(200).json({ data: res });
  } catch (err) {
    console.error('Error fetching export data:', err);
  } finally {
    await db.quit();
  }
});

export default handler;
