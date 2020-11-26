import React from 'react';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import styles from '../styles/RedeemModal.module.scss';
import MaterialTextField from '../../../common/InputTypes/MaterialTextField';
import i18next from '../../../../../i18n';
import { putAuthenticatedRequest } from '../../../../utils/apiRequests/api';
import { useAuth0 } from '@auth0/auth0-react';

const { useTranslation } = i18next;

export default function AddTargetModal({
  userprofile,
  addTargetModalOpen,
  handleAddTargetModalClose,
  changeForceReload,
  forceReload,
}: any) {
  const [target, setTarget] = React.useState(0);
  const { t } = useTranslation(['target']);

  const [token, setToken] = React.useState('')
  const {
    isLoading,
    isAuthenticated,
    getAccessTokenSilently
  } = useAuth0();
    // This effect is used to get and update UserInfo if the isAuthenticated changes
    React.useEffect(() => {
      async function loadFunction() {
        const token = await getAccessTokenSilently();
        setToken(token);
      }
      if (isAuthenticated && !isLoading) {
        loadFunction()
      }
    }, [isAuthenticated,isLoading])

  const apiCallChangeTarget = async () => {
    if (isAuthenticated && token) {
      const bodyToSend = {
        target: !target ? userprofile.score.target : target,
      };
      putAuthenticatedRequest(`/app/profile`, bodyToSend, token).then((res)=>{
        handleAddTargetModalClose();
        changeForceReload(!forceReload);
      }).catch(error => {
        handleAddTargetModalClose();
        console.log(error);
      })
    }
  };
  return (
    <Modal
      className={styles.modalContainer}
      open={addTargetModalOpen}
      onClose={handleAddTargetModalClose}
      closeAfterTransition
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={addTargetModalOpen}>
        <div className={styles.modal}>
          <h4>
            <b>
{' '}
{t('target:setTarget')}
{' '}
            </b>
          </h4>
          <div className={styles.inputField}>
            <MaterialTextField
              placeholder={userprofile.score.target ? userprofile.score.target : '10000'}
              InputProps={{ inputProps: { min: 0 } }}
              label=""
              type="number"
              defaultValue={userprofile.score.target ? userprofile.score.target : null}
              onChange={(e) => setTarget(e.target.value)}
              variant="outlined"
            />
          </div>
          <div className={styles.continueButton} onClick={() => apiCallChangeTarget()}>{t('target:targetSave')}</div>
        </div>
      </Fade>
    </Modal>
  );
}
