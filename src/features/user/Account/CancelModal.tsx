import type { APIError } from '@planet-sdk/common';
import type { Subscription } from '../../common/types/payments';

import { useEffect, useState, useContext } from 'react';
import { ThemeContext } from '../../../theme/themeContext';
import styles from './AccountHistory.module.scss';
import { useTranslations } from 'next-intl';
import GreenRadio from '../../common/InputTypes/GreenRadio';
import Close from '../../../../public/assets/images/icons/headerIcons/Close';
import {
  CircularProgress,
  Modal,
  Fade,
  FormControl,
  RadioGroup,
  FormControlLabel,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { handleError } from '@planet-sdk/common';
import { useApi } from '../../../hooks/useApi';
import { CalendarPicker } from '@mui/x-date-pickers';
import { useErrorHandlingStore } from '../../../stores/errorHandlingStore';

interface CancelModalProps {
  cancelModalOpen: boolean;
  handleCancelModalClose: () => void;
  record: Subscription;
  fetchRecurrentDonations: (next?: boolean | undefined) => void;
}

type CancellationType = 'immediate' | 'period-end' | 'custom-date';

type CancelSubscriptionApiPayload = {
  cancellationType: CancellationType;
  cancellationDate: string | null | undefined;
};

export const CancelModal = ({
  cancelModalOpen,
  handleCancelModalClose,
  record,
  fetchRecurrentDonations,
}: CancelModalProps) => {
  const { theme } = useContext(ThemeContext);
  const { putApiAuthenticated } = useApi();
  const t = useTranslations('Me');
  //local state
  const [option, setOption] = useState('cancelImmediately');
  const [showCalender, setShowCalender] = useState(false);
  const [date, setdate] = useState<Date | null>(new Date());
  const [disabled, setDisabled] = useState(false);
  //store
  const setErrors = useErrorHandlingStore((state) => state.setErrors);

  useEffect(() => {
    setDisabled(false);
  }, [cancelModalOpen]);

  const cancelDonation = async () => {
    setDisabled(true);
    const payload: CancelSubscriptionApiPayload = {
      cancellationType:
        option == 'cancelImmediately'
          ? 'immediate'
          : option == 'cancelOnPeriodEnd'
          ? 'period-end'
          : 'custom-date', // immediate|period-end|custom-date
      cancellationDate:
        option == 'cancelOnSelectedDate'
          ? date?.toISOString().split('T')[0]
          : null, // if custom-date is cancellationType
    };
    try {
      await putApiAuthenticated(`/app/subscriptions/${record.id}`, {
        queryParams: { scope: 'cancel' },
        payload,
      });
      handleCancelModalClose();
      fetchRecurrentDonations();
    } catch (err) {
      handleCancelModalClose();
      setErrors(handleError(err as APIError));
    }
  };
  return (
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
              <h4>{t('cancelDonationConfirmation')}</h4>
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
                <p>{t('cancelDonationPaypalDescription')}</p>
              ) : (
                <p>{t('cancelDonationDescription')}</p>
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
                  setOption(event.target.value);
                  if (event.target.value === 'cancelOnSelectedDate') {
                    setShowCalender(true);
                  } else {
                    setShowCalender(false);
                  }
                }}
                className={styles.radioButtonGrid}
              >
                <FormControlLabel
                  key={1}
                  value={'cancelImmediately'}
                  control={<GreenRadio />}
                  label={t('cancelImmediately')}
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
                  label={t('cancelOnSelectedDate')}
                />
              </RadioGroup>
              {showCalender ? (
                <>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <CalendarPicker
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
