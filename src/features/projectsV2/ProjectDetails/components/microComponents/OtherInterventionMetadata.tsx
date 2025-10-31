import { clsx } from 'clsx';
import styles from '../../styles/InterventionInfo.module.scss';

interface Props {
  metadata: { key: string; value: string }[];
}

const OtherInterventionMetadata = ({ metadata }: Props) => {
  if (metadata.length === 0) {
    return null;
  }
  return (
    <div
      className={clsx(
        'planting-details-group',
        styles.interventionMetadataGroup
      )}
    >
      {metadata.map((item, key) => {
        return (
          <div
            key={key}
            className={clsx(
              'planting-details-item',
              styles.interventionMetaItem
            )}
          >
            <h2 className={styles.label}>{item.key}</h2>
            <p className={styles.data}>{item.value}</p>
          </div>
        );
      })}
    </div>
  );
};

export default OtherInterventionMetadata;
