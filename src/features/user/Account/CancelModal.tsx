import React from 'react';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import FormControl from '@material-ui/core/FormControl';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { ThemeContext } from '../../../theme/themeContext';
import styles from './AccountHistory.module.scss';
import { useTranslation } from 'react-i18next';
import { putAuthenticatedRequest } from '../../../utils/apiRequests/api';
import { UserPropsContext } from '../../common/Layout/UserPropsContext';
import GreenRadio from '../../common/InputTypes/GreenRadio';
import { ThemeProvider } from '@material-ui/styles';
import { Calendar, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import materialTheme from '../../../theme/themeStyles';
import Close from '../../../../public/assets/images/icons/headerIcons/close';
import { ErrorHandlingContext } from '../../common/Layout/ErrorHandlingContext';
import { CircularProgress } from '@material-ui/core';
export const CancelModal = ({
  cancelModalOpen,
  handleCancelModalClose,
  record,
  fetchRecurrentDonations,
}: any) => {
  const { theme } = React.useContext(ThemeContext);
  const { token } = React.useContext(UserPropsContext);
  const [option, setoption] = React.useState('cancelImmediately');
  const [showCalender, setshowCalender] = React.useState(false);
  const [date, setdate] = React.useState(new Date());
  const [disabled, setDisabled] = React.useState(false);
  const { t, i18n, ready } = useTranslation(['me']);
  const { handleError } = React.useContext(ErrorHandlingContext);

  React.useEffect(() => {
    setDisabled(false);
  }, [cancelModalOpen]);

  const cancelDonation = () => {
    setDisabled(true);
    console.log(record.id, date.toISOString().split('T')[0], '{record.id');
    const bodyToSend = {
      cancellationType:
        option == 'cancelImmediately'
          ? 'immediate'
          : option == 'cancelOnPeriodEnd'
          ? 'period-end'
          : 'custom-date', // immediate|period-end|custom-date
      cancellationDate:
        option == 'cancelOnSelectedDate'
          ? date.toISOString().split('T')[0]
          : null, // if custom-date is cancellationType
    };
    putAuthenticatedRequest(
      `/app/subscriptions/${record.id}?scope=cancel`,
      bodyToSend,
      token,
      handleError
    )
      .then((res) => {
        console.log(res, 'Response');
        handleCancelModalClose();
        fetchRecurrentDonations();
      })
      .catch((err) => {
        console.log(err, 'Error');
      });
  };
  console.log(record, 'record');
  return (
    <Modal
      className={'modalContainer' + ' ' + theme}
      open={cancelModalOpen}
      onClose={handleCancelModalClose}
      closeAfterTransition
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={cancelModalOpen}>
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
              <h4>{t('me:cancelDonationConfirmation')}</h4>
              <button
                onClick={handleCancelModalClose}
                onKeyPress={handleCancelModalClose}
                role="button"
                tabIndex={0}
                className={styles.headerCloseIcon}
              >
                <Close color={'#4d5153'} />
              </button>
            </div>
            <div className={styles.note}>
              {record?.method === 'paypal' ? (
                <p>{t('me:cancelDonationPaypalDescription')}</p>
              ) : (
                <p>{t('me:cancelDonationDescription')}</p>
              )}
            </div>
          </div>
          {record?.method !== 'paypal' ? (
            <FormControl component="fieldset">
              <RadioGroup
                aria-label="date"
                name="date"
                value={option}
                onChange={(event) => {
                  setoption(event.target.value);
                  if (event.target.value === 'cancelOnSelectedDate') {
                    setshowCalender(true);
                  } else {
                    setshowCalender(false);
                  }
                }}
                className={styles.radioButtonGrid}
              >
                <FormControlLabel
                  key={1}
                  value={'cancelImmediately'}
                  control={<GreenRadio />}
                  label={t('me:cancelImmediately')}
                />
                {/* <FormControlLabel
                key={2}
                value={'cancelOnPeriodEnd'}
                control={<GreenRadio />}
                label={'Cancel when current period ends'}
              /> */}

                <FormControlLabel
                  key={3}
                  value={'cancelOnSelectedDate'}
                  control={<GreenRadio />}
                  label={t('me:cancelOnSelectedDate')}
                />
              </RadioGroup>
              {showCalender ? (
                <>
                  <ThemeProvider theme={materialTheme}>
                    <MuiPickersUtilsProvider
                      utils={DateFnsUtils}
                      // locale={
                      //   localeMapForDate[userLang]
                      //     ? localeMapForDate[userLang]
                      //     : localeMapForDate['en']
                      // }
                    >
                      <Calendar
                        date={date}
                        onChange={(value) => {
                          console.log(value);
                          setdate(value);
                        }}
                        minDate={
                          new Date(new Date().valueOf() + 1000 * 3600 * 24)
                        }
                        color={'#68B030'}
                      />
                    </MuiPickersUtilsProvider>
                  </ThemeProvider>
                </>
              ) : (
                []
              )}
            </FormControl>
          ) : (
            []
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={() => cancelDonation()}
              className={styles.submitButton}
              disabled={disabled}
              style={{ minWidth: '20px', marginTop: '30px' }}
            >
              {disabled ? (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                  }}
                >
                  {t('cancellingDonation')}
                  <div style={{ marginLeft: '5px' }}>
                    <CircularProgress color="inherit" size={15} />
                  </div>
                </div>
              ) : (
                t('save')
              )}
            </button>
          </div>
        </div>
      </Fade>
    </Modal>
  );
};
