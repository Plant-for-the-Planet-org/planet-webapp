import { SamplePlantLocation } from '../../../../common/types/plantLocation';
import styles from '../../styles/PlantLocationInfo.module.scss';
import { useTranslations } from 'next-intl';

interface Props {
  sampleInterventions: SamplePlantLocation[];
}
const SampleTreeList = ({ sampleInterventions }: Props) => {
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
            <div className={styles.scientificNameContainer}>
              <span>{index + 1}</span>.
              <p className={styles.scientificName}>
                {sampleTree.scientificName}
              </p>
            </div>
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
const SampleTrees = ({ sampleInterventions }: Props) => {
  const tProjectDetails = useTranslations('ProjectDetails');
  return (
    <div className={`sample-trees-container ${styles.sampleTreesContainer}`}>
      <h2 className={styles.mainLabel}>
        {tProjectDetails('sampleTrees', {
          count: sampleInterventions.length,
        })}
      </h2>
      <SampleTreeList sampleInterventions={sampleInterventions} />
    </div>
  );
};

export default SampleTrees;
