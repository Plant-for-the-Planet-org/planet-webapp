import React from 'react';
import styles from '../styles/DirectGift.module.scss';
import CancelIcon from '../../../../public/assets/images/icons/CancelIcon';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/router';
import { SetState } from '../../common/types/common';

export interface DirectGiftI {
  id: string;
  displayName: string;
  type: string;
  show: boolean;
}
interface Props {
  directGift: DirectGiftI;
  setShowDirectGift: SetState<boolean>;
}

export default function DirectGift({ directGift, setShowDirectGift }: Props) {
  const router = useRouter();
  const t = useTranslations('Donate');
  const handleProfileRedirect = () => {
    router.push('/t/[id]', `/t/${directGift.id}`);
  };
  return (
    <div className={styles.giftContainer}>
      <div className={styles.textContainer}>
        <div className={styles.giftTo}>
          {directGift.type === 'individual'
            ? t('giftToName')
            : t('plantTreesWith')}{' '}
          <a onClick={handleProfileRedirect}>{directGift.displayName}</a>
        </div>
        <div className={styles.selectProject}>{t('selectProject')}</div>
      </div>
      <button
        id={'giftClose'}
        onClick={() => {
          directGift.show = false;
          localStorage.removeItem('directGift');
          setShowDirectGift(false);
        }}
        className={styles.closeButton}
      >
        <CancelIcon color={styles.primaryFontColor} />
      </button>
    </div>
  );
}
