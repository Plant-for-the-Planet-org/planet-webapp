import { Modal } from '@mui/material';
import React, { ReactElement } from 'react';
import InfoIcon from '../../../../../public/assets/images/icons/InfoIcon';
import styles from './Stats.module.scss';
import StatsInfoModal from './StatsInfoModal';
import { useLocale, useTranslations } from 'next-intl';
import { localizedAbbreviatedNumber } from '../../../../utils/getFormattedNumber';
import { ThemeContext } from '../../../../theme/themeContext';
import {
  TenantScore,
  TreesDonated,
} from '../../../../features/common/types/leaderboard';

interface Props {
  tenantScore: TenantScore;
  treesDonated: TreesDonated;
}
export default function Stats({ tenantScore, treesDonated }: Props): ReactElement {
  const [infoExpanded, setInfoExpanded] = React.useState<String | null>(null);
  const tPlanet = useTranslations('Planet');
  const locale = useLocale();
  const [openModal, setModalOpen] = React.useState(false);
  const handleModalClose = () => {
    setModalOpen(false);
  };

  const { theme } = React.useContext(ThemeContext);
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.statCard}>
          <h2 className={styles.statNumber}>
            {localizedAbbreviatedNumber(locale, Number(treesDonated.trees_since_2019), 2)}
          </h2>
          <h3 className={styles.statText}>{tPlanet('treesDonated')}</h3>
          <button
            id={'donatedStats'}
            onClick={() => {
              setInfoExpanded('donated');
              setModalOpen(true);
            }}
            className={styles.statInfo}
          >
            <InfoIcon color="#000" />
          </button>
        </div>
        <div className={styles.statCard}>
          <h2 className={styles.statNumber}>
            {localizedAbbreviatedNumber(locale, Number(tenantScore.total), 2)}
          </h2>
          <h3 className={styles.statText}>{tPlanet('plantedGlobally')}</h3>
          <button
            id={'globalStats'}
            onClick={() => {
              setInfoExpanded('global');
              setModalOpen(true);
            }}
            className={styles.statInfo}
          >
            <InfoIcon color="#000" />
          </button>
        </div>
        <div className={styles.statCard}>
          <h2
            className={styles.statNumber}
            style={{ color: styles.dangerColor }}
          >
            {localizedAbbreviatedNumber(locale, Number(10000000000), 2)}
          </h2>
          <h3 className={styles.statText}>{tPlanet('forestLoss')}</h3>
          <button
            id={'lossStats'}
            onClick={() => {
              setInfoExpanded('loss');
              setModalOpen(true);
            }}
            className={styles.statInfo}
          >
            <InfoIcon color="#000" />
          </button>
        </div>
      </div>
      {infoExpanded !== null ? (
        <Modal
          className={'modalContainer' + ' ' + theme}
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
