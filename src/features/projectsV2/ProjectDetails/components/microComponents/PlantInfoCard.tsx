import styles from '../../styles/PlantLocationInfo.module.scss';
import { useTranslations } from 'next-intl';
import formatDate from '../../../../../utils/countryCurrency/getFormattedDate';
import {
  Measurements,
  SamplePlantLocation,
} from '../../../../common/types/plantLocation';
import { SetState } from '../../../../common/types/common';

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
  const t = useTranslations('ProjectDetails');
  const sampleTreeConfig = [
    {
      label: t('plantingDate'),
      data: interventionStartDate ? formatDate(interventionStartDate) : null,
      shouldRender: interventionStartDate !== undefined,
    },
    {
      label: t('treeTag'),
      data: t('tag', {
        number: tag,
      }),
      shouldRender: tag !== undefined || tag !== null,
    },
  ];
  return (
    <>
      <div className={styles.plantingDetailsGroup}>
        {sampleTreeConfig.map((item, key) => {
          return item.shouldRender ? (
            <div key={key} className={styles.plantingDetailsItem}>
              <h2 className={styles.label}>{item.label}</h2>
              <p className={styles.data}>{item.data}</p>
            </div>
          ) : null;
        })}
      </div>
      {scientificName && (
        <div className={styles.plantingDetailsItem}>
          <h2 className={styles.label}>{t('scientificName')}</h2>
          <p className={styles.data}>{scientificName}</p>
        </div>
      )}
      {measurements && (
        <div className={styles.plantingDetailsItem}>
          <h2 className={styles.label}>{t('measurement')}</h2>
          <p className={styles.data}>
            {t('singleSpeciesMeasurement', {
              plantHeight: measurements.height,
              plantWidth: measurements.width,
            })}
          </p>
        </div>
      )}
      {type === 'sample-tree-registration' && (
        <div className={styles.plantingDetailsItem}>
          <h2 className={styles.label}>{t('plot')}</h2>
          <button
            className={styles.showWholeArea}
            onClick={() => setSelectedSamplePlantLocation(null)}
          >
            {t('showWholeArea')}
          </button>
        </div>
      )}
    </>
  );
};

export default PlantInfoCard;
