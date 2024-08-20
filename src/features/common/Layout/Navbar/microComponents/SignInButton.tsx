import { useTranslations } from 'next-intl';
import { useRouter } from 'next/router';
import { useUserProps } from '../../UserPropsContext';
import WebappButton from '../../../WebappButton';
import { useEffect, useState } from 'react';
import { useMobileDetection } from '../../../../../utils/navbarUtils';
import Me from '../../../../../../public/assets/images/icons/headerIcons/Me';

export const SignInButton = () => {
  const { user, loginWithRedirect } = useUserProps();
  const router = useRouter();
  const t = useTranslations('Common');

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
    if (user) {
      if (typeof window !== 'undefined') {
        router.push(`/profile`);
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
      className="mobileSignInButton"
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
