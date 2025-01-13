import styles from '../../styles/PlantLocationInfo.module.scss';
import { formatHid } from '../../../../../utils/projectV2';
import {findInterventionHeader } from '../../../../../utils/constants/intervention';

interface Props {
  plHid: string | undefined;
  interventionType: string | undefined
}

const InterventionHeader = ({
  plHid,
  interventionType
}: Props) => {
  const interventionTitle = findInterventionHeader(interventionType)
  return (
    <div
      className={`plant-location-header-container ${styles.plantLocationHeaderContainer}`}
    >
      <div className={`${styles.interventionTitle}`}>
         {interventionTitle}
      </div>
      <div className={`hid ${styles.hid}`}>{formatHid(plHid)}</div>
    </div>
  );
};

export default InterventionHeader;
