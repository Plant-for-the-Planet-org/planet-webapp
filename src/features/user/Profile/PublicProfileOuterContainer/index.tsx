import type { ReactNode } from 'react';

import styles from './PublicProfileOuterContainer.module.scss';
import { useUserProps } from '../../../common/Layout/UserPropsContext';
import { clsx } from 'clsx';

const PublicProfileOuterContainer = ({ children }: { children: ReactNode }) => {
  const { isImpersonationModeOn } = useUserProps();
  return (
    <main
      className={clsx(
        styles.mainContainer,
        isImpersonationModeOn && styles.impersonationMode
      )}
    >
      {children}
    </main>
  );
};

export default PublicProfileOuterContainer;
