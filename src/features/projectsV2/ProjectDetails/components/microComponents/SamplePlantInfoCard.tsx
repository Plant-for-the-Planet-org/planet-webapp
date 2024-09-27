import styles from '../../styles/PlantLocationInfo.module.scss';
import { useTranslations } from 'next-intl';
import formatDate from '../../../../../utils/countryCurrency/getFormattedDate';
import { Measurements } from '../../../../common/types/plantLocation';

interface Props {
  plantDate: string | undefined;
  tag: string | undefined | null;
  scientificName: string | undefined;
  measurements: Measurements | undefined;
}

const SamplePlantInfoCard = ({
  plantDate,
  tag,
  scientificName,
  measurements,
}: Props) => {
  const t = useTranslations('ProjectDetails');
  const sampleTreeConfig = [
    {
      label: t('plantingDate'),
      data: plantDate ? formatDate(plantDate) : null,
      shouldRender: plantDate !== undefined,
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
      <div className={styles.plantingDetailsContainer}>
        {sampleTreeConfig.map((item, key) => {
          return item.shouldRender ? (
            <div key={key} className={styles.plantingDetailsSubContainer}>
              <p className={styles.label}>{item.label}</p>
              <p className={styles.data}>{item.data}</p>
            </div>
          ) : null;
        })}
      </div>
      {scientificName && (
        <div className={styles.plantingDetailsSubContainer}>
          <p className={styles.label}>{t('scientificName')}</p>
          <p className={styles.data}>{scientificName}</p>
        </div>
      )}
      {measurements && (
        <div className={styles.plantingDetailsSubContainer}>
          <p className={styles.label}>{t('measurment')}</p>
          <p className={styles.data}>
            {t('singleSpeciesMeasurment', {
              plantHeight: measurements.height,
              plantWidth: measurements.width,
            })}
          </p>
        </div>
      )}
      <div className={styles.plantingDetailsSubContainer}>
        <p className={styles.label}>{t('plot')}</p>
        <button className={styles.showWholeArea}>{t('showWholeArea')}</button>
      </div>
    </>
  );
};

export default SamplePlantInfoCard;
