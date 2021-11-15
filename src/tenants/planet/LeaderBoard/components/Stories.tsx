import React, { ReactElement } from 'react';
import styles from './Stories.module.scss';
import i18next from '../../../../../i18n';
import { lang_path } from '../../../../utils/constants/wpLanguages';

const { useTranslation } = i18next;

interface Props {}

export default function Stories({}: Props): ReactElement {
  const { i18n, t, ready } = useTranslation(['planet']);
  return (
    <>
      {ready ? (
        <div className={styles.wrapper}>
          <div className={styles.container}>
            <a className={styles.storyCard} href={`https://a.plant-for-the-planet.org/${lang_path[i18n.language]}/principles`}>
              <img
                src={'/tenants/planet/images/leaderboard/restoreTrees.svg'}
              />
              <div className={styles.storyContent}>
                <h2>{t('planet:restoreTrees')}</h2>
                <div>
                  <img
                    src={'/tenants/planet/images/leaderboard/mapIcon.svg'}
                  />
                  <p>{t('planet:learnMore')}</p>
                </div>
              </div>
            </a>
            <a className={styles.storyCard} href={`https://a.plant-for-the-planet.org/${lang_path[i18n.language]?lang_path[i18n.language]:'en'}/standards`}>
              <img
                src={'/tenants/planet/images/leaderboard/selectProjects.svg'}
              />
              <div className={styles.storyContent}>
                <h2>{t('planet:selectProjects')}</h2>
                <div>
                  <img src={'/tenants/planet/images/leaderboard/mapIcon.svg'} />
                  <p>{t('planet:learnMore')}</p>
                </div>
              </div>
            </a>
          </div>
        </div>
      ) : null}
    </>
  );
}
