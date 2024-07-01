import React, { ReactElement, RefObject } from 'react';
import styles from '../../styles/ProjectsMap.module.scss';
import { useTranslations } from 'next-intl';
import OpenLink from '../../../../../public/assets/images/icons/OpenLink';
import CancelIcon from '../../../../../public/assets/images/icons/CancelIcon';
import { ExploreOption } from '../../../common/types/ProjectPropsContextInterface';
import { SetState } from '../../../common/types/common';

interface Props {
  infoRef: RefObject<HTMLDivElement>;
  infoExpanded: ExploreOption;
  setInfoExpanded: SetState<ExploreOption | null>;
  setModalOpen: SetState<boolean>;
}

function ExploreInfoModal({
  infoRef,
  infoExpanded,
  setInfoExpanded,
  setModalOpen,
}: Props): ReactElement {
  const t = useTranslations('Maps');

  return (
    <div ref={infoRef} className={styles.infoExpanded}>
      {infoExpanded === 'Forests' ? (
        <div className={styles.infoContainer}>
          <div className={styles.infoTitle}>{t('forests')}</div>
          <div className={styles.infoContent}>
            <div className={styles.currentForestScale}>
              <p>{t('low')}</p>
              <div></div>
              <p>{t('high')}</p>
            </div>
            <p className={styles.forestInfo}>{t('forestInfo')}</p>
            <a
              href="https://www.nature.com/articles/nature14967"
              target="_blank"
              rel="noopener noreferrer"
              style={{ paddingTop: 20 }}
              className={styles.openLink}
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
      {infoExpanded === 'Restoration' ? (
        <div className={styles.infoContainer}>
          <div className={styles.infoTitle}>{t('restoration')}</div>
          <div className={styles.infoContent}>
            <div className={styles.reforestationScale}>
              <p>{t('low')}</p>
              <div></div>
              <p>{t('high')}</p>
            </div>
            <p className={styles.restorationInfo}>{t('restorationInfo')}</p>
            <a
              href="https://science.sciencemag.org/content/365/6448/76"
              target="_blank"
              rel="noopener noreferrer"
              style={{ paddingTop: 20 }}
            >
              <OpenLink />
              <p>
                Bastin, J. F. et al. (2019) The Global Tree
                <br /> Restoration Potential. Science 365(6448), 76-79.
              </p>
            </a>
          </div>
        </div>
      ) : null}
      {infoExpanded === 'Deforestation' ? (
        <div className={styles.infoContainer}>
          <div className={styles.infoTitle}>{t('deforestation')}</div>
          <div className={styles.infoContent}>
            <a
              href="https://data.globalforestwatch.org/datasets/63f9425c45404c36a23495ed7bef1314"
              target="_blank"
              rel="noopener noreferrer"
              style={{ paddingTop: 20 }}
            >
              <OpenLink />
              <p>
                Global Forest Watch
                <br />
                globalforestwatch.org
              </p>
            </a>
          </div>
        </div>
      ) : null}
      {infoExpanded === 'Planted' ? (
        <div className={styles.infoContainer}>
          <div className={styles.infoTitle}>{infoExpanded}</div>
          <div className={styles.infoContent}></div>
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

export default React.forwardRef((props: Props) => (
  <ExploreInfoModal {...props} />
));
