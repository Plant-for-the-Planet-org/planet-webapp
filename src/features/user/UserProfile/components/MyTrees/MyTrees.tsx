import React, { ReactElement } from 'react';
import styles from '../../styles/MyTrees.module.scss';

interface Props {}

export default function MyTrees({}: Props): ReactElement {
  return (
    <div>
      <div className={styles.treesList}>
        <div className={styles.tree}>
          <div className={styles.dateRow}></div>
          <div className={styles.treeRow}>
            <div className={styles.infoCol}></div>
            <div className={styles.numberCol}>
              <div className={styles.treeIcon}>
                <div className={styles.number}></div>
                <div className={styles.icon}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.mapContainer}></div>
    </div>
  );
}
