import React, { ReactElement } from 'react';
import MaterialTextFeild from './../../../../common/InputTypes/MaterialTextFeild';
import styles from './../../styles/TreeDonation.module.scss';

interface Props {}

export default function GiftForm({}: Props): ReactElement {
  return (
    <div className={styles.giftContainer}>
      <div className={styles.singleGiftContainer}>
        <div className={styles.singleGiftTitle}>Gift Recepient</div>
        <div className={styles.formRow}>
          <MaterialTextFeild label="First Name" variant="outlined" />
          <div style={{ width: '20px' }}></div>
          <MaterialTextFeild label="Last Name" variant="outlined" />
        </div>
        <div className={styles.formRow}>
          <MaterialTextFeild label="Email" variant="outlined" />
        </div>
        <div className={styles.formRow}>
          <MaterialTextFeild
            multiline
            rowsMax="4"
            label="Gift Message"
            variant="outlined"
          />
        </div>
      </div>
    </div>
  );
}
