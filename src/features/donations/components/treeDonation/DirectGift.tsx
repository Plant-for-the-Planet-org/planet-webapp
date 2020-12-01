import React, { ReactElement } from 'react';
import styles from './../../styles/DirectGift.module.scss';
import CancelIcon from '../../../../../public/assets/images/icons/CancelIcon';
import i18next from '../../../../../i18n';

const { useTranslation } = i18next;
interface Props {
  directGift: any;
  setShowDirectGift: Function;
}

export default function DirectGift({
  directGift,
  setShowDirectGift,
}: Props): ReactElement {
  const { t } = useTranslation(['donate', 'common']);
  return (
    <div className={styles.giftContainer}>
      <div className={styles.textContainer}>
        <div className={styles.giftTo}>
          {t('donate:giftToName', { name: directGift.displayName })}
        </div>
        <div className={styles.selectProject}>{t('donate:plantTrees')}</div>
      </div>
      <div
        onClick={() => {
          directGift.show = false;
          localStorage.setItem('directGift', JSON.stringify(directGift));
          setShowDirectGift(false);
        }}
        className={styles.closeButton}
      >
        <CancelIcon color={styles.primaryFontColor} />
      </div>
    </div>
  );
}
