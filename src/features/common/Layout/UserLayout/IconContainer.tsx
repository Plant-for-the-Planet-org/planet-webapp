import type { FC } from 'react';

import styles from './UserLayout.module.scss';

const IconContainer: FC = ({ children }) => {
  return <div className={styles.iconContainer}>{children}</div>;
};

export default IconContainer;
