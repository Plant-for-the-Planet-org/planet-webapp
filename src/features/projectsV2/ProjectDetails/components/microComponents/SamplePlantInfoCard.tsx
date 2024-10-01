import styles from '../../styles/PlantLocationInfo.module.scss';
import { useTranslations } from 'next-intl';
import formatDate from '../../../../../utils/countryCurrency/getFormattedDate';
import { Measurements } from '../../../../common/types/plantLocation';

interface Props {
  interventionStartDate: string | null;
  tag: string | undefined | null;
  scientificName: string | undefined;
  measurements: Measurements | undefined;
}

const SamplePlantInfoCard = ({
  interventionStartDate,
  tag,
  scientificName,
  measurements,
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
      <div className={styles.plantingDetailsItem}>
        <h2 className={styles.label}>{t('plot')}</h2>
        <button className={styles.showWholeArea}>{t('showWholeArea')}</button>
      </div>
    </>
  );
};

export default SamplePlantInfoCard;
