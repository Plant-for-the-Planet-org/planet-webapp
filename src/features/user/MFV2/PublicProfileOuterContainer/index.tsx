import { FC } from 'react';
import styles from './PublicProfileOuterContainer.module.scss';
import { useUserProps } from '../../../common/Layout/UserPropsContext';

const PublicProfileOuterContainer: FC = ({ children }) => {
  const { isImpersonationModeOn } = useUserProps();
  return (
    <main
      className={`${styles.mainContainer} ${
        isImpersonationModeOn ? styles.impersonationMode : ''
      }`}
    >
      {children}
    </main>
  );
};

export default PublicProfileOuterContainer;
