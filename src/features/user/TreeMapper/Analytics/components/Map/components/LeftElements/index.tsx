import { ReactNode } from 'react';
import styles from './index.module.scss';

interface Props {
  children: ReactNode[];
}

const LeftElements = ({ children }: Props) => {
  return <div className={styles.container}>{children}</div>;
};

export default LeftElements;
