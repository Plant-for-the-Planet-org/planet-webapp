import styles from '../../styles/PlantLocationInfo.module.scss';

interface Props {
  metaData: { value: string; key: string }[];
  type: string | undefined,
  plantDate: string | null | undefined;
}

const OtherInterventionMetaData = ({ metaData }: Props) => {
  if(metaData.length===0){
    return null
  }
  return (
    <div className={`planting-details-group ${styles.interventionMetaDataGroup}`}>
      {metaData.map((item, key) => {
        return (
          <div
            key={key}
            className={`planting-details-item ${styles.interventionMetaItem}`}
          >
            <h2 className={styles.label}>{item.key}</h2>
            <p className={styles.data}>{item.value}</p>
          </div>
        );
      })}
    </div>
  );
};

export default OtherInterventionMetaData;
