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
  Modal,
  Fade,
  FormControl,
  RadioGroup,
  FormControlLabel,
  styled,
} from '@mui/material';

import { CalendarPicker } from '@mui/x-date-pickers/CalendarPicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import themeProperties from '../../../theme/themeProperties';
import { Subscription } from '../../common/types/payments';
import CustomModal from '../../common/Layout/CustomModal';

const MuiCalendarPicker = styled(CalendarPicker)({
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
});

interface CancelModalProps {
  cancelModalOpen: boolean;
  handleCancelModalClose: () => void;
  record: Subscription;
  fetchRecurrentDonations: (next?: boolean | undefined) => void;
  handleCancelModalOpen: () => void;
}

export const CancelModal = ({
  cancelModalOpen,
  handleCancelModalClose,
  record,
  fetchRecurrentDonations,
  handleCancelModalOpen,
}: CancelModalProps) => {
  const { theme } = React.useContext(ThemeContext);
  const { token, impersonatedEmail } = React.useContext(UserPropsContext);
  const { handleError } = React.useContext(ErrorHandlingContext);
  const [option, setoption] = React.useState('cancelImmediately');
  const [showCalender, setshowCalender] = React.useState(false);
  const [date, setdate] = React.useState(new Date());
  const [disabled, setDisabled] = React.useState(false);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [remainingPayments, setRemainingPayments] = React.useState(0);
  const { t } = useTranslation(['me']);

  React.useEffect(() => {
    setDisabled(false);
  }, [cancelModalOpen]);

  const handleSave = () => {
    if (option === 'cancelOnSelectedDate') {
      displayRemainingPayments();
    } else {
      cancelDonation();
    }
  };

  const cancelDonation = () => {
    setIsModalOpen(false);
    handleCancelModalOpen();
    setDisabled(true);
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
      impersonatedEmail,
      handleError
    )
      .then((res) => {
        handleCancelModalClose();
        fetchRecurrentDonations();
      })
      .catch((err) => {
        console.log('Error cancelling recurring donations.');
      });
  };

  function displayRemainingPayments() {
    const current = new Date();
    const end = new Date(date);
    const subscription = new Date(record.firstDonation.created);
    const subscriptionDate = subscription.getDate();
    const subscriptionMonth = subscription.getMonth();
    const startMonth = current.getMonth();
    const startYear = current.getFullYear();
    const endDate = end.getDate();
    const endMonth = end.getMonth();
    const endYear = end.getFullYear();
    let remainingPayments = 0;

    if (record.frequency === 'monthly') {
      //to calculate months between two dates
      remainingPayments += (endYear - startYear) * 12;
      remainingPayments -= startMonth;
      remainingPayments += endMonth - 1;

      //to check if payment needs to be made in the last month
      if (subscriptionDate <= endDate) {
        remainingPayments += 1;
      }
    } else {
      remainingPayments += endYear - startYear - 1;
      //to check if payment needs to be made in the last year
      if (subscriptionMonth <= endMonth && subscriptionDate <= endDate) {
        remainingPayments += 1;
      }
    }
    setIsModalOpen(true);
    handleCancelModalClose();
    setRemainingPayments(remainingPayments);
  }
  return !isModalOpen ? (
    <Modal
      className={'modalContainer' + ' ' + theme}
      open={cancelModalOpen}
      onClose={handleCancelModalClose}
      closeAfterTransition
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
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
            <FormControl variant="standard" component="fieldset">
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
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <MuiCalendarPicker
                      date={date}
                      onChange={(value) => {
                        setdate(value);
                      }}
                      minDate={
                        new Date(new Date().valueOf() + 1000 * 3600 * 24)
                      }
                    />
                  </LocalizationProvider>
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
              onClick={() => handleSave()}
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
  ) : (
    <CustomModal
      isOpen={isModalOpen}
      handleContinue={cancelDonation}
      buttonTitle={t('continue')}
      isCancel={false}
      modalTitle=""
      modalSubtitle={t('me:remainingPaymentsText', {
        remainingPayments,
      })}
    />
  );
};
