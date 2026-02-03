import type { APIError } from '@planet-sdk/common';
import type { Subscription } from '../../common/types/payments';

import { useState, useContext, useEffect } from 'react';
import { ThemeContext } from '../../../theme/themeContext';
import styles from './AccountHistory.module.scss';
import { useTranslations } from 'next-intl';
import Close from '../../../../public/assets/images/icons/headerIcons/Close';
import { CircularProgress, Modal, Fade } from '@mui/material';
import { handleError } from '@planet-sdk/common';
import { useApi } from '../../../hooks/useApi';
import { useErrorHandlingStore } from '../../../stores/errorHandlingStore';

interface ReactivateModalProps {
  reactivateModalOpen: boolean;
  handleReactivateModalClose: () => void;
  record: Subscription;
  fetchRecurrentDonations: (next?: boolean | undefined) => void;
}

export const ReactivateModal = ({
  reactivateModalOpen,
  handleReactivateModalClose,
  record,
  fetchRecurrentDonations,
}: ReactivateModalProps) => {
  const t = useTranslations('Me');
  const { putApiAuthenticated } = useApi();
  const { theme } = useContext(ThemeContext);
  // local state
  const [disabled, setDisabled] = useState(false);
  // store
  const setErrors = useErrorHandlingStore((state) => state.setErrors);
  const payload = {};

  useEffect(() => {
    setDisabled(false);
  }, [reactivateModalOpen]);

  const reactivateDonation = async () => {
    setDisabled(true);

    try {
      await putApiAuthenticated<Subscription>(
        `/app/subscriptions/${record.id}`,
        {
          queryParams: {
            scope: 'reactivate',
          },
          payload,
        }
      );
      handleReactivateModalClose();
      fetchRecurrentDonations();
    } catch (err) {
      handleReactivateModalClose();
      setErrors(handleError(err as APIError));
    }
  };
  return (
    <Modal
      className={'modalContainer' + ' ' + theme}
      open={reactivateModalOpen}
      onClose={handleReactivateModalClose}
      closeAfterTransition
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={reactivateModalOpen}>
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
              <h4>{t('reactivateDonationConfirmation')}</h4>
              <button
                onClick={handleReactivateModalClose}
                onKeyPress={handleReactivateModalClose}
                role="button"
                tabIndex={0}
                className={styles.headerCloseIcon}
              >
                <Close color={'#4d5153'} />
              </button>
            </div>
            <div className={styles.note}>
              <p>
                {t('reactivateDonationDescription', {
                  currentPeriodEnds: record?.currentPeriodEnd,
                })}
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={() => reactivateDonation()}
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
                  {t('reactivatingDonation')}
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
