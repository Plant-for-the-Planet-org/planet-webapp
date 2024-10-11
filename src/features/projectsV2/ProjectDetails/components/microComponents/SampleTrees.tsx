import { useTranslations } from 'next-intl';
import { SetState } from '../../../../common/types/common';
import { SamplePlantLocation } from '../../../../common/types/plantLocation';
import styles from '../../styles/PlantLocationInfo.module.scss';

interface Props {
  sampleInterventions: SamplePlantLocation[];
  setSelectedSamplePlantLocation: SetState<SamplePlantLocation | null>;
}
const SampleTreeList = ({
  sampleInterventions,
  setSelectedSamplePlantLocation,
}: Props) => {
  const tProjectDetails = useTranslations('ProjectDetails');

  return (
    <div className={styles.sampleSpeciesListContainer}>
      {sampleInterventions.map((sampleSpecies, index) => {
        return (
          <div key={sampleSpecies.id} className={styles.sampleSpeciesContainer}>
            <button
              className={styles.scientificNameContainer}
              onClick={() => setSelectedSamplePlantLocation(sampleSpecies)}
            >
              <span>{index + 1}</span>.
              <p className={styles.scientificName}>
                {sampleSpecies.scientificName}
              </p>
            </button>
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
  );
};
const SampleTrees = ({
  sampleInterventions,
  setSelectedSamplePlantLocation,
}: Props) => {
  const tProjectDetails = useTranslations('ProjectDetails');
  return (
    <div className={styles.sampleTreesContainer}>
      <h2 className={styles.mainLabel}>
        {tProjectDetails('sampleTrees', {
          count: sampleInterventions.length,
        })}
      </h2>
      <SampleTreeList
        sampleInterventions={sampleInterventions}
        setSelectedSamplePlantLocation={setSelectedSamplePlantLocation}
      />
    </div>
  );
};

export default SampleTrees;
