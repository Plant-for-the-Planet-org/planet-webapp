import formatDate from '../../../../../utils/countryCurrency/getFormattedDate';
import styles from '../../styles/PlantLocationInfo.module.scss';

interface Props {
  plantDate: string | null | undefined;
}

const OtherInterventionInfoHeader = ({ plantDate }: Props) => {
  return (
    <div className={`intervention-header ${styles.otherInterventionGroup}`}>
      <div
        className={`intervention-item ${styles.otherInterventionDetailsItem}`}
      >
        <h2 className={styles.label}>Intervention Date</h2>
        <p className={styles.data}>
          {plantDate ? formatDate(plantDate) : null}
        </p>
      </div>
    </div>
  );
};

export default OtherInterventionInfoHeader;
