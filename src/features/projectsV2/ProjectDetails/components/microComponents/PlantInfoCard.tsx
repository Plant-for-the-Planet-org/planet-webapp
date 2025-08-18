import type {
  Measurements,
  SampleTreeRegistration,
} from '../../../../common/types/intervention';
import type { SetState } from '../../../../common/types/common';

import styles from '../../styles/InterventionInfo.module.scss';
import { useTranslations } from 'next-intl';
import formatDate from '../../../../../utils/countryCurrency/getFormattedDate';

interface Props {
  plantDate: string | null | undefined;
  tag: string | undefined | null;
  scientificName: string | undefined | null;
  measurements: Measurements | undefined;
  type: 'single-tree-registration' | 'sample-tree-registration' | undefined;
  setSelectedSampleTree: SetState<SampleTreeRegistration | null>;
}

const PlantInfoCard = ({
  plantDate,
  tag,
  scientificName,
  measurements,
  type,
  setSelectedSampleTree,
}: Props) => {
  const tProjectDetails = useTranslations('ProjectDetails');
  const sampleTreeConfig = [
    {
      label: tProjectDetails('plantingDate'),
      data: plantDate ? formatDate(plantDate) : null,
      shouldRender: plantDate !== undefined,
    },
    {
      label: tProjectDetails('treeTag'),
      data: tProjectDetails('tag', {
        number: tag,
      }),
      shouldRender: tag !== undefined || tag !== null,
    },
  ];

  return (
    <div className={`plant-info-card ${styles.plantInfoCard}`}>
      <div className={`planting-details-group ${styles.plantingDetailsGroup}`}>
        {sampleTreeConfig.map((item, key) => {
          return item.shouldRender ? (
            <div
              key={key}
              className={`planting-details-item ${styles.plantingDetailsItem}`}
            >
              <h2 className={styles.label}>{item.label}</h2>
              <p className={styles.data}>{item.data}</p>
            </div>
          ) : null;
        })}
      </div>
      {scientificName && (
        <div
          className={`planting-details-item ${styles.plantingDetailsItem} ${styles.scientificName}`}
        >
          <h2 className={styles.label}>{tProjectDetails('scientificName')}</h2>
          <p className={styles.data}>{scientificName}</p>
        </div>
      )}
      {measurements && (
        <div className={`planting-details-item ${styles.plantingDetailsItem}`}>
          <h2 className={styles.label}>{tProjectDetails('measurement')}</h2>
          <p className={styles.data}>
            {tProjectDetails('singleSpeciesMeasurement', {
              plantHeight: measurements.height,
              plantWidth: measurements.width,
            })}
          </p>
        </div>
      )}
      {type === 'sample-tree-registration' && (
        <div className={`planting-details-item ${styles.plantingDetailsItem}`}>
          <h2 className={styles.label}>{tProjectDetails('plot')}</h2>
          <button
            className={styles.showWholeArea}
            onClick={() => setSelectedSampleTree(null)}
          >
            {tProjectDetails('showWholeArea')}
          </button>
        </div>
      )}
    </div>
  );
};

export default PlantInfoCard;
