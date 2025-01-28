import type { NextApiRequest, NextApiResponse } from 'next';
import type { IExportData } from '../../../src/features/common/types/dataExplorer';

import { query } from '../../../src/utils/connectDB';
import nc from 'next-connect';
import {
  rateLimiter,
  speedLimiter,
} from '../../../src/middlewares/rate-limiter';

const handler = nc<NextApiRequest, NextApiResponse>();

handler.use(rateLimiter);
handler.use(speedLimiter);

handler.post(async (req, response) => {
  const { projectId, startDate, endDate } = req.body;
  try {
    const queryText = `
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
					pp.guid = $1 AND 
					iv.type IN ('multi-tree-registration','single-tree-registration') AND 
					iv.deleted_at IS NULL AND 
					iv.intervention_start_date BETWEEN $2 AND $3
		`;

    // Set the end date to the end of the day
    const endDateTime = new Date(endDate);
    endDateTime.setHours(23, 59, 59, 999);

    const res = await query<IExportData>(queryText, [
      projectId,
      startDate,
      endDateTime,
    ]);

    response.status(200).json({ data: res });
  } catch (err) {
    console.error('Error fetching export data:', err);
    response.status(500).json({ error: 'Failed to fetch export data' });
  }
});

export default handler;
