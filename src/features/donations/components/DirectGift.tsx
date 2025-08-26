import type { SetState } from '../../common/types/common';

import React from 'react';
import styles from '../styles/DirectGift.module.scss';
import CancelIcon from '../../../../public/assets/images/icons/CancelIcon';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import useLocalizedPath from '../../../hooks/useLocalizedPath';

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
  const t = useTranslations('Donate');
  const { localizedPath } = useLocalizedPath();
  return (
    <div className={styles.giftContainer}>
      <div className={styles.textContainer}>
        <div className={styles.giftTo}>
          {directGift.type === 'individual'
            ? t('giftToName')
            : t('plantTreesWith')}{' '}
          <Link href={localizedPath(`/t/${directGift.id}`)}>
            {directGift.displayName}
          </Link>
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
        <CancelIcon />
      </button>
    </div>
  );
}
