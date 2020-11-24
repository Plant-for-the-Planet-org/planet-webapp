import React from 'react';
import { useSession } from 'next-auth/client';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import styles from '../styles/RedeemModal.module.scss';
import MaterialTextField from '../../../common/InputTypes/MaterialTextField';
import { editProfile } from '../../../../utils/auth0/apiRequests';
import i18next from '../../../../../i18n';

const { useTranslation } = i18next;

export default function AddTargetModal({
  userprofile,
  addTargetModalOpen,
  handleAddTargetModalClose,
  changeForceReload,
  forceReload,
}: any) {
  const [target, setTarget] = React.useState(0);
  const [session, loading] = useSession();
  const { t } = useTranslation(['target']);

  const apiCallChangeTarget = async () => {
    if (!loading && session) {
      const bodyToSend = {
        target: !target ? userprofile.score.target : target,
      };
      const res = await editProfile(session, bodyToSend);
      if (res.status === 200) {
        handleAddTargetModalClose();
        changeForceReload(!forceReload);
      } else {
        console.log('edit target failed');
        handleAddTargetModalClose();
      }
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
