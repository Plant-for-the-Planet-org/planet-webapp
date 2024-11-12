import type { PlantedSpecies } from '../../../../common/types/plantLocation';

import { useCallback } from 'react';
import styles from '../../styles/PlantLocationInfo.module.scss';
import { useLocale, useTranslations } from 'next-intl';
import { getFormattedNumber } from '../../../../../utils/getFormattedNumber';

interface Props {
  totalTreesCount: number;
  plantedSpecies: PlantedSpecies[];
}

const SpeciesPlanted = ({ totalTreesCount, plantedSpecies }: Props) => {
  const tProjectDetails = useTranslations('ProjectDetails');
  const locale = useLocale();
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
    <div className={`species-container ${styles.speciesContainer}`}>
      <h2>
        {tProjectDetails('speciesCount', {
          count: plantedSpecies.length,
        })}
      </h2>
      <div className={styles.speciesSubContainer}>
        {plantedSpecies?.map((species) => (
          <div className={styles.speciesList} key={species.id}>
            <p className={styles.speciesName}>{species.scientificName}</p>
            <div className={styles.treeMetrics}>
              <p>{getFormattedNumber(locale, species.treeCount)}</p>
              <p>{`${getPlantedTreePercentage(species.treeCount)}%`}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpeciesPlanted;
