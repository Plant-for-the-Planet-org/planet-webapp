import type { SetState } from '../../../../common/types/common';
import type { SampleTreeRegistration } from '@planet-sdk/common';

import { useTranslations } from 'next-intl';
import styles from '../../styles/InterventionInfo.module.scss';

interface Props {
  sampleTrees: SampleTreeRegistration[];
  setSelectedSampleTree: SetState<SampleTreeRegistration | null>;
}
const SampleTreeList = ({ sampleTrees, setSelectedSampleTree }: Props) => {
  const tProjectDetails = useTranslations('ProjectDetails');

  return (
    <div
      className={`sample-tree-list-container ${styles.sampleTreeListContainer}`}
    >
      {sampleTrees.map((sampleTree, index) => {
        return (
          <div
            key={sampleTree.id}
            className={`sample-tree-container ${styles.sampleTreeContainer}`}
          >
            <button
              className={styles.scientificNameContainer}
              onClick={() => setSelectedSampleTree(sampleTree)}
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
const SampleTreesInfo = ({ sampleTrees, setSelectedSampleTree }: Props) => {
  const tProjectDetails = useTranslations('ProjectDetails');
  return (
    <div className={`sample-trees-container ${styles.sampleTreesContainer}`}>
      <h2 className={styles.mainLabel}>
        {tProjectDetails('sampleTrees', {
          count: sampleTrees.length,
        })}
      </h2>
      <SampleTreeList
        sampleTrees={sampleTrees}
        setSelectedSampleTree={setSelectedSampleTree}
      />
    </div>
  );
};

export default SampleTreesInfo;
