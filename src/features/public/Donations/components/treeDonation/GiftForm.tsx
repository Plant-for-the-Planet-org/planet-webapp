import React, { ReactElement } from 'react';
import { useForm } from 'react-hook-form';
import MaterialTextField from './../../../../common/InputTypes/MaterialTextField';
import styles from './../../styles/TreeDonation.module.scss';
import i18next from '../../../../../../i18n';

const { useTranslation } = i18next;
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
  const { t } = useTranslation(['donate', 'common']);

  const { register, handleSubmit, errors } = useForm();
  const changeGiftDetails = (e: any) => {
    setGiftDetails({ ...giftDetails, [e.target.name]: e.target.value });
  };
  return (
    <div className={styles.giftContainer}>
      <div className={styles.singleGiftContainer}>
        <div className={styles.singleGiftTitle}>
          {t('donate:giftRecipient')}
        </div>
        <div className={styles.formRow}>
          <div style={{ width: '100%' }}>
            <MaterialTextField
              name={'recipientName'}
              onChange={changeGiftDetails}
              label={t('donate:recipientName')}
              variant="outlined"
              inputRef={isGift ? register({ required: true }) : register({})}
            />
            {errors.recipientName && (
              <span className={styles.formErrors}>
                {t('donate:recipientNameRequired')}
              </span>
            )}
          </div>
        </div>
        <div className={styles.formRow}>
          <div style={{ width: '100%' }}>
            <MaterialTextField
              name={'email'}
              onChange={changeGiftDetails}
              label={t('donate:email')}
              variant="outlined"
              inputRef={isGift ? register({ required: true }) : register({})}
            />
            {errors.email && (
              <span className={styles.formErrors}>
                {t('donate:emailRequired')}
              </span>
            )}
          </div>
        </div>
        <div className={styles.formRow}>
          <MaterialTextField
            multiline
            rowsMax="4"
            label={t('donate:giftMessage')}
            variant="outlined"
            name={'giftMessage'}
            onChange={changeGiftDetails}
          />
        </div>
      </div>
    </div>
  );
}
