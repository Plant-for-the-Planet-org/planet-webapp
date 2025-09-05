import type { ReactElement } from 'react';

import { forwardRef } from 'react';
import styles from './Stats.module.scss';
import { useTranslations } from 'next-intl';
import OpenLink from '../../../../../public/assets/images/icons/OpenLink';
import CancelIcon from '../../../../../public/assets/images/icons/CancelIcon';

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
  const t = useTranslations('Planet');

  return (
    <div className={styles.infoExpanded}>
      {infoExpanded === 'donated' ? (
        <div className={styles.infoContainer}>
          <div className={styles.infoTitle}>{t('treesDonated')}</div>
          <div style={{ marginTop: '12px' }} className={styles.infoContent}>
            {t('treesDonatedDescription')}
          </div>
        </div>
      ) : null}
      {infoExpanded === 'planted' ? (
        <div className={styles.infoContainer}>
          <div className={styles.infoTitle}>
            {t('plantedByTPO', { projects: 160 })}
          </div>
          <div style={{ marginTop: '12px' }} className={styles.infoContent}>
            {t('treesPlantedDescription')}
          </div>
        </div>
      ) : null}
      {infoExpanded === 'global' ? (
        <div className={styles.infoContainer}>
          <div className={styles.infoTitle}>{t('plantedGlobally')}</div>
          <div style={{ marginTop: '12px' }} className={styles.infoContent}>
            {t('globallySince')}
          </div>
        </div>
      ) : null}
      {infoExpanded === 'loss' ? (
        <div className={styles.infoContainer}>
          <div className={styles.infoTitle}>{t('forestLoss')}</div>
          <div style={{ marginTop: '12px' }} className={styles.infoContent}>
            <p>{t('estimateOf')} </p>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.nature.com/articles/nature14967"
              style={{ paddingTop: 20 }}
            >
              <OpenLink />
              <p>
                Crowther, T. W. et al. (2015) Mapping tree
                <br /> density at a global scale. Nature 525, 201–205.
              </p>
            </a>
          </div>
        </div>
      ) : null}
      <button
        id={'statsInfoModal'}
        onClick={() => {
          setInfoExpanded(null);
          setModalOpen(false);
        }}
        className={styles.infoClose}
      >
        <CancelIcon color="#d5d5d5" />
      </button>
    </div>
  );
}

export default forwardRef((props: Props) => <ExploreInfoModal {...props} />);
