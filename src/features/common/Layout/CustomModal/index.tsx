import type { ReactNode } from 'react';

import { useId } from 'react';
import Modal from '@mui/material/Modal';
import styles from './CustomModal.module.scss';

interface Props {
  isOpen: boolean;
  handleContinue: () => void | Promise<void>;
  handleCancel: () => void;
  continueButtonText: string;
  cancelButtonText: string;
  modalTitle: string;
  modalSubtitle: ReactNode;
  isLoading?: boolean;
  loadingText?: string;
}

export default function CustomModal({
  isOpen,
  isLoading = false,
  loadingText = 'Loading...',
  handleContinue,
  handleCancel,
  continueButtonText,
  cancelButtonText,
  modalTitle,
  modalSubtitle,
}: Props) {
  // Names and describes the dialog using its visible title and subtitle
  const titleId = useId();
  const subtitleId = useId();

  return (
    // `onClose` only reacts to Escape here, since `hideBackdrop` leaves no
    // backdrop to click
    <Modal
      open={isOpen}
      hideBackdrop
      className={'modalContainer'}
      onClose={handleCancel}
    >
      <div
        className={styles.modal}
        role="dialog"
        aria-labelledby={titleId}
        aria-describedby={subtitleId}
      >
        <div className={styles.modal__titleContainer}>
          <div className={styles.modal__titleText} id={titleId}>
            {' '}
            <b> {modalTitle} </b>
          </div>
          <div className={styles.modal__subtitle} id={subtitleId}>
            {modalSubtitle}
          </div>
        </div>
        <div
          className={styles.buttonContainer}
          style={{ justifyContent: 'center' }}
        >
          <button
            id={'Continue'}
            className={styles.continueButton}
            onClick={handleContinue}
            disabled={isLoading}
          >
            {isLoading ? loadingText : continueButtonText}
          </button>
          <button
            id={'Cancel'}
            className={styles.cancelButton}
            onClick={handleCancel}
          >
            {cancelButtonText}
          </button>
        </div>
      </div>
    </Modal>
  );
}
