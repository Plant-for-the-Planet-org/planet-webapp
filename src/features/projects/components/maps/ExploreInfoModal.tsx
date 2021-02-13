import React, { ReactElement } from 'react'
import styles from '../../styles/MapboxMap.module.scss';
import i18next from '../../../../../i18n';
import OpenLink from '../../../../../public/assets/images/icons/OpenLink';
import CancelIcon from '../../../../../public/assets/images/icons/CancelIcon';

const { useTranslation } = i18next;

interface Props {
    infoRef:any;
    infoExpanded:any;
    setInfoExpanded:Function;
    setModalOpen:Function;
}

function ExploreInfoModal({infoRef,infoExpanded,setInfoExpanded,setModalOpen}: Props): ReactElement {
    const { t, i18n, ready } = useTranslation(['maps']);

    return ready ? (
        <div ref={infoRef} className={styles.infoExpanded}>
            {infoExpanded === 'Forests' ? (
              <div className={styles.infoContainer}>
                <div className={styles.infoTitle}>{t('maps:forests')}</div>
                <div className={styles.infoContent}>
                  <div className={styles.currentForestScale}>
                    <p>{t('maps:low')}</p>
                    <div></div>
                    <p>{t('maps:high')}</p>
                  </div>
                  <p>{t('maps:forestInfo')}</p>
                  <a
                    href="https://www.nature.com/articles/nature14967"
                    target="_blank" rel="noopener noreferrer"
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
            {infoExpanded === 'Restoration' ? (
              <div className={styles.infoContainer}>
                <div className={styles.infoTitle}>{t('maps:restoration')}</div>
                <div className={styles.infoContent}>
                  <div className={styles.reforestationScale}>
                    <p>{t('maps:low')}</p>
                    <div></div>
                    <p>{t('maps:high')}</p>
                  </div>
                  <p>{t('maps:restorationInfo')}</p>
                  <a
                    href="https://science.sciencemag.org/content/365/6448/76"
                    target="_blank" rel="noopener noreferrer"
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
                <div className={styles.infoTitle}>
                  {t('maps:deforestation')}
                </div>
                <div className={styles.infoContent}>
                  <a
                    href="https://data.globalforestwatch.org/datasets/63f9425c45404c36a23495ed7bef1314"
                    target="_blank" rel="noopener noreferrer"
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
            <button id={'exploreClose'}
              onClick={() => {
                setInfoExpanded(null);
                setModalOpen(false);
              }}
              className={styles.infoClose}
            >
              <CancelIcon color="#d5d5d5" />
            </button>
          </div>
    ) : <></>;
}

export default ExploreInfoModal
