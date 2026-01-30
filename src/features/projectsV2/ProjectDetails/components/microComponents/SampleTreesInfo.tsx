import type { SampleTreeRegistration } from '@planet-sdk/common';

import { useTranslations } from 'next-intl';
import styles from '../../styles/InterventionInfo.module.scss';
import { clsx } from 'clsx';
import { useSingleProjectStore } from '../../../../../stores';

interface Props {
  sampleTrees: SampleTreeRegistration[];
}
const SampleTreeList = ({ sampleTrees }: Props) => {
  const setSelectedSampleTree = useSingleProjectStore(
    (state) => state.setSelectedSampleTree
  );
  const tProjectDetails = useTranslations('ProjectDetails');

  return (
    <div
      className={clsx(
        'sample-tree-list-container',
        styles.sampleTreeListContainer
      )}
    >
      {sampleTrees.map((sampleTree, index) => {
        return (
          <div
            key={sampleTree.id}
            className={clsx(
              'sample-tree-container',
              styles.sampleTreeContainer
            )}
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
const SampleTreesInfo = ({ sampleTrees }: Props) => {
  const tProjectDetails = useTranslations('ProjectDetails');
  return (
    <div
      className={clsx('sample-trees-container', styles.sampleTreesContainer)}
    >
      <h2 className={styles.mainLabel}>
        {tProjectDetails('sampleTrees', {
          count: sampleTrees.length,
        })}
      </h2>
      <SampleTreeList sampleTrees={sampleTrees} />
    </div>
  );
};

export default SampleTreesInfo;
