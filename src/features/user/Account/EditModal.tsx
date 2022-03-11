import React from 'react';
import { useTranslation } from 'react-i18next';
import { putAuthenticatedRequest } from '../../../utils/apiRequests/api';
import { Controller, useForm } from 'react-hook-form';
import { UserPropsContext } from '../../common/Layout/UserPropsContext';
import MaterialTextField from '../../common/InputTypes/MaterialTextField';
import styles from './AccountHistory.module.scss';
import {
  Backdrop,
  CircularProgress,
  Fade,
  InputAdornment,
  ThemeProvider,
} from '@material-ui/core';
import Modal from '@material-ui/core/Modal';
import { Autocomplete } from '@material-ui/lab';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import materialTheme from '../../../theme/themeStyles';
import { localeMapForDate } from '../../../utils/language/getLanguageName';
import { ThemeContext } from '../../../theme/themeContext';
import getCurrencySymbolByCode from '../../../utils/countryCurrency/getCurrencySymbolByCode';
import Close from '../../../../public/assets/images/icons/headerIcons/close';
import { ErrorHandlingContext } from '../../common/Layout/ErrorHandlingContext';

// interface EditDonationProps {
//   editModalOpen
//   handleEditModalClose
//   record: Object;
//   // seteditDonation: React.Dispatch<React.SetStateAction<boolean>>;
// }

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
  const { register, handleSubmit, errors, setValue, control, getValues } =
    useForm({
      mode: 'all',
    });
  const { token } = React.useContext(UserPropsContext);
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
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={editModalOpen}>
        <div className={styles.manageDonationModal}  style={{width:"35vw",height:"auto" ,maxWidth:'min-content',overflow:'auto'}} >
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
                  sx={{ width: 300 }}
                  defaultValue={record?.frequency}
                  onChange={(event: any, newValue: string) => {
                    if (newValue) {
                      setFrequency(newValue);
                    }
                  }}
                  getOptionLabel={(option) => t(`${option.toLowerCase()}`)}
                  renderOption={(option) => <>{t(`${option.toLowerCase()}`)}</>}
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
                  <ThemeProvider theme={materialTheme}>
                    <MuiPickersUtilsProvider
                      utils={DateFnsUtils}
                      locale={
                        localeMapForDate[userLang]
                          ? localeMapForDate[userLang]
                          : localeMapForDate['en']
                      }
                    >
                      <Controller
                        render={(properties) => (
                          <DatePicker
                            label={t('me:date')}
                            value={properties.value}
                            onChange={properties.onChange}
                            inputVariant="outlined"
                            TextFieldComponent={MaterialTextField}
                            autoOk
                            format="MMMM d, yyyy"
                            minDate={
                              new Date(
                                new Date(record?.currentPeriodEnd).valueOf()
                              )
                            }
                            maxDate={
                              record?.endsAt ? record.endsAt : '2100-01-01'
                            }
                          />
                        )}
                        name="currentPeriodEnd"
                        control={control}
                        defaultValue={
                          new Date(new Date(record?.currentPeriodEnd).valueOf())
                        }
                      />
                    </MuiPickersUtilsProvider>
                  </ThemeProvider>
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
