import { Modal } from '@material-ui/core';
import React, { ReactElement } from 'react';
import InfoIcon from '../../../../../public/assets/images/icons/InfoIcon';
import styles from './Stats.module.scss';
import StatsInfoModal from './StatsInfoModal';
import i18next from '../../../../../i18n';
import { localizedAbbreviatedNumber } from '../../../../utils/getFormattedNumber';

interface Props {}

export default function Stats({}: Props): ReactElement {
  const [infoExpanded, setInfoExpanded] = React.useState(null);
  const { useTranslation } = i18next;
  const { t, i18n } = useTranslation(['leaderboard', 'common', 'planet']);
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
          <h2 className={styles.statNumber}>{localizedAbbreviatedNumber(i18n.language, Number(14760000), 2)}</h2>
          <h3 className={styles.statText}>{t('planet:treesDonated')}</h3>
        </div>
        <div className={styles.statCard}>
          <h2 className={styles.statNumber}>{localizedAbbreviatedNumber(i18n.language, Number(63000000), 2)}</h2>
          <h3 className={styles.statText}>{t('planet:plantedByTPO')}</h3>
        </div>
        <div className={styles.statCard}>
          <h2 className={styles.statNumber}>{localizedAbbreviatedNumber(i18n.language, Number(13480000000), 2)}</h2>
          <h3 className={styles.statText}>{t('planet:plantedGlobally')}</h3>
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
            {localizedAbbreviatedNumber(i18n.language, Number(10000000000), 2)}
          </h2>
          <h3 className={styles.statText}>{t('planet:forestLoss')}</h3>
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
