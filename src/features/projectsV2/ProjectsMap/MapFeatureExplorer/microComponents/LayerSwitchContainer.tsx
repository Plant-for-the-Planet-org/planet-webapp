import type { ReactNode } from 'react';
import styles from '../MapFeatureExplorer.module.scss';

interface Props {
  label: string;
  switchComponent: ReactNode;
  showDivider: boolean;
}

const LayerSwitchContainer = ({
  label,
  switchComponent,
  showDivider,
}: Props) => {
  return (
    <>
      <div className={styles.layerSwitchContainer}>
        <div className={styles.mapLayer}>
          <p>{label}</p>
          {showDivider && <hr />}
        </div>
        <div className={styles.switchContainer}>{switchComponent}</div>
      </div>
      {showDivider && <hr />}
    </>
  );
};

export default LayerSwitchContainer;
