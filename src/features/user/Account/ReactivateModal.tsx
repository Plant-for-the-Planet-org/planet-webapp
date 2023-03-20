import React from 'react';
import { ThemeContext } from '../../../theme/themeContext';
import styles from './AccountHistory.module.scss';
import { useTranslation } from 'react-i18next';
import { putAuthenticatedRequest } from '../../../utils/apiRequests/api';
import { UserPropsContext } from '../../common/Layout/UserPropsContext';
import Close from '../../../../public/assets/images/icons/headerIcons/close';
import { ErrorHandlingContext } from '../../common/Layout/ErrorHandlingContext';
import { CircularProgress, Modal, Fade } from '@mui/material';
import { Subscription } from '../../common/types/payments';

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
  const [disabled, setDisabled] = React.useState(false);
  const { theme } = React.useContext(ThemeContext);
  const { token, impersonatedEmail } = React.useContext(UserPropsContext);
  const { handleError } = React.useContext(ErrorHandlingContext);
  const { t } = useTranslation(['me']);
  const bodyToSend = {};

  React.useEffect(() => {
    setDisabled(false);
  }, [reactivateModalOpen]);

  const reactivateDonation = () => {
    setDisabled(true);
    putAuthenticatedRequest(
      `/app/subscriptions/${record.id}?scope=reactivate`,
      bodyToSend,
      token,
      impersonatedEmail,
      handleError
    )
      .then((res) => {
        handleReactivateModalClose();
        fetchRecurrentDonations();
      })
      .catch((err) => {
        console.log('Error reactivating recurring donation');
      });
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
              <h4>{t('me:reactivateDonationConfirmation')}</h4>
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
                {t('me:reactivateDonationDescription', {
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
