import type { ReactElement } from 'react';

import styles from './Stories.module.scss';
import { useLocale, useTranslations } from 'next-intl';
import { lang_path } from '../../../../utils/constants/wpLanguages';

export default function Stories(): ReactElement {
  const t = useTranslations('Planet');
  const locale = useLocale();
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <a
          className={styles.storyCard}
          href={`https://www.plant-for-the-planet.org/${
            lang_path[locale] ? lang_path[locale] : 'en'
          }/principles`}
        >
          <img src={'/tenants/planet/images/leaderboard/restoreTrees.svg'} />
          <div className={styles.storyContent}>
            <h2>{t('restoreTrees')}</h2>
            <div>
              <p>{t('learnMore')}</p>
              <img src={'/tenants/planet/images/leaderboard/arrow-right.svg'} />
            </div>
          </div>
        </a>
        <a
          className={styles.storyCard}
          href={`https://www.plant-for-the-planet.org/${
            lang_path[locale] ? lang_path[locale] : 'en'
          }/standards`}
        >
          <img src={'/tenants/planet/images/leaderboard/selectProjects.svg'} />
          <div className={styles.storyContent}>
            <h2>{t('selectProjects')}</h2>
            <div>
              <p>{t('learnMore')}</p>
              <img src={'/tenants/planet/images/leaderboard/arrow-right.svg'} />
            </div>
          </div>
        </a>
      </div>
    </div>
  );
}
