import Modal from '@mui/material/Modal';
import React from 'react';
import { useTranslations } from 'next-intl';
import styles from './CustomModal.module.scss';

interface Props {
  isOpen: boolean;
  handleContinue: () => void;
  handleCancel: () => void;
  buttonTitle: string;
  modalTitle: string;
  modalSubtitle: string;
}

export default function CustomModal({
  isOpen,
  handleContinue,
  handleCancel,
  buttonTitle,
  modalTitle,
  modalSubtitle,
}: Props) {
  const t = useTranslations('EditProfile');
  return (
    <Modal open={isOpen} hideBackdrop className="modalContainer">
      <div className={styles.modal}>
        <div className={styles.modal__titleContainer}>
          <div className={styles.modal__titleText}>
            {' '}
            <b> {modalTitle} </b>
          </div>
          <div className={styles.modal__subtitle}>{modalSubtitle}</div>
        </div>
        <div
          className={styles.buttonContainer}
          style={{ justifyContent: 'center' }}
        >
          <button
            id="Continue"
            className={styles.continueButton}
            onClick={handleContinue}
          >
            {buttonTitle}
          </button>
          <button
            id="Cancel"
            className={styles.cancelButton}
            onClick={handleCancel}
          >
            {t('cancel')}
          </button>
        </div>
      </div>
    </Modal>
  );
}
