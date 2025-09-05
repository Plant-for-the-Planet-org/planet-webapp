import type { ReactNode } from 'react';

import styles from '../../styles/ProjectInfo.module.scss';

interface Props {
  children: ReactNode;
}

const DownloadsLabel = ({ children }: Props) => {
  return <div className={styles.downloadLabel}>{children}</div>;
};

export default DownloadsLabel;
