import React from 'react';
import { ThemeContext } from '../../../theme/themeContext';
import styles from './AccountHistory.module.scss';
import { useTranslation } from 'react-i18next';
import { putAuthenticatedRequest } from '../../../utils/apiRequests/api';
import { UserPropsContext } from '../../common/Layout/UserPropsContext';
import GreenRadio from '../../common/InputTypes/GreenRadio';
import Close from '../../../../public/assets/images/icons/headerIcons/close';
import { ErrorHandlingContext } from '../../common/Layout/ErrorHandlingContext';
import {
  CircularProgress,
  RadioGroup,
  FormControl,
  Fade,
  Modal,
  FormControlLabel,
} from '@mui/material';

import { CalendarPicker as MuiCalendarPicker } from '@mui/x-date-pickers/CalendarPicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

export const PauseModal = ({
  pauseModalOpen,
  handlePauseModalClose,
  record,
  fetchRecurrentDonations,
}: any) => {
  const { theme } = React.useContext(ThemeContext);
  const { token } = React.useContext(UserPropsContext);
  const [option, setoption] = React.useState();
  const [showCalender, setshowCalender] = React.useState(false);
  const [date, setdate] = React.useState(
    new Date(new Date(record?.currentPeriodEnd).valueOf() + 1000 * 3600 * 24)
  );
  const [disabled, setDisabled] = React.useState(false);

  const { t, i18n, ready } = useTranslation(['me']);
  const { handleError } = React.useContext(ErrorHandlingContext);

  React.useEffect(() => {
    setdate(
      new Date(new Date(record?.currentPeriodEnd).valueOf() + 1000 * 3600 * 24)
    );
  }, [record?.currentPeriodEnd]);

  React.useEffect(() => {
    setDisabled(false);
  }, [pauseModalOpen]);

  const pauseDonation = () => {
    setDisabled(true);
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
      token,
      handleError
    )
      .then((res) => {
        handlePauseModalClose();
        fetchRecurrentDonations();
      })
      .catch((err) => {
        console.log('Error pausing recurring donation.');
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
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={pauseModalOpen}>
        <div className={styles.manageDonationModal}>
          <div style={{ marginBottom: '10px' }} />
          <div className={styles.modalTexts}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
              }}
            >
              <h4>{t('me:pauseDonationConfirmation')}</h4>
              <button
                onClick={handlePauseModalClose}
                onKeyPress={handlePauseModalClose}
                role="button"
                tabIndex={0}
                className={styles.headerCloseIcon}
              >
                <Close color={'#4d5153'} />
              </button>
            </div>
            <div className={styles.note}>
              <p>{t('me:pauseDonationDescription')}</p>
            </div>
          </div>
          <FormControl variant="standard" component="fieldset">
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
                label={t('me:pauseUntilResume')}
              />
              <FormControlLabel
                key={3}
                value={'pauseUntilDate'}
                control={<GreenRadio />}
                label={t('me:pauseUntilDate')}
              />
            </RadioGroup>
            {showCalender ? (
              <>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <MuiCalendarPicker
                    date={date}
                    onChange={(value) => {
                      setdate(value);
                    }}
                    minDate={
                      new Date(
                        new Date(record?.currentPeriodEnd).valueOf() +
                          1000 * 3600 * 24
                      )
                    }
                    disablePast={true}
                  />
                </LocalizationProvider>
                <p className={styles.pauseNote}>{t('pauseNote')}</p>
              </>
            ) : (
              []
            )}
          </FormControl>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={() => pauseDonation()}
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
                  {t('pausingDonation')}
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
