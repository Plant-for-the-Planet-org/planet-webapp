import React, { ReactElement } from 'react';
import { useForm } from 'react-hook-form';
import getTranslation from '../../../../../../public/locales/getTranslations';
import MaterialTextFeild from './../../../../common/InputTypes/MaterialTextFeild';
import styles from './../../styles/TreeDonation.module.scss';

interface Props {
  setGiftDetails: Function;
  isGift: Boolean;
  giftDetails: Object;
}

export default function GiftForm({
  setGiftDetails,
  giftDetails,
  isGift,
}: Props): ReactElement {
  const t = getTranslation();
  const { register, handleSubmit, errors } = useForm();
  const changeGiftDetails = (e: any) => {
    setGiftDetails({ ...giftDetails, [e.target.name]: e.target.value });
  };
  return (
    <div className={styles.giftContainer}>
      <div className={styles.singleGiftContainer}>
        <div className={styles.singleGiftTitle}>{t.giftRecipient}</div>
        <div className={styles.formRow}>
          <div style={{ width: '100%' }}>
            <MaterialTextFeild
              name={'recipientName'}
              onChange={changeGiftDetails}
              label={t.recipientName}
              variant="outlined"
              inputRef={isGift ? register({ required: true }) : register({})}
            />
            {errors.recipientName && (
              <span className={styles.formErrors}>
                {t.recipientNameRequired}
              </span>
            )}
          </div>
        </div>
        <div className={styles.formRow}>
          <div style={{ width: '100%' }}>
            <MaterialTextFeild
              name={'email'}
              onChange={changeGiftDetails}
              label={t.email}
              variant="outlined"
              inputRef={isGift ? register({ required: true }) : register({})}
            />
            {errors.email && (
              <span className={styles.formErrors}>{t.emailRequired}</span>
            )}
          </div>
        </div>
        <div className={styles.formRow}>
          <MaterialTextFeild
            multiline
            rowsMax="4"
            label={t.giftMessage}
            variant="outlined"
            name={'giftMessage'}
            onChange={changeGiftDetails}
          />
        </div>
      </div>
    </div>
  );
}
