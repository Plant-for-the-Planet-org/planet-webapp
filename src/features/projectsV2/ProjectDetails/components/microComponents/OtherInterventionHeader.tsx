import formatDate from '../../../../../utils/countryCurrency/getFormattedDate';
import styles from '../../styles/PlantLocationInfo.module.scss';
import { useLocale, useTranslations } from 'next-intl';
import { AllIntervention } from '../../../../../utils/constants/intervention';

interface Props {
  plantingDensity: number | null;
  type: string | undefined,
  plantDate: string | null | undefined;
}

const OtherInterventionInfoHeader = ({ plantingDensity, plantDate, type }: Props) => {
  const tProjectDetails = useTranslations('ProjectDetails');
  const locale = useLocale();

  const findInterventionHeader = (valueKey: string | undefined) => {
    const found = AllIntervention.find(item => item.value === valueKey);
    return found ? found.label : '';
  };
  const plantingDetails = [
    {
      label: "Intervention",
      data: findInterventionHeader(type),
      shouldRender: plantingDensity !== null,
    },
    {
      label: "Intervention Date",
      data: plantDate ? formatDate(plantDate) : null,
      shouldRender: plantDate !== null,
    },
  ];
  return (
    <div className={`planting-details-group ${styles.plantingDetailsGroup}`}>
      {plantingDetails.map((item, key) => {
        if (!item.shouldRender) return;
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

export default OtherInterventionInfoHeader;
