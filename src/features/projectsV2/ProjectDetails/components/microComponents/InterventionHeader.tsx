import styles from '../../styles/PlantLocationInfo.module.scss';
import { formatHid } from '../../../../../utils/projectV2';
import { findInterventionHeader } from '../../../../../utils/constants/intervention';
import formatDate from '../../../../../utils/countryCurrency/getFormattedDate';

interface Props {
  plHid: string | undefined;
  interventionType: string | undefined;
  plantDate: string | null | undefined;
}

const InterventionHeader = ({ plHid, interventionType, plantDate }: Props) => {
  const interventionTitle = findInterventionHeader(interventionType);
  return (
    <>
      <div
        className={`plant-location-header-container ${styles.plantLocationHeaderContainer}`}
      >
        <div className={`${styles.interventionTitle}`}>{interventionTitle}</div>
        <div className={`hid ${styles.hid}`}>{formatHid(plHid)}</div>
      </div>
      <div
        className={`planting-details-item ${styles.plantingDetailsItem}`}
      >
        <h2 className={styles.label}>Intervention Date</h2>
        <p className={styles.data}>
        {plantDate ? formatDate(plantDate) : null}
        </p>
      </div></>
  );
};

export default InterventionHeader;
