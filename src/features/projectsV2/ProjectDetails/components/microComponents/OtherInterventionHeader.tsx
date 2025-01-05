import formatDate from '../../../../../utils/countryCurrency/getFormattedDate';
import styles from '../../styles/PlantLocationInfo.module.scss';

interface Props {
  type: string | undefined,
  plantDate: string | null | undefined;
}

const OtherInterventionInfoHeader = ({  plantDate, type }: Props) => {

  const plantingDetails = [
    {
      label: "Intervention Date",
      data: plantDate ? formatDate(plantDate) : null,
      shouldRender: plantDate !== null,
    },
  ];
  return (
    <div className={`intervention-header ${styles.otherInterventionGroup}`}>
      {plantingDetails.map((item, key) => {
        if (!item.shouldRender) return;
        return (
          <div
            key={key}
            className={`intervention-item ${styles.otherInterventionDetailsItem}`}
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
