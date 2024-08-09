import React from 'react';
import styles from './ProjectInfo.module.scss';

interface Props {
  children: React.JSX.Element;
}

const DownloadsLabel = ({ children }: Props) => {
  return <div className={styles.downloadLabel}>{children}</div>;
};

export default DownloadsLabel;
