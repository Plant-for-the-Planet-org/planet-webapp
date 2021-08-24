import React, { ReactElement } from 'react';
import { useForm } from 'react-hook-form';
import MaterialTextField from '../../../common/InputTypes/MaterialTextField';
import styles from './../../styles/Donations.module.scss';
import i18next from '../../../../../i18n';
import { InputAdornment } from '@material-ui/core';
import ToggleSwitch from '../../../common/InputTypes/ToggleSwitch';
import router from 'next/router';

const { useTranslation } = i18next;
interface Props {
  setGiftDetails: Function;
  giftDetails: Object;
  setGiftValidated: Function;
}

export default function GiftForm({
  setGiftDetails,
  giftDetails,
  setGiftValidated,
}: Props): ReactElement {
  const { t, ready } = useTranslation(['donate', 'common']);
  const [isGift, setIsGift] = React.useState<boolean>(false);

  const defaultDeails = {
    recipientName: giftDetails.recipientName,
    email: giftDetails.email,
    giftMessage: giftDetails.giftMessage,
  };

  const { register, errors, getValues, reset, handleSubmit } = useForm({
    mode: 'all',
    defaultValues: defaultDeails,
  });
  const [showEmail, setshowEmail] = React.useState(false);

  const changeGiftDetails = (e: any) => {
    const recipientName = getValues('recipientName');
    const email = getValues('email');

    setGiftDetails({ ...giftDetails, [e.target.name]: e.target.value });
  };

  React.useEffect(() => {
    if (isGift) {
      setGiftDetails({ ...giftDetails, type: 'invitation' });
    } else {
      setGiftDetails({ ...giftDetails, type: null });
    }
  }, [isGift]);

  React.useEffect(() => {
    const recipientName = getValues('recipientName');
    const email = getValues('email');
    if (errors.recipientName || errors.email || !recipientName) {
      setGiftValidated(false);
    } else if (recipientName || email) {
      setGiftValidated(true);
    }
  }, [giftDetails]);
  React.useEffect(() => {
    if (giftDetails.email == null) {
      setshowEmail(false)
    }
    else setshowEmail(true)
  }, [giftDetails.email]);

  const onSubmit = (data: any) => {
    setGiftDetails({ ...giftDetails, ...data });
  };
  const resetGiftForm = () => {
    const defaultDeails = {
      recipientName: "",
      email: "",
      giftMessage: "",
    };
    setGiftDetails(defaultDeails);
    reset(defaultDeails);
  };
  return ready ? (
    <div className={styles.giftContainer}>
      {giftDetails && giftDetails.recipientName === "" ? (
        <div>
          <div className={styles.isGiftDonation}>
            <label className={styles.isGiftDonationText} htmlFor="checkedA" >
              {t('donate:myDonationGiftToSomeone')}
            </label>
            <ToggleSwitch
              checked={isGift}
              onChange={() => setIsGift(!isGift)}
              id="checkedA"
              inputProps={{ 'aria-label': 'secondary checkbox' }}
            />
          </div>
          <div className={styles.singleGiftContainer}>
            <div className={styles.formRow}>
              <div style={{ width: '100%' }}>
                <MaterialTextField
                  name={'recipientName'}
                  onChange={changeGiftDetails}
                  label={t('donate:recipientName')}
                  variant="outlined"
                  inputRef={register({ required: true })}
                />
                {errors.recipientName && (
                  <span className={styles.formErrors}>
                    {t('donate:recipientNameRequired')}
                  </span>
                )}
              </div>
            </div> <br />
            {showEmail ? (
              <>
                <div className={styles.giftLine}>
                  <div className={styles.singleGiftTitle}>
                    {t('donate:giftRecipient')}
                  </div>
                  <button
                    onClick={() => { setshowEmail(false); giftDetails.email = null }}
                    className={styles.singleGiftRemove}
                  >
                    {t('donate:removeRecipient')}
                  </button>
                </div>
                <div className={styles.formRow}>
                  <div style={{ width: '100%' }}>
                    <MaterialTextField
                      name={'email'}
                      onChange={changeGiftDetails}
                      label={t('donate:email')}
                      variant="outlined"
                      inputRef={register({
                        pattern: /^([a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)$/i,
                      })}
                    />
                    {errors.email && (
                      <span className={styles.formErrors}>
                        {t('donate:emailRequired')}
                      </span>
                    )}
                    <div style={{ width: '100%' }}>
                      <MaterialTextField
                        multiline
                        rows="3"
                        rowsMax="4"
                        label={t('donate:giftMessage')}
                        variant="outlined"
                        name={'giftMessage'}
                        onChange={changeGiftDetails}
                      />
                    </div>
                  </div>

                </div>
              </>
            ) : (
              <div className={styles.formRow} style={{ marginTop: "-10px" }}>
                <button
                  onClick={() => setshowEmail(true)}
                  className={styles.addEmailButton}
                >
                  {t('donate:addEmail')}
                </button>
              </div>
            )}
            <button
              onClick={handleSubmit(onSubmit)}
              className="primaryButton"
            >
              {t("continue")}
            </button>
          </div>
        </div>
      ) : (
        <div className="donation-supports-info mt-10">
          <p onClick={() => resetGiftForm()}>
            {t("directGiftRecipient", {
              name: giftDetails.recipientName,
            })}
          </p>
          {router && router.query.s ? (
            <></>
          ) : (
            <button
              onClick={() => resetGiftForm()}
              className={"singleGiftRemove"}
            >
              {t("removeRecipient")}
            </button>
          )}
        </div>
      )
      }
    </div>
  ) : (
    <></>
  );
}
