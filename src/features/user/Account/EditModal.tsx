import React from 'react';
import { useTranslation } from 'react-i18next';
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
import Close from '../../../../public/assets/images/icons/headerIcons/close';
import { ErrorHandlingContext } from '../../common/Layout/ErrorHandlingContext';
import { MobileDatePicker as MuiDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import themeProperties from '../../../theme/themeProperties';

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

export const EditModal = ({
  editModalOpen,
  handleEditModalClose,
  record,
  fetchRecurrentDonations,
}: any) => {
  const [frequency, setFrequency] = React.useState(record?.frequency);
  const { theme } = React.useContext(ThemeContext);
  const [userLang, setUserLang] = React.useState('en');
  const [disabled, setDisabled] = React.useState(false);
  const { t, i18n } = useTranslation(['me']);
  const { register, handleSubmit, errors, control } = useForm({
    mode: 'all',
  });
  const { token, impersonatedEmail } = useUserProps();
  const { handleError } = React.useContext(ErrorHandlingContext);

  React.useEffect(() => {
    if (localStorage.getItem('language')) {
      const userLang = localStorage.getItem('language');
      if (userLang) setUserLang(userLang);
    }
  }, []);
  React.useEffect(() => {
    setDisabled(false);
  }, [editModalOpen]);

  const onSubmit = (data: any) => {
    setDisabled(true);
    const bodyToSend = {
      nextBilling:
        record.method !== 'paypal'
          ? new Date(data.currentPeriodEnd).toISOString().split('T')[0]
          : null,
      centAmount: Number(data.amount) * 100,
      frequency: frequency,
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
      putAuthenticatedRequest(
        `/app/subscriptions/${record?.id}?scope=modify`,
        bodyToSend,
        token,
        impersonatedEmail,
        handleError
      )
        .then((res) => {
          if (res?.status === 'action_required') {
            window.open(res.response.confirmationUrl, '_blank');
          }
          handleEditModalClose();
          fetchRecurrentDonations();
        })
        .catch((err) => console.log('Error editing recurring donation.'));
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
                {t('me:editDonationConfirmation')}
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
              <p>{t('me:editDonationDescription')}</p>
            </div>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.formRow}>
              <div className={styles.formRowInput}>
                <MaterialTextField
                  inputRef={register({ required: true })}
                  label={t('donationAmount')}
                  variant="outlined"
                  name="amount"
                  defaultValue={record?.amount}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        {getCurrencySymbolByCode(
                          i18n.language,
                          record?.currency,
                          record?.amount
                        )}
                      </InputAdornment>
                    ),
                  }}
                />
                {errors.amount && (
                  <span className={styles.formErrors}>
                    {t('donationAmountRequired')}
                  </span>
                )}
              </div>
              <div style={{ width: '20px' }} />
              <div className={styles.formRowInput}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={['monthly', 'yearly']}
                  defaultValue={record?.frequency}
                  onChange={(event: any, newValue: string) => {
                    if (newValue) {
                      setFrequency(newValue);
                    }
                  }}
                  getOptionLabel={(option) => t(`${option.toLowerCase()}`)}
                  renderInput={(params) => (
                    <MaterialTextField
                      {...params}
                      inputRef={register({ required: true })}
                      variant="outlined"
                      label={t('frequency')}
                      name="frequency"
                      // defaultValue={"spme"}
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
                    locale={
                      localeMapForDate[userLang]
                        ? localeMapForDate[userLang]
                        : localeMapForDate['en']
                    }
                  >
                    <Controller
                      render={(properties) => (
                        <MuiDatePicker
                          label={t('me:date')}
                          value={properties.value}
                          onChange={properties.onChange}
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
                      name="currentPeriodEnd"
                      control={control}
                      defaultValue={
                        new Date(new Date(record?.currentPeriodEnd).valueOf())
                      }
                    />
                  </LocalizationProvider>
                  {errors.currentPeriodEnd && (
                    <span className={styles.formErrors}>
                      {t('donate:dateRequired')}
                    </span>
                  )}
                </div>
              </div>
            ) : (
              []
            )}
          </form>
          <div className={styles.note}>
            <p>{record?.method === 'paypal' ? t('me:noteToWait') : []}</p>
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
