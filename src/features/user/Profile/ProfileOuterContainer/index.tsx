import type { FC } from 'react';

import styles from './ProfileOuterContainer.module.scss';

const ProfileOuterContainer: FC = ({ children }) => {
  return <main className={styles.mainContainer}>{children}</main>;
};

export default ProfileOuterContainer;
