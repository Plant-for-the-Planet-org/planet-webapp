import type { ReactNode } from 'react';

import styles from './PublicProfileOuterContainer.module.scss';
import { clsx } from 'clsx';
import { useUserStore } from '../../../../stores';

const PublicProfileOuterContainer = ({ children }: { children: ReactNode }) => {
  const isImpersonationModeOn = useUserStore(
    (state) => state.isImpersonationModeOn
  );
  return (
    <main
      className={clsx(styles.mainContainer, {
        [styles.impersonationMode]: isImpersonationModeOn,
      })}
    >
      {children}
    </main>
  );
};

export default PublicProfileOuterContainer;
