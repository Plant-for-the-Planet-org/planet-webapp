import React from 'react';
import { useTranslation } from 'react-i18next';
import { putAuthenticatedRequest } from '../../../utils/apiRequests/api';
import { Controller, useForm } from 'react-hook-form';
import { UserPropsContext } from '../../common/Layout/UserPropsContext';
import MaterialTextField from '../../common/InputTypes/MaterialTextField';
import styles from './AccountHistory.module.scss';
import {
  Backdrop,
  Fade,
  InputAdornment,
  ThemeProvider,
} from '@material-ui/core';
import Modal from '@material-ui/core/Modal';
import getFormatedCurrency from '../../../utils/countryCurrency/getFormattedCurrency';
import { Autocomplete } from '@material-ui/lab';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import materialTheme from '../../../theme/themeStyles';
import { localeMapForDate } from '../../../utils/language/getLanguageName';
import { ThemeContext } from '../../../theme/themeContext';
import getCurrencySymbolByCode from '../../../utils/countryCurrency/getCurrencySymbolByCode';
import Close from '../../../../public/assets/images/icons/headerIcons/close';
import themeProperties from '../../../theme/themeProperties';
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
}: // onClose
any) => {
  const [centAmount, setcentAmount] = React.useState();
  const [frequency, setFrequency] = React.useState(record?.frequency);
  const { theme } = React.useContext(ThemeContext);
  const [userLang, setUserLang] = React.useState('en');
  const { t, i18n } = useTranslation(['me']);
  const { register, handleSubmit, errors, setValue, control } = useForm({
    mode: 'all',
  });
  const { token } = React.useContext(UserPropsContext);
  // const symbol = getCurrencySymbolByCode(record?.currency);
  console.log(record, 'Record');
  React.useEffect(() => {
    if (localStorage.getItem('language')) {
      const userLang = localStorage.getItem('language');
      if (userLang) setUserLang(userLang);
    }
  }, []);
  const onSubmit = (data: any) => {
    console.log(
      new Date(data.date).toISOString().split('T')[0],
      Number(data.donationAmount.slice(1)) * 100,
      frequency,
      'data'
    );
    const bodyToSend = {
      nextBilling: new Date(data.date).toISOString().split('T')[0],
      centAmount: Number(data.donationAmount) * 100,
      frequency: frequency,
    };
    putAuthenticatedRequest(
      `/app/subscriptions/${record?.id}?scope=modify`,
      bodyToSend,
      token
    )
      .then((res) => {
        console.log(res, 'Response');
        handleEditModalClose();
      })
      .catch((err) => console.log(err));
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
        <div className={styles.manageDonationModal}>
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
            {/* <div className={styles.formRowInput}>
              <MaterialTextField
                inputRef={register({ required: true })}
                label={t('project')}
                variant="outlined"
                name="project"
                defaultValue={record?.project.name}
                disabled={true}
              />
              {errors.project && (
                <span className={styles.formErrors}>
                  {t('donate:projectRequired')}
                </span>
              )}
            </div> */}
            {/* <div className={styles.formRowInput}>
            <MaterialTextField
              inputRef={register({ required: true })}
              label={t('donorName')}
              variant="outlined"
              name="donorName"
              defaultValue={record.donorName}
            />
            {errors.donorName && (
              <span className={styles.formErrors}>{t('donorNameRequired')}</span>
            )}
          </div> */}
            <div className={styles.formRow}>
              <div className={styles.formRowInput}>
                <MaterialTextField
                  inputRef={register({ required: true })}
                  label={t('donationAmount')}
                  variant="outlined"
                  name="donationAmount"
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
                {errors.donationAmount && (
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
                  renderOption={(option) => (
                    <>
                      {t(`${option.toLowerCase()}`)}
                    </>
                  )}
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
            <div className={styles.formRow}>
              {/* <div className={styles.formRowInput}>
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
                  renderOption={(option) => (
                    <>
                      {t(`${option.toLowerCase()}`)}
                    </>
                  )}
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
              </div> */}
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
                              new Date(record?.currentPeriodEnd).valueOf() +
                                1000 * 3600 * 24
                            )
                          }
                          maxDate={
                            record?.endsAt ? record.endsAt : '2100-01-01'
                          }
                        />
                      )}
                      name="date"
                      control={control}
                      defaultValue={
                        new Date(
                          new Date(record?.currentPeriodEnd).valueOf() +
                            1000 * 3600 * 24
                        )
                      }
                    />
                  </MuiPickersUtilsProvider>
                </ThemeProvider>
                {errors.date && (
                  <span className={styles.formErrors}>
                    {t('donate:dateRequired')}
                  </span>
                )}
              </div>
            </div>
          </form>
          <button
            onClick={handleSubmit(onSubmit)}
            className={styles.submitButton}
            style={{ minWidth: '20px', marginTop: '30px' }}
          >
            {t('save')}
          </button>
          {/* <button
            onClick={() => {
              handleEditModalClose();
            }}
            className={styles.cancelButton}
            style={{ minWidth: '20px', marginTop: '30px' }}
          >
            {t('cancel')}
          </button> */}
        </div>
      </Fade>
    </Modal>
  );
};
