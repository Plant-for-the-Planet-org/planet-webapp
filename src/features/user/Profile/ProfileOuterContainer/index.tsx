import type { ReactNode } from 'react';

import styles from './ProfileOuterContainer.module.scss';

const ProfileOuterContainer = ({ children }: { children: ReactNode }) => {
  return <main className={styles.mainContainer}>{children}</main>;
};

export default ProfileOuterContainer;
