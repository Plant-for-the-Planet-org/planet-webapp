import { useCallback } from 'react';
import { PlantedSpecies } from '../../../../common/types/plantLocation';
import styles from '../../styles/PlantLocationInfo.module.scss';
import { useTranslations } from 'next-intl';

interface Props {
  totalTreesCount: number;
  plantedSpecies: PlantedSpecies[];
}

const SpeciesPlanted = ({ totalTreesCount, plantedSpecies }: Props) => {
  const tProjectDetails = useTranslations('ProjectDetails');
  const getPlantedTreePercentage = useCallback(
    (treeCount: number) => {
      const result = (treeCount / totalTreesCount) * 100;
      if (Number.isInteger(result)) {
        return result;
      }
      return result.toFixed(1);
    },
    [totalTreesCount]
  );
  return (
    <div className={styles.speciesContainer}>
      <p>
        {tProjectDetails('speciesCount', {
          count: plantedSpecies.length,
        })}
      </p>
      <div className={styles.speciesSubContainer}>
        {plantedSpecies?.map((species) => (
          <div className={styles.speciesList} key={species.id}>
            <p className={styles.speciesName}>{species.scientificName}</p>
            <div className={styles.treeMetrics}>
              <p>{species.treeCount}</p>
              <p>{`${getPlantedTreePercentage(species.treeCount)}%`}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpeciesPlanted;
