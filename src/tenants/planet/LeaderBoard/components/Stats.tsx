import { Modal } from '@material-ui/core';
import React, { ReactElement } from 'react';
import InfoIcon from '../../../../../public/assets/images/icons/InfoIcon';
import styles from './Stats.module.scss';
import StatsInfoModal from './StatsInfoModal';

interface Props {}

export default function Stats({}: Props): ReactElement {
  const [infoExpanded, setInfoExpanded] = React.useState(null);

  const [openModal, setModalOpen] = React.useState(false);
  const handleModalClose = () => {
    setModalOpen(false);
  };
  const handleModalOpen = () => {
    setModalOpen(true);
  };
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.statCard}>
          <h2 className={styles.statNumber}>2.34m</h2>
          <h3 className={styles.statText}>Trees donated since 2019</h3>
        </div>
        <div className={styles.statCard}>
          <h2 className={styles.statNumber}>213m</h2>
          <h3 className={styles.statText}>
            Planted by the 101 participating organisations
          </h3>
        </div>
        <div className={styles.statCard}>
          <h2 className={styles.statNumber}>13.48b</h2>
          <h3 className={styles.statText}>Trees planted globally since 2006</h3>
          <div
            onClick={() => {
              setInfoExpanded('global');
              setModalOpen(true);
            }}
            className={styles.statInfo}
          >
            <InfoIcon />
          </div>
        </div>
        <div className={styles.statCard}>
          <h2 className={styles.statNumber} style={{ color: '#E86F56' }}>
            10b
          </h2>
          <h3 className={styles.statText}>
            Net forest loss in the past 12 months{' '}
          </h3>
          <div
            onClick={() => {
              setInfoExpanded('loss');
              setModalOpen(true);
            }}
            className={styles.statInfo}
          >
            <InfoIcon />
          </div>
        </div>
      </div>
      {infoExpanded !== null ? (
        <Modal
          className={styles.modal}
          open={openModal}
          onClose={handleModalClose}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >
          <StatsInfoModal
            infoExpanded={infoExpanded}
            setInfoExpanded={setInfoExpanded}
            setModalOpen={setModalOpen}
          />
        </Modal>
      ) : null}
    </div>
  );
}
