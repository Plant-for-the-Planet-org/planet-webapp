import { useTranslations } from 'next-intl';
import WebappButton from '../../../WebappButton';
import { useEffect, useState } from 'react';
import { useMobileDetection } from '../../../../../utils/navbarUtils';
import Me from '../../../../../../public/assets/images/icons/headerIcons/Me';
import styles from '../Navbar.module.scss';
import useLocalizedPath from '../../../../../hooks/useLocalizedPath';
import { useRouter } from 'next/router';
import { useAuthSession } from '../../../../../hooks/useAuthSession';
import { useUserStore } from '../../../../../stores';

export const SignInButton = () => {
  const { loginWithRedirect } = useAuthSession();
  const router = useRouter();
  const { localizedPath } = useLocalizedPath();
  const t = useTranslations('Common');
  //store: state
  const userProfile = useUserStore((state) => state.userProfile);

  const [isMobile, setIsMobile] = useState(
    window !== undefined && window.matchMedia('(max-width: 481px)').matches
  );

  useEffect(() => {
    const maxWidth = '481px';
    const cleanup = useMobileDetection(maxWidth, (isMobile: boolean) => {
      setIsMobile(isMobile);
    });
    return () => {
      if (cleanup) cleanup();
    };
  }, []);

  // This function controls the path for the user when they click on Me
  async function gotoUserPage() {
    if (userProfile) {
      if (typeof window !== 'undefined') {
        router.push(localizedPath('/profile'));
      }
    } else {
      loginWithRedirect({
        redirectUri: `${window.location.origin}/login`,
        ui_locales: localStorage.getItem('language') || 'en',
      });
    }
  }
  return isMobile ? (
    <button
      className={styles.mobileSignInButton}
      type="button"
      onClick={() => gotoUserPage()}
    >
      <Me />
    </button>
  ) : (
    <WebappButton
      text={t('signIn')}
      variant="primary"
      elementType="button"
      onClick={() => gotoUserPage()}
    />
  );
};
export default SignInButton;
