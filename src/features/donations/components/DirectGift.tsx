import type { SetState } from '../../common/types/common';
import type { DirectGiftType } from '../../../utils/directGift';

import styles from '../styles/DirectGift.module.scss';
import CancelIcon from '../../../../public/assets/images/icons/CancelIcon';
import IconButton from '../../common/IconButton';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import useLocalizedPath from '../../../hooks/useLocalizedPath';
import { clearStoredDirectGift } from '../../../utils/directGift';

interface Props {
  directGift: DirectGiftType;
  setDirectGift: SetState<DirectGiftType | null>;
}

export default function DirectGift({ directGift, setDirectGift }: Props) {
  const t = useTranslations('Donate');
  const tCommon = useTranslations('Common');
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
      <IconButton
        id={'giftClose'}
        label={`${tCommon('close')} ${t('directGift')}`}
        onClick={() => {
          clearStoredDirectGift();
          setDirectGift(null);
        }}
        className={styles.closeButton}
      >
        <CancelIcon />
      </IconButton>
    </div>
  );
}
