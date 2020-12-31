import React, { ReactElement } from 'react';
import styles from './../../styles/DirectGift.module.scss';
import CancelIcon from '../../../../../public/assets/images/icons/CancelIcon';
import i18next from '../../../../../i18n';
import { useRouter } from 'next/router';

const { useTranslation } = i18next;
interface Props {
  directGift: any;
  setShowDirectGift: Function;
}

export default function DirectGift({ directGift, setShowDirectGift }: Props) {
  const router = useRouter();
  const { t, ready } = useTranslation(['donate', 'common']);
  const handleProfileRedirect = () => {
    router.push('/t/[id]', `/t/${directGift.id}`);
  };
  return ready ? (
    <div className={styles.giftContainer}>
      <div className={styles.textContainer}>
        <div className={styles.giftTo}>
          {directGift.type === 'individual'
            ? t('donate:giftToName')
            : t('donate:plantTreesWith')}{' '}
          <a onClick={handleProfileRedirect}>{directGift.displayName}</a>
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
