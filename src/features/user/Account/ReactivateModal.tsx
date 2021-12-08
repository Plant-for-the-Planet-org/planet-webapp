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

export const ReactivateModal = ({
  reactivateModalOpen,
  handleReactivateModalClose,
  record,
}: any) => {
  const { theme } = React.useContext(ThemeContext);
  const { token } = React.useContext(UserPropsContext);
  const { t, i18n, ready } = useTranslation(['me']);
  const bodyToSend = {};
  const reactivateDonation = () => {
    putAuthenticatedRequest(
      `/app/subscriptions/${record.id}?scope=reactivate`,
      bodyToSend,
      token
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
              <p>{t('me:reactivateDonationDescription')}</p>
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
