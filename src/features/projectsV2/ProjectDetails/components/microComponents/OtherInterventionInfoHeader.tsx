import type { INTERVENTION_TYPE } from '../../../../../utils/constants/intervention';

import styles from '../../styles/InterventionInfo.module.scss';
import { formatHid } from '../../../../../utils/projectV2';
import formatDate from '../../../../../utils/countryCurrency/getFormattedDate';
import { useTranslations } from 'next-intl';

interface Props {
  interventionUniqueId: string | undefined;
  interventionType: INTERVENTION_TYPE;
  plantDate: string | null | undefined;
}

const OtherInterventionInfoHeader = ({
  interventionUniqueId,
  interventionType,
  plantDate,
}: Props) => {
  const tProjectDetails = useTranslations('ProjectDetails');
  const tIntervention = useTranslations('ProjectDetails.intervention');

  return (
    <>
      <div
        className={`intervention-header-container ${styles.interventionHeaderContainer}`}
      >
        <div className={`${styles.interventionTitle}`}>
          {tIntervention(interventionType)}
        </div>
        <div className={`hid ${styles.hid}`}>
          {formatHid(interventionUniqueId)}
        </div>
      </div>
      <div className={`planting-details-item ${styles.plantingDetailsItem}`}>
        <h2 className={styles.label}>
          {tProjectDetails('intervention.interventionDate')}
        </h2>
        <p className={styles.data}>
          {plantDate ? formatDate(plantDate) : null}
        </p>
      </div>
    </>
  );
};

export default OtherInterventionInfoHeader;
