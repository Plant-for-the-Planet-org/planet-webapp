import type { APIError } from '@planet-sdk/common';
import type { Subscription } from '../../common/types/payments';

import React from 'react';
import { ThemeContext } from '../../../theme/themeContext';
import styles from './AccountHistory.module.scss';
import { useTranslations } from 'next-intl';
import GreenRadio from '../../common/InputTypes/GreenRadio';
import Close from '../../../../public/assets/images/icons/headerIcons/Close';
import { ErrorHandlingContext } from '../../common/Layout/ErrorHandlingContext';
import {
  CircularProgress,
  RadioGroup,
  FormControl,
  Fade,
  Modal,
  FormControlLabel,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { handleError } from '@planet-sdk/common';
import { useApi } from '../../../hooks/useApi';
import { CalendarPicker } from '@mui/x-date-pickers';

interface PauseModalProps {
  pauseModalOpen: boolean;
  handlePauseModalClose: () => void;
  record: Subscription;
  fetchRecurrentDonations: (next?: boolean | undefined) => void;
}
type PauseType = 'custom-date' | 'infinite';
type PauseSubscriptionApiPayload = {
  pauseType: PauseType;
  pauseUntil: string | null | undefined;
};

export const PauseModal = ({
  pauseModalOpen,
  handlePauseModalClose,
  record,
  fetchRecurrentDonations,
}: PauseModalProps) => {
  const { theme } = React.useContext(ThemeContext);
  const { putApiAuthenticated } = useApi();
  const [option, setOption] = React.useState<string>();
  const [showCalender, setShowCalender] = React.useState(false);
  const [date, setdate] = React.useState<Date | null>(
    new Date(new Date(record?.currentPeriodEnd).valueOf() + 1000 * 3600 * 24)
  );
  const [disabled, setDisabled] = React.useState(false);

  const t = useTranslations('Me');
  const { setErrors } = React.useContext(ErrorHandlingContext);

  React.useEffect(() => {
    setdate(
      new Date(new Date(record?.currentPeriodEnd).valueOf() + 1000 * 3600 * 24)
    );
  }, [record?.currentPeriodEnd]);

  React.useEffect(() => {
    setDisabled(false);
  }, [pauseModalOpen]);

  const pauseDonation = async () => {
    setDisabled(true);
    const payload = {
      pauseType: (option === 'pauseForMonth' || option === 'pauseUntilDate'
        ? 'custom-date'
        : 'infinite') as PauseType,
      pauseUntil:
        option == 'pauseForMonth' || option == 'pauseUntilDate'
          ? date?.toISOString().split('T')[0]
          : null, // only if pauseType='custom-date'
    };

    try {
      await putApiAuthenticated<Subscription, PauseSubscriptionApiPayload>(
        `/app/subscriptions/${record.id}`,
        {
          queryParams: { scope: 'pause' },
          payload,
        }
      );
      handlePauseModalClose();
      fetchRecurrentDonations();
    } catch (err) {
      handlePauseModalClose();
      setErrors(handleError(err as APIError));
    }
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
              <h4>{t('pauseDonationConfirmation')}</h4>
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
              <p>{t('pauseDonationDescription')}</p>
            </div>
          </div>
          <FormControl variant="standard" component="fieldset">
            <RadioGroup
              aria-label="date"
              name="date"
              value={option}
              onChange={(event) => {
                setOption(event.target.value);
                if (event.target.value === 'pauseUntilDate') {
                  setShowCalender(true);
                } else {
                  setShowCalender(false);
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
                label={t('pauseUntilResume')}
              />
              <FormControlLabel
                key={3}
                value={'pauseUntilDate'}
                control={<GreenRadio />}
                label={t('pauseUntilDate')}
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
