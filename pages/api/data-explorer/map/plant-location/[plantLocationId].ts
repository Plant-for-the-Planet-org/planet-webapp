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
                        'scientificName', COALESCE(ss.name, ps.other_species, pl.other_species),
                        'treeCount', ps.tree_count
                    )
                )
                FROM planted_species ps
                INNER JOIN plant_location pl ON ps.plant_location_id = pl.id
                LEFT JOIN scientific_species ss ON ps.scientific_species_id = ss.id
                WHERE pl.guid = ?
                GROUP BY pl.id
            ),
            'totalPlantedTrees', (
              SELECT SUM(ps.tree_count)
              FROM planted_species ps
              INNER JOIN plant_location pl ON ps.plant_location_id = pl.id
              LEFT JOIN scientific_species ss ON ps.scientific_species_id = ss.id
              WHERE pl.guid = ?
              GROUP BY pl.id
          ),
            'samplePlantLocations', (
                SELECT JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'measurements', JSON_OBJECT(
                          'height', JSON_UNQUOTE(JSON_EXTRACT(spl.measurements, '$.height')),
                          'width', JSON_UNQUOTE(JSON_EXTRACT(spl.measurements, '$.width'))
                      ),
                        'tag', spl.tag,
                        'guid', spl.guid,
                        'species', (
                          SELECT ss.name 
                          FROM plant_location pl_inner 
                          JOIN scientific_species ss ON pl_inner.scientific_species_id = ss.id 
                          WHERE pl_inner.guid = spl.guid
                          LIMIT 1
                      ),
                        'geometry', JSON_OBJECT(
                          'type', JSON_UNQUOTE(JSON_EXTRACT(spl.geometry, '$.type')),
                          'coordinates', JSON_EXTRACT(spl.geometry, '$.coordinates')
                      )
                    )
                )
                FROM plant_location pl
                LEFT JOIN plant_location spl ON pl.id = spl.parent_id
                LEFT JOIN scientific_species ss ON pl.scientific_species_id = ss.id
                WHERE pl.guid = ?
                GROUP BY pl.parent_id
            ),
            'totalSamplePlantLocations', (
                SELECT COUNT(*) 
                FROM plant_location pl
                LEFT JOIN plant_location spl ON pl.id = spl.parent_id
                WHERE pl.guid = ?
                GROUP BY pl.parent_id
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
