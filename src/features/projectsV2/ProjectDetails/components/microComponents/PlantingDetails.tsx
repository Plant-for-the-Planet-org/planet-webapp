import formatDate from '../../../../../utils/countryCurrency/getFormattedDate';
import styles from '../../styles/PlantLocationInfo.module.scss';
import { useLocale, useTranslations } from 'next-intl';
import { localizedAbbreviatedNumber } from '../../../../../utils/getFormattedNumber';

interface Props {
  plantingDensity: number;
  plantDate: string | null | undefined;
}

const PlantingDetails = ({ plantingDensity, plantDate }: Props) => {
  const tProjectDetails = useTranslations('ProjectDetails');
  const locale = useLocale();
  const plantingDetails = [
    {
      label: tProjectDetails('plantingDate'),
      data: plantDate ? formatDate(plantDate) : null,
    },
    {
      label: tProjectDetails('plantingDensity'),
      data: tProjectDetails('plantingDensityUnit', {
        formattedCount: localizedAbbreviatedNumber(locale, plantingDensity, 1),
      }),
    },
  ];
  return (
    <div className={`planting-details-group ${styles.plantingDetailsGroup}`}>
      {plantingDetails.map((item, key) => {
        return (
          <div
            key={key}
            className={`planting-details-item ${styles.plantingDetailsItem}`}
          >
            <h2 className={styles.label}>{item.label}</h2>
            <p className={styles.data}>{item.data}</p>
          </div>
        );
      })}
    </div>
  );
};

export default PlantingDetails;
