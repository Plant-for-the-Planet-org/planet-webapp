import React from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { putAuthenticatedRequest } from '../../../utils/apiRequests/api';
import { Controller, useForm } from 'react-hook-form';
import { useUserProps } from '../../common/Layout/UserPropsContext';
import MaterialTextField from '../../common/InputTypes/MaterialTextField';
import styles from './AccountHistory.module.scss';
import {
  CircularProgress,
  Modal,
  Fade,
  InputAdornment,
  Autocomplete,
  SxProps,
} from '@mui/material';
import { localeMapForDate } from '../../../utils/language/getLanguageName';
import { ThemeContext } from '../../../theme/themeContext';
import getCurrencySymbolByCode from '../../../utils/countryCurrency/getCurrencySymbolByCode';
import Close from '../../../../public/assets/images/icons/headerIcons/Close';
import { ErrorHandlingContext } from '../../common/Layout/ErrorHandlingContext';
import { MobileDatePicker as MuiDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import themeProperties from '../../../theme/themeProperties';
import { handleError, APIError } from '@planet-sdk/common';
import { ModifyDonations, Subscription } from '../../common/types/payments';
import { useTenant } from '../../common/Layout/TenantContext';

// interface EditDonationProps {
//   editModalOpen
//   handleEditModalClose
//   record: Object;
//   // seteditDonation: React.Dispatch<React.SetStateAction<boolean>>;
// }

const dialogSx: SxProps = {
  '& .MuiButtonBase-root.MuiPickersDay-root.Mui-selected': {
    backgroundColor: themeProperties.primaryColor,
    color: '#fff',
  },

  '& .MuiPickersDay-dayWithMargin': {
    '&:hover': {
      backgroundColor: themeProperties.primaryColor,
      color: '#fff',
    },
  },
  '.MuiDialogActions-root': {
    paddingBottom: '12px',
  },
};

interface EditModalProps {
  editModalOpen: boolean;
  handleEditModalClose: () => void;
  record: Subscription;
  fetchRecurrentDonations: (next?: boolean | undefined) => void;
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
  const { tenantConfig } = useTenant();
  const [userLang, setUserLang] = React.useState('en');
  const [disabled, setDisabled] = React.useState(false);
  const t = useTranslations('Me');
  const locale = useLocale();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    mode: 'all',
  });
  const { token, logoutUser } = useUserProps();
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

  interface BodyToSendType {
    nextBilling?: string | null;
    centAmount?: number;
    frequency?: string;
  }

  const onSubmit = async (data: FormData) => {
    setDisabled(true);
    const bodyToSend: BodyToSendType = {
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
      bodyToSend.nextBilling === null
    ) {
      delete bodyToSend.nextBilling;
    }
    if (data.frequency.toLowerCase() === record.frequency) {
      delete bodyToSend.frequency;
    }
    if (data.amount == record.amount) {
      delete bodyToSend.centAmount;
    }

    if (Object.keys(bodyToSend).length !== 0) {
      try {
        const res = await putAuthenticatedRequest<ModifyDonations>(
          tenantConfig?.id,
          `/app/subscriptions/${record?.id}?scope=modify`,
          bodyToSend,
          token,
          logoutUser
        );
        if (res?.status === 'action_required') {
          window.open(res.response.confirmationUrl, '_blank');
        }
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
                          DialogProps={{
                            sx: dialogSx,
                          }}
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
