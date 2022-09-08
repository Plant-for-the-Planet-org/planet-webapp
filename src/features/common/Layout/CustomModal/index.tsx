import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import React from 'react';
import i18next from '../../../../../i18n';
import { ThemeContext } from '../../../../theme/themeContext';
import styles from './CustomModal.module.scss';

interface Props {
  isOpen: boolean;
  onClick1: () => void;
  onClick2: () => void;
  buttonTitle: string;
  modalTitle: string;
  modalSubtitle: string;
}

const { useTranslation } = i18next;

export default function CustomModal({
  isOpen,
  onClick1,
  onClick2,
  buttonTitle,
  modalTitle,
  modalSubtitle,
}: Props) {
  const { t } = useTranslation(['common']);
  const { theme } = React.useContext(ThemeContext);
  return (
    <Modal open={isOpen} hideBackdrop className={'modalContainer'}>
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
            onClick={onClick1}
          >
            {buttonTitle}
          </button>
          <button
            id={'Cancel'}
            className={styles.cancelButton}
            onClick={onClick2}
          >
            {t('editProfile:cancel')}
          </button>
        </div>
      </div>
    </Modal>
  );
}
