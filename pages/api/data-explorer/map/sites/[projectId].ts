import { NextApiRequest, NextApiResponse } from 'next';
import db from '../../../../../src/utils/connectDB';
import nc from 'next-connect';
import {
  rateLimiter,
  speedLimiter,
} from '../../../../../src/middlewares/rate-limiter';
import {Site, UncleanSite } from '../../../../../src/features/common/types/dataExplorer';

const handler = nc<NextApiRequest, NextApiResponse>();

handler.use(rateLimiter);
handler.use(speedLimiter);

handler.get(async (req, response) => {
  const { projectId } = req.query;

  try {
    const query =
      'SELECT s.name, s.geometry FROM plant_project_site s \
        INNER JOIN project p ON s.plant_project_id = p.id \
        WHERE p.guid = ?';

    const res = await db.query<UncleanSite[]>(query, [projectId]);

    const sites: Site[] = [];

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

    response.status(200).json({ data: sites });
  } catch (err) {
    console.log(err);
  } finally {
    db.quit();
  }
});

export default handler;
