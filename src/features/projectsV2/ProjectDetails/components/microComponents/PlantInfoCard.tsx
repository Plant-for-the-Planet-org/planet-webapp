import type {
  Measurements,
  SamplePlantLocation,
} from '../../../../common/types/plantLocation';
import type { SetState } from '../../../../common/types/common';

import styles from '../../styles/PlantLocationInfo.module.scss';
import { useTranslations } from 'next-intl';
import formatDate from '../../../../../utils/countryCurrency/getFormattedDate';

interface Props {
  interventionStartDate: string | null | undefined;
  tag: string | undefined | null;
  scientificName: string | undefined | null;
  measurements: Measurements | undefined;
  type: 'single-tree-registration' | 'sample-tree-registration' | undefined;
  setSelectedSamplePlantLocation: SetState<SamplePlantLocation | null>;
}

const PlantInfoCard = ({
  interventionStartDate,
  tag,
  scientificName,
  measurements,
  type,
  setSelectedSamplePlantLocation,
}: Props) => {
  const tProjectDetails = useTranslations('ProjectDetails');
  const sampleTreeConfig = [
    {
      label: tProjectDetails('plantingDate'),
      data: interventionStartDate ? formatDate(interventionStartDate) : null,
      shouldRender: interventionStartDate !== undefined,
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
        <div className={`planting-details-item ${styles.plantingDetailsItem}`}>
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
            onClick={() => setSelectedSamplePlantLocation(null)}
          >
            {tProjectDetails('showWholeArea')}
          </button>
        </div>
      )}
    </div>
  );
};

export default PlantInfoCard;
