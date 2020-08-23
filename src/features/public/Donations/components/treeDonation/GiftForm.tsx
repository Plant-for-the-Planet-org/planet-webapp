import React, { ReactElement } from 'react';
import { useForm } from 'react-hook-form';
import MaterialTextFeild from './../../../../common/InputTypes/MaterialTextFeild';
import styles from './../../styles/TreeDonation.module.scss';

interface Props {
  changeGiftDetails: Function;
  isGift: Boolean;
}

export default function GiftForm({
  changeGiftDetails,
  isGift,
}: Props): ReactElement {
  const { register, handleSubmit, errors } = useForm();

  return (
    <div className={styles.giftContainer}>
      <div className={styles.singleGiftContainer}>
        <div className={styles.singleGiftTitle}>Gift Recepient</div>
        <div className={styles.formRow}>
          <div>
            <MaterialTextFeild
              name={'firstName'}
              onChange={() => changeGiftDetails()}
              label="First Name"
              variant="outlined"
              inputRef={isGift ? register({ required: true }) : register({})}
            />
            {errors.firstName && (
              <span className={styles.formErrors}>
                First Name field is required
              </span>
            )}
          </div>

          <div style={{ width: '20px' }}></div>
          <div>
            <MaterialTextFeild
              name={'lastName'}
              onChange={() => changeGiftDetails()}
              label="Last Name"
              variant="outlined"
              inputRef={isGift ? register({ required: true }) : register({})}
            />
            {errors.lastName && (
              <span className={styles.formErrors}>
                Last Name field is required
              </span>
            )}
          </div>
        </div>
        <div className={styles.formRow}>
          <div style={{ width: '100%' }}>
            <MaterialTextFeild
              name={'email'}
              onChange={() => changeGiftDetails()}
              label="Email"
              variant="outlined"
              inputRef={isGift ? register({ required: true }) : register({})}
            />
            {errors.email && (
              <span className={styles.formErrors}>Email field is required</span>
            )}
          </div>
        </div>
        <div className={styles.formRow}>
          <MaterialTextFeild
            multiline
            rowsMax="4"
            label="Gift Message"
            variant="outlined"
            name={'giftMessage'}
            onChange={() => changeGiftDetails()}
          />
        </div>
      </div>
    </div>
  );
}
