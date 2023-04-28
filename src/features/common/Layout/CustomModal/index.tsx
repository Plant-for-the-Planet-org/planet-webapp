import Modal from '@mui/material/Modal';
import React from 'react';
import { useTranslation } from 'next-i18next';
import styles from './CustomModal.module.scss';

interface Props {
  isOpen: boolean;
  handleContinue: () => void;
  handleCancel?: () => void;
  buttonTitle: string;
  modalTitle: string;
  modalSubtitle: string;
  isCancel: boolean;
}

export default function CustomModal({
  isOpen,
  handleContinue,
  handleCancel,
  buttonTitle,
  modalTitle,
  modalSubtitle,
  isCancel,
}: Props) {
  const { t } = useTranslation(['editProfile']);
  return (
    <Modal
      open={isOpen}
      hideBackdrop
      className={'modalContainer'}
      style={{ width: '100%' }}
    >
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
            id={'Continue'}
            className={styles.continueButton}
            onClick={handleContinue}
          >
            {buttonTitle}
          </button>
          {isCancel && (
            <button
              id={'Cancel'}
              className={styles.cancelButton}
              onClick={handleCancel}
            >
              {t('editProfile:cancel')}
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}
