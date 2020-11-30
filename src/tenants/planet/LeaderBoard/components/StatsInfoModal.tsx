import React, { ReactElement } from 'react';
import styles from './Stats.module.scss';
import i18next from '../../../../../i18n/';
import OpenLink from '../../../../../public/assets/images/icons/OpenLink';
import CancelIcon from '../../../../../public/assets/images/icons/CancelIcon';

const { useTranslation } = i18next;

interface Props {
  infoExpanded: any;
  setInfoExpanded: Function;
  setModalOpen: Function;
}

function ExploreInfoModal({
  infoExpanded,
  setInfoExpanded,
  setModalOpen,
}: Props): ReactElement {
  const { t, i18n } = useTranslation(['maps']);

  return (
    <div className={styles.infoExpanded}>
      {infoExpanded === 'donated' ? (
        <div className={styles.infoContainer}>
          <div className={styles.infoTitle}>{infoExpanded}</div>
          <div className={styles.infoContent}>info</div>
        </div>
      ) : null}
      {infoExpanded === 'planted' ? (
        <div className={styles.infoContainer}>
          <div className={styles.infoTitle}>{infoExpanded}</div>
          <div className={styles.infoContent}>info</div>
        </div>
      ) : null}
      {infoExpanded === 'global' ? (
        <div className={styles.infoContainer}>
          <div className={styles.infoTitle}>{infoExpanded}</div>
          <div className={styles.infoContent}>info</div>
        </div>
      ) : null}
      {infoExpanded === 'loss' ? (
        <div className={styles.infoContainer}>
          <div className={styles.infoTitle}>{infoExpanded}</div>
          <div className={styles.infoContent}>info</div>
        </div>
      ) : null}
      <div
        onClick={() => {
          setInfoExpanded(null);
          setModalOpen(false);
        }}
        className={styles.infoClose}
      >
        <CancelIcon color="#d5d5d5" />
      </div>
    </div>
  );
}

export default ExploreInfoModal;
