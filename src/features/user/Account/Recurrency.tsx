import React, { ReactElement } from 'react';
import i18next from '../../../../i18n';
import BackButton from '../../../../public/assets/images/icons/BackButton';
import TransactionListLoader from '../../../../public/assets/images/icons/TransactionListLoader';
import TransactionsNotFound from '../../../../public/assets/images/icons/TransactionsNotFound';
import {
  //   BankDetails,
  Certificates,
  //   DetailsComponent,
  //   RecordHeader,
} from './components/AccountRecord';
import styles from './AccountHistory.module.scss';
import Autocomplete from '@material-ui/lab/Autocomplete';
import RecurrencyRecord, {
  BankDetails,
  ManageDonation,
  DetailsComponent,
  RecordHeader,
} from './components/RecurrencyRecord';
import MaterialTextField from '../../common/InputTypes/MaterialTextField';
import { Controller, useForm } from 'react-hook-form';
import getFormatedCurrency from '../../../utils/countryCurrency/getFormattedCurrency';
import { UserPropsContext } from '../../common/Layout/UserPropsContext';
import { putAuthenticatedRequest } from '../../../utils/apiRequests/api';
import { PauseModal } from './PauseModal';
import { ThemeProvider } from '@material-ui/styles';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { MuiPickersOverrides } from '@material-ui/pickers/typings/overrides';
import DateFnsUtils from '@date-io/date-fns';
import { localeMapForDate } from '../../../utils/language/getLanguageName';
import materialTheme from '../../../theme/themeStyles';
import { CancelModal } from './CancelModal';
import { useRouter } from 'next/router';
import { InputAdornment } from '@material-ui/core';

const { useTranslation } = i18next;

interface Props {
  //   filter: string;
  //   setFilter: Function;
  isDataLoading: boolean;
  //   accountingFilters: Object;
  recurrencies: Object;
  fetchRecurrentDonations: Function;
}

export default function Recurrency({
  //   filter,
  //   setFilter,
  isDataLoading,
  //   accountingFilters,
  recurrencies,
  fetchRecurrentDonations,
}: Props): ReactElement {
  const { t, i18n } = useTranslation(['me']);
  const [selectedRecord, setSelectedRecord] = React.useState(null);
  const [openModal, setOpenModal] = React.useState(false);
  const [editDonation, seteditDonation] = React.useState(false);
  const [pauseModalOpen, setpauseModalOpen] = React.useState(false);
  const [cancelModalOpen, setcancelModalOpen] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    fetchRecurrentDonations();
  }, [editDonation]);
  const handleRecordOpen = (index: number) => {
    if (selectedRecord === index) {
      setSelectedRecord(null);
      setOpenModal(false);
    } else {
      setSelectedRecord(index);
      setOpenModal(true);
    }
  };

  const handleClose = () => {
    setOpenModal(false);
    setSelectedRecord(null);
  };
  const handlePauseModalClose = () => {
    setpauseModalOpen(false);
  };
  const handleCancelModalClose = () => {
    setcancelModalOpen(false);
  };
  let currentRecord;
  if (recurrencies) {
    currentRecord = recurrencies[selectedRecord];
  }

  return (
    <div className="profilePage">
      {!editDonation ? (
        <>
          <div className={'profilePageTitle'}>{t('me:recurrency')}</div>
          <div className={'profilePageSubTitle'}>
            {t('me:recurrencySubTitle')}
          </div>
          <div
            className={'profilePageSubTitle'}
            style={{ display: 'flex', flexDirection: 'row' }}
          >
            <h6
              style={{
                color: 'black',
              }}
            >
              <button
                onClick={()=>router.push(`/profile/history`)}
                style={{
                  color: 'black',
                  borderWidth: '1px',
                  borderRightStyle: 'solid',
                  borderRightColor: '#68B030',
                  paddingRight:'5px'
                }}
              >
                History
              </button>
            </h6>
            <h6
              style={{
                color: '#68B030',
              }}
            >
              Recurrency
            </h6>
          </div>
          <div className={styles.pageContainer}>
            <div className={`${styles.section} ${styles.recurrencySection}`}>
              <div className={styles.recurrency}>
                <div className={styles.recurrencyList}>
                  {!recurrencies && isDataLoading ? (
                    <>
                      <TransactionListLoader />
                      <TransactionListLoader />
                      <TransactionListLoader />
                    </>
                  ) : recurrencies && recurrencies.length === 0 ? (
                    <div className={styles.notFound}>
                      <TransactionsNotFound />
                    </div>
                  ) : (
                    recurrencies &&
                    !isDataLoading &&
                    recurrencies?.map((record: any, index: number) => {
                      return (
                        <RecurrencyRecord
                          key={index}
                          handleRecordOpen={handleRecordOpen}
                          index={index}
                          selectedRecord={selectedRecord}
                          record={record}
                          recurrencies={recurrencies}
                          seteditDonation={seteditDonation}
                          setpauseDonation={setpauseModalOpen}
                          setcancelDonation={setcancelModalOpen}
                        />
                      );
                    })
                  )}
                </div>
              </div>
              {openModal && (
                <div className={styles.modalContainer}>
                  <>
                    <div
                      onClick={() => {
                        handleClose();
                      }}
                      className={styles.closeRecord}
                    >
                      <BackButton />
                    </div>
                    {currentRecord ? (
                      <>
                        <RecordHeader record={currentRecord} />
                        <div className={styles.divider}></div>
                        <div className={styles.detailContainer}>
                          <div className={styles.detailGrid}>
                            <DetailsComponent record={currentRecord} />
                          </div>
                          {currentRecord?.details?.recipientBank && (
                            <>
                              <div className={styles.title}>
                                {t('bankDetails')}
                              </div>
                              <div className={styles.detailGrid}>
                                <BankDetails record={currentRecord} />
                              </div>
                            </>
                          )}

                          <>
                            {/* <div className={styles.detailGrid}> */}
                            <ManageDonation
                              record={currentRecord}
                              seteditDonation={seteditDonation}
                              setpauseDonation={setpauseModalOpen}
                              setcancelDonation={setcancelModalOpen}
                            />
                            {/* </div> */}
                          </>
                        </div>
                      </>
                    ) : null}
                  </>
                </div>
              )}
            </div>
            <PauseModal
              pauseModalOpen={pauseModalOpen}
              handlePauseModalClose={handlePauseModalClose}
              record={currentRecord}
            />
            <CancelModal
              cancelModalOpen={cancelModalOpen}
              handleCancelModalClose={handleCancelModalClose}
              record={currentRecord}
            />
          </div>
        </>
      ) : !isDataLoading ? (
        <EditDonation
          record={currentRecord}
          seteditDonation={seteditDonation}
        />
      ) : (
        []
      )}
    </div>
  );
}

interface EditDonationProps {
  record: Object;
  seteditDonation: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditDonation = ({ record, seteditDonation }: EditDonationProps) => {
  const [nextBilling, setnextBilling] = React.useState();
  const [centAmount, setcentAmount] = React.useState();
  const [userLang, setUserLang] = React.useState('en');
  const { t, i18n } = useTranslation(['me']);
  const { register, handleSubmit, errors, setValue, control } = useForm({
    mode: 'all',
  });
  const { token } = React.useContext(UserPropsContext);

  console.log(record, 'Record', record?.frequency);
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
      data.frequency,
      'data'
    );
    const bodyToSend = {
      nextBilling: new Date(data.date).toISOString().split('T')[0],
      centAmount: Number(data.donationAmount) * 100,
      frequency: data.frequency,
    };
    putAuthenticatedRequest(
      `/app/subscriptions/${record.id}?scope=modify`,
      bodyToSend,
      token
    )
      .then((res) => {
        console.log(res, 'Response');
        seteditDonation(false);
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <div className={'profilePageTitle'}>{t('me:editDonation')}</div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.formRowInput}>
          <MaterialTextField
            inputRef={register({ required: true })}
            label={t('project')}
            variant="outlined"
            name="project"
            defaultValue={record.project.name}
            disabled={true}
          />
          {errors.project && (
            <span className={styles.formErrors}>
              {t('donate:projectRequired')}
            </span>
          )}
        </div>
        <div className={styles.formRowInput}>
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
        </div>
        <div className={styles.formRow}>
          <div className={styles.formRowInput}>
            <MaterialTextField
              inputRef={register({ required: true })}
              label={t('donationAmount')}
              variant="outlined"
              name="donationAmount"
              defaultValue={record.amount}
              InputProps={{
                startAdornment: <InputAdornment position="start">{getFormatedCurrency(
                  i18n.language,
                  record.currency,
                  record.amount
                ).slice(0,1)}</InputAdornment>,
              }}
            />
            {errors.donationAmount && (
              <span className={styles.formErrors}>
                {t('donationAmountRequired')}
              </span>
            )}
          </div>
        </div>
        <div className={styles.formRow}>
          <div className={styles.formRowInput}>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={['monthly', 'yearly']}
              sx={{ width: 300 }}
              defaultValue={record.frequency}
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
          <div style={{ width: '20px' }} />
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
                      // disableFuture
                      // minDate={new Date(new Date().setFullYear(1950))}
                      format="MMMM d, yyyy"
                      minDate={record.currentPeriodEnd}
                    />
                  )}
                  name="date"
                  control={control}
                  defaultValue={record.currentPeriodEnd}
                />
              </MuiPickersUtilsProvider>
            </ThemeProvider>
            {/* <MaterialTextField
              id="date"
              label={t('date')}
              type="date"
              name="date"
              variant="outlined"
              defaultValue={record.currentPeriodEnd}
              sx={{ width: 220 }}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(data) =>
                console.log(data.target.value, '============')
              }
              mindate={new Date()}

              //   maxDate={record.currentPeriodEnd}
              //   disabled={true}
            /> */}
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
        style={{ minWidth: '20px', marginTop: '30px', marginRight: '30px' }}
      >
        {t('makeChanges')}
      </button>
      <button
        onClick={() => {
          seteditDonation(false);
          console.log('Pressed');
        }}
        className={styles.cancelButton}
        style={{ minWidth: '20px', marginTop: '30px' }}
      >
        {t('cancel')}
      </button>
    </>
  );
};
