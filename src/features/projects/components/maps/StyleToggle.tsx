import React, { ReactElement } from 'react';
import { ProjectPropsContext } from '../../../common/Layout/ProjectPropsContext';
import styles from '../../styles/ProjectsMap.module.scss';

interface Props {}

export default function StyleToggle({}: Props): ReactElement {
  const { satellite, setSatellite } = React.useContext(ProjectPropsContext);
  return (
    <div className={styles.layerSwitcher}>
      <div
        onClick={() => setSatellite(false)}
        className={`${styles.layerOption} ${satellite ? '' : styles.active}`}
      >
        Map
      </div>
      <div
        onClick={() => setSatellite(true)}
        className={`${styles.layerOption} ${satellite ? styles.active : ''}`}
      >
        Satellite
      </div>
    </div>
  );
}
