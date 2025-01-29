import type { SetState } from '../../../common/types/common';
import type { ReactNode } from 'react';

import { useTranslations } from 'next-intl';
import { ExploreIcon } from '../../../../../public/assets/images/icons/projectV2/ExploreIcon';
import CrossIcon from '../../../../../public/assets/images/icons/projectV2/CrossIcon';
import styles from './MobileMapSettingsLayout.module.scss';

interface Props {
  setIsOpen: SetState<boolean>;
  children: ReactNode;
}

const MobileMapSettingsLayout = ({ setIsOpen, children }: Props) => {
  const tMaps = useTranslations('Maps');

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.exploreLabel}>
          <ExploreIcon />
          <p>{tMaps('explore')}</p>
        </div>
        <button className={styles.closeButton} onClick={() => setIsOpen(false)}>
          <CrossIcon />
        </button>
      </div>
      <div className={styles.scrollableContent}>{children}</div>
    </div>
  );
};

export default MobileMapSettingsLayout;
