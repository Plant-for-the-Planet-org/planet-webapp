import React, { ReactElement } from 'react';
import { useForm } from 'react-hook-form';
import MaterialTextField from './../../../../common/InputTypes/MaterialTextField';
import styles from './../../styles/TreeDonation.module.scss';
import i18next from '../../../../../../i18n';

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
            {t('donate:giftRecipient')}
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
        <div className={styles.formRow}>
          <div style={{ width: '100%' }}>
            <MaterialTextField
              value={`${giftDetails.recipientName} (direct)`}
              label={t('donate:recipientName')}
              variant="outlined"
              disabled
            />
            {errors.recipientName && (
              <span className={styles.formErrors}>
                {t('donate:recipientNameRequired')}
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
