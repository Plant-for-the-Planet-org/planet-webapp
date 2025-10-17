import type { ReactNode } from 'react';

import { useContext } from 'react';
import themeProperties from '../../../../theme/themeProperties';
import { ThemeContext } from '../../../../theme/themeContext';
import styles from '../CompleteSignup.module.scss';

interface CompleteSignupLayoutProps {
  children: ReactNode;
  isSubmitting: boolean;
}

const CompleteSignupLayout = ({
  children,
  isSubmitting,
}: CompleteSignupLayoutProps) => {
  const { theme } = useContext(ThemeContext);
  return (
    <div
      className={styles.completeSignup}
      style={{
        backgroundImage: `url(${process.env.CDN_URL}/media/images/app/bg_layer.jpg)`,
      }}
    >
      <div
        className={
          isSubmitting ? styles.signupFormOverlay : styles.signupFormBase
        }
        style={{
          backgroundColor:
            theme === 'theme-light'
              ? themeProperties.designSystem.colors.white
              : themeProperties.dark.backgroundColor,
          color:
            theme === 'theme-light'
              ? themeProperties.designSystem.colors.coreText
              : themeProperties.dark.primaryFontColor,
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default CompleteSignupLayout;
