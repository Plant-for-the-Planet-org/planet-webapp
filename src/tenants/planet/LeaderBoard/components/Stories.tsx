import React, { ReactElement } from 'react';
import styles from './Stories.module.scss';
import { useTranslation } from 'next-i18next';
import { lang_path } from '../../../../utils/constants/wpLanguages';

interface Props {}

export default function Stories({}: Props): ReactElement {
  const { i18n, t, ready } = useTranslation(['planet']);
  return (
    <>
      {ready ? (
        <div className={styles.wrapper}>
          <div className={styles.container}>
            <a
              className={styles.storyCard}
              href={`https://a.plant-for-the-planet.org/${
                lang_path[i18n.language] ? lang_path[i18n.language] : 'en'
              }/principles`}
            >
              <img
                src={'/tenants/planet/images/leaderboard/restoreTrees.svg'}
              />
              <div className={styles.storyContent}>
                <h2>{t('planet:restoreTrees')}</h2>
                <div>
                  <p>{t('planet:learnMore')}</p>
                  <img
                    src={'/tenants/planet/images/leaderboard/arrow-right.svg'}
                  />
                </div>
              </div>
            </a>
            <a
              className={styles.storyCard}
              href={`https://a.plant-for-the-planet.org/${
                lang_path[i18n.language] ? lang_path[i18n.language] : 'en'
              }/standards`}
            >
              <img
                src={'/tenants/planet/images/leaderboard/selectProjects.svg'}
              />
              <div className={styles.storyContent}>
                <h2>{t('planet:selectProjects')}</h2>
                <div>
                  <p>{t('planet:learnMore')}</p>
                  <img
                    src={'/tenants/planet/images/leaderboard/arrow-right.svg'}
                  />
                </div>
              </div>
            </a>
          </div>
        </div>
      ) : null}
    </>
  );
}
