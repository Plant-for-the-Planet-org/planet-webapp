import type { APIError } from '@planet-sdk/common';
import type { Subscription } from '../../common/types/payments';

import React from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Controller, useForm } from 'react-hook-form';
import MaterialTextField from '../../common/InputTypes/MaterialTextField';
import styles from './AccountHistory.module.scss';
import {
  CircularProgress,
  Modal,
  Fade,
  InputAdornment,
  Autocomplete,
} from '@mui/material';
import { localeMapForDate } from '../../../utils/language/getLanguageName';
import { ThemeContext } from '../../../theme/themeContext';
import getCurrencySymbolByCode from '../../../utils/countryCurrency/getCurrencySymbolByCode';
import Close from '../../../../public/assets/images/icons/headerIcons/Close';
import { ErrorHandlingContext } from '../../common/Layout/ErrorHandlingContext';
import { MobileDatePicker as MuiDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { handleError } from '@planet-sdk/common';
import { useApi } from '../../../hooks/useApi';

interface EditModalProps {
  editModalOpen: boolean;
  handleEditModalClose: () => void;
  record: Subscription;
  fetchRecurrentDonations: (next?: boolean | undefined) => void;
}

interface ModifySubscriptionApiPayload {
  nextBilling?: string | null;
  centAmount?: number;
  frequency?: string;
  [key: string]: unknown;
}

type FormData = {
  amount: number;
  frequency: string;
  currentPeriodEnd: Date;
};

export const EditModal = ({
  editModalOpen,
  handleEditModalClose,
  record,
  fetchRecurrentDonations,
}: EditModalProps) => {
  const { theme } = React.useContext(ThemeContext);
  const [userLang, setUserLang] = React.useState('en');
  const [disabled, setDisabled] = React.useState(false);
  const { putApiAuthenticated } = useApi();
  const t = useTranslations('Me');
  const locale = useLocale();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    mode: 'all',
  });
  const { setErrors } = React.useContext(ErrorHandlingContext);
  React.useEffect(() => {
    if (localStorage.getItem('language')) {
      const userLang = localStorage.getItem('language');
      if (userLang) setUserLang(userLang);
    }
  }, []);
  React.useEffect(() => {
    setDisabled(false);
  }, [editModalOpen]);

  const onSubmit = async (data: FormData) => {
    setDisabled(true);
    const payload: ModifySubscriptionApiPayload = {
      nextBilling:
        record.method !== 'paypal'
          ? new Date(data.currentPeriodEnd).toISOString().split('T')[0]
          : null,
      centAmount: Number(data.amount) * 100,
      frequency: data.frequency,
    };
    if (
      new Date(data.currentPeriodEnd).toDateString() ==
        new Date(record.currentPeriodEnd).toDateString() ||
      payload.nextBilling === null
    ) {
      delete payload.nextBilling;
    }
    if (data.frequency.toLowerCase() === record.frequency) {
      delete payload.frequency;
    }
    if (data.amount == record.amount) {
      delete payload.centAmount;
    }

    if (Object.keys(payload).length !== 0) {
      try {
        await putApiAuthenticated<Subscription, ModifySubscriptionApiPayload>(
          `/app/subscriptions/${record?.id}`,
          {
            queryParams: { scope: 'modify' },
            payload,
          }
        );
        handleEditModalClose();
        fetchRecurrentDonations();
      } catch (err) {
        handleEditModalClose();
        setErrors(handleError(err as APIError));
      }
    } else {
      handleEditModalClose();
    }
  };

  return (
    <Modal
      className={'modalContainer' + ' ' + theme}
      open={editModalOpen}
      onClose={handleEditModalClose}
      closeAfterTransition
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={editModalOpen}>
        <div
          className={`${styles.manageDonationModal} ${styles.editDonationModal}`}
        >
          <div className={styles.modalTexts}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
              }}
            >
              <h4 style={{ marginRight: '64px' }}>
                {t('editDonationConfirmation')}
              </h4>
              <button
                onClick={handleEditModalClose}
                onKeyPress={handleEditModalClose}
                role="button"
                tabIndex={0}
                className={styles.headerCloseIcon}
              >
                <Close color={'#4d5153'} />
              </button>
            </div>
            <div className={styles.note}>
              <p>{t('editDonationDescription')}</p>
            </div>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.formRow}>
              <div className={styles.formRowInput}>
                <Controller
                  name="amount"
                  control={control}
                  rules={{ required: true }}
                  defaultValue={record?.amount}
                  render={({ field: { onChange, value, onBlur } }) => (
                    <MaterialTextField
                      label={t('donationAmount')}
                      variant="outlined"
                      onChange={(e) => {
                        e.target.value = e.target.value.replace(/[^0-9.]/g, '');
                        onChange(e);
                      }}
                      value={value}
                      onBlur={onBlur}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            {getCurrencySymbolByCode(
                              locale,
                              record?.currency,
                              record?.amount
                            )}
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />

                {errors.amount && (
                  <span className={styles.formErrors}>
                    {t('donationAmountRequired')}
                  </span>
                )}
              </div>
              <div style={{ width: '20px' }} />
              <div className={styles.formRowInput}>
                <Controller
                  name="frequency"
                  control={control}
                  rules={{ required: true }}
                  defaultValue={record?.frequency}
                  render={({ field: { onChange, value, onBlur } }) => (
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      options={['monthly', 'yearly']}
                      onChange={(_event, newValue) => {
                        onChange(newValue);
                      }}
                      value={value}
                      onBlur={onBlur}
                      getOptionLabel={(option) => {
                        return t(option.toLowerCase());
                      }}
                      renderInput={(params) => (
                        <MaterialTextField
                          {...params}
                          variant="outlined"
                          label={t('frequency')}
                        />
                      )}
                    />
                  )}
                />

                {errors.frequency && (
                  <span className={styles.formErrors}>
                    {t('frequencyRequired')}
                  </span>
                )}
              </div>
            </div>
            {record?.method !== 'paypal' ? (
              <div className={styles.formRow}>
                <div className={styles.formRowInput}>
                  <LocalizationProvider
                    dateAdapter={AdapterDateFns}
                    adapterLocale={
                      localeMapForDate[userLang]
                        ? localeMapForDate[userLang]
                        : localeMapForDate['en']
                    }
                  >
                    <Controller
                      name="currentPeriodEnd"
                      control={control}
                      defaultValue={
                        new Date(new Date(record?.currentPeriodEnd).valueOf())
                      }
                      render={({ field: { onChange, value } }) => (
                        <MuiDatePicker
                          label={t('date')}
                          value={value}
                          onChange={onChange}
                          renderInput={(props) => (
                            <MaterialTextField {...props} />
                          )}
                          inputFormat="MMMM d, yyyy"
                          minDate={
                            new Date(
                              new Date(record?.currentPeriodEnd).valueOf()
                            )
                          }
                          maxDate={
                            record?.endsAt
                              ? record.endsAt
                              : new Date('2100-01-01')
                          }
                        />
                      )}
                    />
                  </LocalizationProvider>
                  {errors.currentPeriodEnd && (
                    <span className={styles.formErrors}>
                      {t('dateRequired')}
                    </span>
                  )}
                </div>
              </div>
            ) : (
              []
            )}
          </form>
          <div className={styles.note}>
            <p>{record?.method === 'paypal' ? t('noteToWait') : []}</p>
          </div>
          <button
            onClick={handleSubmit(onSubmit)}
            className={styles.submitButton}
            style={{ minWidth: '20px', marginTop: '30px' }}
            disabled={disabled}
          >
            {disabled ? (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                }}
              >
                {t('editingDonation')}
                <div style={{ marginLeft: '5px' }}>
                  <CircularProgress color="inherit" size={15} />
                </div>
              </div>
            ) : (
              t('save')
            )}
          </button>
        </div>
      </Fade>
    </Modal>
  );
};
