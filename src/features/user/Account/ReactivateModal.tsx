import React from 'react';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import { ThemeContext } from '../../../theme/themeContext';
import styles from './AccountHistory.module.scss';
import { useTranslation } from 'react-i18next';
import { putAuthenticatedRequest } from '../../../utils/apiRequests/api';
import { UserPropsContext } from '../../common/Layout/UserPropsContext';
import Close from '../../../../public/assets/images/icons/headerIcons/close';
import { ErrorHandlingContext } from '../../common/Layout/ErrorHandlingContext';

export const ReactivateModal = ({
  reactivateModalOpen,
  handleReactivateModalClose,
  record,
}: any) => {
  const { theme } = React.useContext(ThemeContext);
  const { token } = React.useContext(UserPropsContext);
  const { handleError } = React.useContext(ErrorHandlingContext);
  const { t, i18n, ready } = useTranslation(['me']);
  const bodyToSend = {};
  const reactivateDonation = () => {
    putAuthenticatedRequest(
      `/app/subscriptions/${record.id}?scope=reactivate`,
      bodyToSend,
      token,
      handleError
    )
      .then((res) => {
        console.log(res, 'Response');
        handleReactivateModalClose();
      })
      .catch((err) => {
        console.log(err, 'Error');
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
      BackdropComponent={Backdrop}
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
