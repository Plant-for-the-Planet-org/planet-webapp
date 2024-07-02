import React, { ReactElement } from 'react';
import styles from '../InfoAndCta.module.scss';
import { useTranslations } from 'next-intl';

interface Props {
  title: string;
  icon: ReactElement;
  index: number;
  color: string;
}

const SingleSDGCard = ({ title, icon, index, color }: Props) => {
  const t = useTranslations('Profile');
  return (
    <div
      className={styles.singleSDGCardContainer}
      style={{ background: color }}
    >
      <div>
        <span className={styles.singleCardIndex}>
          {String(index + 1).padStart(2, '0')}
        </span>
        <h3 className={styles.singleCardTitle}>
          {t(`infoAndCtaContainer.sdgCardTitle.${title}`)}
        </h3>
      </div>
      <div className={styles.singleCardIcon}>{icon}</div>
    </div>
  );
};

export default SingleSDGCard;
