import { useTranslations } from 'next-intl';
import CancelIcon from '../../../../../public/assets/images/icons/CancelIcon';
import styles from '../CompleteSignup.module.scss';
import themeProperties from '../../../../theme/themeProperties';
import { useAuthSession } from '../../../../hooks/useAuthSession';

const SignupHeader = () => {
  const tSignup = useTranslations('EditProfile');
  const { logoutUser } = useAuthSession();
  return (
    <div className={styles.header}>
      <div
        onClick={() => logoutUser(`${window.location.origin}/`)}
        className={styles.headerBackIcon}
      >
        <CancelIcon color={themeProperties.designSystem.colors.coreText} />
      </div>
      <div className={styles.headerTitle}>{tSignup('signUpText')}</div>
    </div>
  );
};

export default SignupHeader;
