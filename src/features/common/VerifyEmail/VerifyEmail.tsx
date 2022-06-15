import React, { ReactElement } from 'react';
import styles from './VerifyEmail.module.scss';
import i18next from './../../../../i18n';
import VerifyEmailIcon from '../../../../public/assets/images/icons/VerifyEmail';
import { UserPropsContext } from '../Layout/UserPropsContext';
import themeProperties from '../../../theme/themeProperties';
import { ThemeContext } from '../../../theme/themeContext';
const { useTranslation } = i18next;

interface Props {}

function VerifyEmailComponent({}: Props): ReactElement {
  const { t, ready } = useTranslation(['common']);

  const { loginWithRedirect } = React.useContext(UserPropsContext);
  const { theme } = React.useContext(ThemeContext);
  return ready ? (
    <div className={styles.verifyEmailSection} 
    style={{
      backgroundColor: theme === 'theme-light' ? 
                       themeProperties.light.light : 
                       themeProperties.dark.backgroundColor,
      color: theme === 'theme-light' ? 
      themeProperties.light.primaryFontColor : 
      themeProperties.dark.primaryFontColor,}}
      >
      <VerifyEmailIcon />
      <h2 className={styles.verifyEmailText}>
        {t('common:verifyEmailHeader')}
      </h2>
      {t('common:verifyEmailText')}

      <span style={{ fontStyle: 'italic', marginTop: '12px' }}>
        {t('common:verifyEmailInfo')}
      </span>
      <button
        id={'verifyEmail'}
        onClick={() =>
          loginWithRedirect({
            redirectUri: `${process.env.NEXTAUTH_URL}/login`,
            ui_locales: localStorage.getItem('language') || 'en',
          })
        }
        className={'primaryButton'} style={{marginTop: '10px'}}
      >
        {t('common:continueToLogin')}
      </button>
    </div>
  ) : (
    <></>
  );
}

export default VerifyEmailComponent;
