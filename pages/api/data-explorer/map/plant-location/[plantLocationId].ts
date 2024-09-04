import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import db from '../../../../../src/utils/connectDB';
import {
  PlantLocationDetails,
  PlantLocationDetailsQueryRes,
} from '../../../../../src/features/common/types/dataExplorer';

const handler = nc<NextApiRequest, NextApiResponse>();

handler.get(async (req, response) => {
  const { plantLocationId } = req.query;

  const query = `
    SELECT
    JSON_OBJECT(
            'plantedSpecies', (
                SELECT JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'scientificName', COALESCE(ss.name, ps.other_species, iv.other_species),
                        'treeCount', ps.tree_count
                    )
                )
                FROM planted_species ps
                INNER JOIN intervention iv ON ps.intervention_id = iv.id
                LEFT JOIN scientific_species ss ON ps.scientific_species_id = ss.id
                WHERE iv.guid = ?
                GROUP BY iv.id
            ),
            'totalPlantedTrees', (
              SELECT SUM(ps.tree_count)
              FROM planted_species ps
              INNER JOIN intervention iv ON ps.intervention_id = iv.id
              LEFT JOIN scientific_species ss ON ps.scientific_species_id = ss.id
              WHERE iv.guid = ?
              GROUP BY iv.id
          ),
            'samplePlantLocations', (
                SELECT JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'measurements', JSON_OBJECT(
                          'height', JSON_UNQUOTE(JSON_EXTRACT(siv.measurements, '$.height')),
                          'width', JSON_UNQUOTE(JSON_EXTRACT(siv.measurements, '$.width'))
                      ),
                        'tag', siv.tag,
                        'guid', siv.guid,
                        'species', (
                          SELECT ss.name 
                          FROM intervention pl_inner 
                          JOIN scientific_species ss ON pl_inner.scientific_species_id = ss.id 
                          WHERE pl_inner.guid = siv.guid
                          LIMIT 1
                      ),
                        'geometry', JSON_OBJECT(
                          'type', JSON_UNQUOTE(JSON_EXTRACT(siv.geometry, '$.type')),
                          'coordinates', JSON_EXTRACT(siv.geometry, '$.coordinates')
                      )
                    )
                )
                FROM intervention iv
                LEFT JOIN intervention siv ON iv.id = siv.parent_id
                LEFT JOIN scientific_species ss ON iv.scientific_species_id = ss.id
                WHERE iv.guid = ?
                GROUP BY iv.parent_id
            ),
            'totalSamplePlantLocations', (
                SELECT COUNT(*) 
                FROM intervention iv
                LEFT JOIN intervention siv ON iv.id = siv.parent_id
                WHERE iv.guid = ?
                GROUP BY iv.parent_id
            )
        )
     AS result;
 `;

  const res = await db.query<PlantLocationDetailsQueryRes[]>(query, [
    plantLocationId,
    plantLocationId,
    plantLocationId,
    plantLocationId,
  ]);

  const plantLocationDetails: PlantLocationDetails = JSON.parse(res[0].result);

  response.status(200).json({
    res: plantLocationDetails,
  });
});

export default handler;
