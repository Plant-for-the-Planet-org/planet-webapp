import React, { ReactElement } from 'react';
import styles from './../styles/DirectGift.module.scss';
import CancelIcon from '../../../../../public/assets/images/icons/CancelIcon';

interface Props {
  directGift: any;
  setShowDirectGift: Function;
}

export default function DirectGift({
  directGift,
  setShowDirectGift,
}: Props): ReactElement {
  return (
    <div className={styles.giftContainer}>
      <div className={styles.textContainer}>
        <div className={styles.giftTo}>Gift to {directGift.displayName}</div>
        <div className={styles.selectProject}>Select a project</div>
      </div>
      <div
        onClick={() => {
          directGift.show = false;
          localStorage.setItem('directGift', JSON.stringify(directGift));
          setShowDirectGift(false);
        }}
        className={styles.closeButton}
      >
        <CancelIcon color={styles.primaryFontColor} />
      </div>
    </div>
  );
}
