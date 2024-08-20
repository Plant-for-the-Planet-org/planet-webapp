import React, { ReactElement, useContext } from 'react';
import styles from './VerifyEmail.module.scss';
import { useTranslations } from 'next-intl';
import VerifyEmailIcon from '../../../../public/assets/images/icons/VerifyEmail';
import { useUserProps } from '../Layout/UserPropsContext';
import themeProperties from '../../../theme/themeProperties';
import { ThemeContext } from '../../../theme/themeContext';

function VerifyEmailComponent(): ReactElement {
  const t = useTranslations('Common');

  const { loginWithRedirect } = useUserProps();
  const { theme } = useContext(ThemeContext);
  return (
    <div
      className={styles.verifyEmailSection}
      style={{
        backgroundColor:
          theme === 'theme-light'
            ? themeProperties.light.light
            : themeProperties.dark.backgroundColor,
        color:
          theme === 'theme-light'
            ? themeProperties.light.primaryFontColor
            : themeProperties.dark.primaryFontColor,
      }}
    >
      <VerifyEmailIcon />
      <h2 className={styles.verifyEmailText}>{t('verifyEmailHeader')}</h2>
      {t('verifyEmailText')}

      <span style={{ fontStyle: 'italic', marginTop: '12px' }}>
        {t('verifyEmailInfo')}
      </span>
      <button
        id="verifyEmail"
        onClick={() =>
          loginWithRedirect({
            redirectUri: `${window.location.origin}/login`,
            ui_locales: localStorage.getItem('language') || 'en',
          })
        }
        className="primaryButton"
        style={{ marginTop: '10px' }}
      >
        {t('continueToLogin')}
      </button>
    </div>
  );
}

export default VerifyEmailComponent;
