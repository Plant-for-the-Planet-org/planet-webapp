import React, { ReactElement } from 'react';
import styles from './../../styles/TreeDonation.module.scss';
import i18next from '../../../../../i18n/';

const { useTranslation } = i18next;
interface Props {
  setGiftDetails: Function;
  isGift: Boolean;
  giftDetails: any;
  directGift: any;
  setDirectGift: Function;
}

export default function GiftForm({
  giftDetails,
  setDirectGift,
}: Props): ReactElement {
  const { t, ready } = useTranslation(['donate', 'common']);
  return ready ? (
    <div className={styles.giftContainer}>
      <div className={styles.singleGiftContainer}>
        <div className={styles.singleGiftTitleContainer}>
          <div className={styles.singleGiftTitle}>
            {t('donate:directGiftRecipient')}{' '}
            <span>{giftDetails.recipientName}</span>
          </div>
          <div
            onClick={() => {
              localStorage.removeItem('directGift');
              setDirectGift(null);
            }}
            className={styles.singleGiftRemove}
          >
            Remove
          </div>
        </div>
      </div>
    </div>
  ) : null;
}
