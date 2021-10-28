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
// import CalendarPicker from '@mui/lab/CalendarPicker';
import { Calendar, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import materialTheme from '../../../theme/themeStyles';
import { Controller } from '../../../../node_modules/react-hook-form/dist';
import Close from '../../../../public/assets/images/icons/headerIcons/close';
export const CancelModal = ({
  cancelModalOpen,
  handleCancelModalClose,
  record,
}: any) => {
  const { theme } = React.useContext(ThemeContext);
  const { token } = React.useContext(UserPropsContext);
  const [option, setoption] = React.useState();
  const [showCalender, setshowCalender] = React.useState(false);
  const [date, setdate] = React.useState(new Date());
  const { t, i18n, ready } = useTranslation(['me']);
  const cancelDonation = () => {
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
      token
    )
      .then((res) => {
        console.log(res, 'Response');
        handleCancelModalClose();
      })
      .catch((err) => {
        console.log(err, 'Error');
      });
  };
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
          <button
            onClick={handleCancelModalClose}
            onKeyPress={handleCancelModalClose}
            role="button"
            tabIndex={0}
            className={styles.headerCloseIcon}
          >
            <Close color={styles.light} />
          </button>
          <div className={styles.modalTexts}>
            <h4>{t('me:cancelDonationConfirmation')}</h4>
            <div className={styles.note}>
              <p>{t('me:cancelDonationDescription')}</p>
            </div>
          </div>
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
                label={'Cancel immediately'}
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
                label={'Select Date of cancellation'}
              />
            </RadioGroup>
            {showCalender ? (
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
                    disablePast={true}
                    color={'#68B030'}
                  />
                </MuiPickersUtilsProvider>
              </ThemeProvider>
            ) : (
              []
            )}
          </FormControl>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={() => cancelDonation()}
              className={styles.submitButton}
              style={{ minWidth: '20px', marginTop: '30px' }}
            >
              {t('save')}
            </button>
          </div>
        </div>
      </Fade>
    </Modal>
  );
};
