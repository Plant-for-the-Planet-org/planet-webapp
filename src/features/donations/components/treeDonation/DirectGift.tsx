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
  const { t, ready } = useTranslation(['donate', 'common']);
  return ready ? (
    <div className={styles.giftContainer}>
      <div className={styles.textContainer}>
        <div className={styles.giftTo}>
          {directGift.type === 'individual'
            ? t('donate:giftToName', { name: directGift.displayName })
            : t('donate:plantTreesWith', { name: directGift.displayName })}
        </div>
        <div className={styles.selectProject}>{t('donate:selectProject')}</div>
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
  ) : null;
}
