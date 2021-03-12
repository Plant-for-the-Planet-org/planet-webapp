import React, { ReactElement } from 'react';
import styles from './../../styles/Donations.module.scss';
import i18next from '../../../../../i18n';

const { useTranslation } = i18next;
interface Props {
  setGiftDetails: Function;
  isGift: Boolean;
  giftDetails: any;
  directGift: any;
  setDirectGift: Function;
  setGiftValidated:Function;
}

export default function GiftForm({
  giftDetails,
  setDirectGift,
  setGiftValidated
}: Props): ReactElement {
  const { t, ready } = useTranslation(['donate', 'common']);

  React.useEffect(()=>{
    setGiftValidated(true);
  },[])
  return ready ? (
    <div className={styles.giftContainer}>
      <div className={styles.singleGiftContainer}>
        <div className={styles.singleGiftTitleContainer}>
          <div className={styles.singleGiftTitle}>
            {t('donate:directGiftRecipient')}{' '}
            <span>{giftDetails.recipientName}</span>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem('directGift');
              setDirectGift(null);
            }}
            id='singleGiftRemoveId'
            className={styles.singleGiftRemove}
          >
            {t('donate:removeRecipient')}
          </button>
        </div>
      </div>
    </div>
  ) : <></>;
}
