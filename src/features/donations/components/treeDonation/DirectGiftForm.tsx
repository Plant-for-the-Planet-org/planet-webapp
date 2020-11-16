import React, { ReactElement } from 'react';
import { useForm } from 'react-hook-form';
import MaterialTextField from '../../../common/InputTypes/MaterialTextField';
import styles from './../../styles/TreeDonation.module.scss';
import i18next from '../../../../../i18n/server';

const { useTranslation } = i18next;
interface Props {
  setGiftDetails: Function;
  isGift: Boolean;
  giftDetails: any;
  directGift: any;
  setDirectGift: Function;
}

export default function GiftForm({
  setGiftDetails,
  giftDetails,
  isGift,
  directGift,
  setDirectGift,
}: Props): ReactElement {
  const { t } = useTranslation(['donate', 'common']);

  const { register, handleSubmit, errors } = useForm();
  const changeGiftDetails = (e: any) => {
    setGiftDetails({ ...giftDetails, [e.target.name]: e.target.value });
  };
  return (
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
  );
}
