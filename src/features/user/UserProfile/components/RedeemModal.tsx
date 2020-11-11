import React from 'react';
import styles from '../styles/RedeemModal.module.scss';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import MaterialTextField from '../../../common/InputTypes/MaterialTextField';
import i18next from '../../../../../i18n';


const {useTranslation} = i18next;
export default function RedeemModal({
  redeemModalOpen,
  handleRedeemModalClose,
}: any) {
  const {t} = useTranslation(['me', 'common'])
  return (
    <Modal
      className={styles.modalContainer}
      open={redeemModalOpen}
      onClose={handleRedeemModalClose}
      closeAfterTransition
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={redeemModalOpen}>
        <div className={styles.modal}>
          <h4>
            <b> {t('me:redeem')} </b>
          </h4>
          <div className={styles.inputField}>
            <MaterialTextField placeholder="pp.eco/XADSA-DS-AS" label="" variant="outlined" />
          </div>
          <div className={styles.continueButton}>{t('common:continue')}</div>
        </div>
      </Fade>
    </Modal>
  );
}
