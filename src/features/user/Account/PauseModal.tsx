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

export const PauseModal = ({
  pauseModalOpen,
  handlePauseModalClose,
  record,
}: any) => {
  const { theme } = React.useContext(ThemeContext);
  const { token } = React.useContext(UserPropsContext);
  const [option, setoption] = React.useState();
  const [showCalender, setshowCalender] = React.useState(false);
  const [date, setdate] = React.useState(
    new Date(new Date(record?.currentPeriodEnd).valueOf() + 1000 * 3600 * 24)
  );
  const { t, i18n, ready } = useTranslation(['me']);

  React.useEffect(() => {
    setdate(
      new Date(new Date(record?.currentPeriodEnd).valueOf() + 1000 * 3600 * 24)
    );
  }, [record?.currentPeriodEnd]);

  const pauseDonation = () => {
    const bodyToSend = {
      pauseType:
        option == 'pauseForMonth' || option == 'pauseUntilDate'
          ? 'custom-date'
          : 'infinite', //custom-date | infinite
      pauseUntil:
        option == 'pauseForMonth' || option == 'pauseUntilDate'
          ? date.toISOString().split('T')[0]
          : null, // only if pauseType='custom-date'
    };
    putAuthenticatedRequest(
      `/app/subscriptions/${record.id}?scope=pause`,
      bodyToSend,
      token
    )
      .then((res) => {
        console.log(res, 'Response');
        handlePauseModalClose();
      })
      .catch((err) => {
        console.log(err, 'Error');
      });
  };
  return (
    <Modal
      className={'modalContainer' + ' ' + theme}
      open={pauseModalOpen}
      onClose={handlePauseModalClose}
      closeAfterTransition
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={pauseModalOpen}>
        <div className={styles.manageDonationModal}>
          <button
            onClick={handlePauseModalClose}
            onKeyPress={handlePauseModalClose}
            role="button"
            tabIndex={0}
            className={styles.headerCloseIcon}
          >
            <Close color={styles.light} />
          </button>
          <div className={styles.modalTexts}>
            <h4>{t('me:pauseDonationConfirmation')}</h4>
            <div className={styles.note}>
              <p>{t('me:pauseDonationDescription')}</p>
            </div>
          </div>
          <FormControl component="fieldset">
            <RadioGroup
              aria-label="date"
              name="date"
              value={option}
              onChange={(event) => {
                setoption(event.target.value);
                if (event.target.value === 'pauseUntilDate') {
                  setshowCalender(true);
                } else {
                  setshowCalender(false);
                }
              }}
              className={styles.radioButtonGrid}
            >
              {/* {new Date(record?.currentPeriodEnd).getMonth()==new Date().getMonth()?(<FormControlLabel
                key={1}
                value={'pauseForMonth'}
                control={<GreenRadio />}
                label={'Pause For Current Month'}
              />):[]} */}
              <FormControlLabel
                key={2}
                value={'pauseUntilResume'}
                control={<GreenRadio />}
                label={'Pause Until I resume'}
              />
              <FormControlLabel
                key={3}
                value={'pauseUntilDate'}
                control={<GreenRadio />}
                label={'Select Date'}
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
                      console.log('value calendar', value);
                      setdate(value);
                    }}
                    minDate={date}
                    disablePast={true}
                  />
                </MuiPickersUtilsProvider>
              </ThemeProvider>
            ) : (
              []
            )}
          </FormControl>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={() => pauseDonation()}
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
