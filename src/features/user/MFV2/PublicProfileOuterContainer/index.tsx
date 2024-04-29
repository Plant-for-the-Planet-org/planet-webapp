import { FC } from 'react';
import styles from './PublicProfileOuterContainer.module.scss';

const PublicProfileOuterContainer: FC = ({ children }) => {
  return <main className={styles.mainContainer}>{children}</main>;
};

export default PublicProfileOuterContainer;
