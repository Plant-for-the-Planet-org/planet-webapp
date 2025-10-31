import type { SetState } from '../../../../common/types/common';
import type { Measurements, SampleTreeRegistration } from '@planet-sdk/common';

import styles from '../../styles/InterventionInfo.module.scss';
import { useTranslations } from 'next-intl';
import formatDate from '../../../../../utils/countryCurrency/getFormattedDate';
import { clsx } from 'clsx';

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
      shouldRender: Boolean(plantDate),
    },
    {
      label: tProjectDetails('treeTag'),
      data: tProjectDetails('tag', {
        number: tag,
      }),
      shouldRender: Boolean(tag),
    },
  ];

  return (
    <div className={clsx('plant-info-card', styles.plantInfoCard)}>
      <div
        className={clsx('planting-details-group', styles.plantingDetailsGroup)}
      >
        {sampleTreeConfig.map((item, key) => {
          return item.shouldRender ? (
            <div
              key={key}
              className={clsx(
                'planting-details-item',
                styles.plantingDetailsItem
              )}
            >
              <h2 className={styles.label}>{item.label}</h2>
              <p className={styles.data}>{item.data}</p>
            </div>
          ) : null;
        })}
      </div>
      {scientificName && (
        <div
          className={clsx(
            'planting-details-item',
            styles.plantingDetailsItem,
            styles.scientificName
          )}
        >
          <h2 className={styles.label}>{tProjectDetails('scientificName')}</h2>
          <p className={styles.data}>{scientificName}</p>
        </div>
      )}
      {measurements && (
        <div
          className={clsx('planting-details-item', styles.plantingDetailsItem)}
        >
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
        <div
          className={clsx('planting-details-item', styles.plantingDetailsItem)}
        >
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
