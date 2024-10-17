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
    <div
      className={`sample-tree-list-container ${styles.sampleTreeListContainer}`}
    >
      {sampleInterventions.map((sampleTree, index) => {
        return (
          <div
            key={sampleTree.id}
            className={`sample-tree-container ${styles.sampleTreeContainer}`}
          >
            <button
              className={styles.scientificNameContainer}
              onClick={() => setSelectedSamplePlantLocation(sampleTree)}
            >
              <span>{index + 1}</span>.
              <p className={styles.scientificName}>
                {sampleTree.scientificName}
              </p>
            </button>
            <p className={styles.treeMeasurement}>
              {tProjectDetails('sampleTreeMeasurement', {
                hid: sampleTree.hid,
                plantHeight: sampleTree.measurements.height,
                plantWidth: sampleTree.measurements.width,
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
    <div className={`sample-trees-container ${styles.sampleTreesContainer}`}>
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
