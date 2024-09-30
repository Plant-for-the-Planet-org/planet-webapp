import { SamplePlantLocation } from '../../../../common/types/plantLocation';
import styles from '../../styles/PlantLocationInfo.module.scss';
import { useTranslations } from 'next-intl';

interface Props {
  sampleInterventions: SamplePlantLocation[];
}
const SampleTrees = ({ sampleInterventions }: Props) => {
  const tProjectDetails = useTranslations('ProjectDetails');
  return (
    <div className={styles.sampleTreesContainer}>
      <p className={styles.mainLabel}>
        {tProjectDetails('sampleTrees', {
          count: sampleInterventions.length,
        })}
      </p>
      <div className={styles.sampleSpeciesListContainer}>
        {sampleInterventions.map((sampleSpecies, index) => {
          return (
            <div
              key={sampleSpecies.id}
              className={styles.sampleSpeciesContainer}
            >
              <div className={styles.scientificNameContainer}>
                <span>{index + 1}</span>.
                <p className={styles.scientificName}>
                  {sampleSpecies.scientificName}
                </p>
              </div>
              <p className={styles.speciesMeasurement}>
                {tProjectDetails('speciesMeasurement', {
                  hid: sampleSpecies.hid,
                  plantHeight: sampleSpecies.measurements.height,
                  plantWidth: sampleSpecies.measurements.width,
                })}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SampleTrees;
