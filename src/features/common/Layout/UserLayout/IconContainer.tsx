import type { ReactNode } from 'react';

import styles from './UserLayout.module.scss';

const IconContainer = ({ children }: { children: ReactNode }) => {
  return <div className={styles.iconContainer}>{children}</div>;
};

export default IconContainer;
