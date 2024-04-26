import { useTranslations } from 'next-intl';
import { useRouter } from 'next/router';
import { useUserProps } from '../../UserPropsContext';

export const SignInButton = () => {
  const { user, loginWithRedirect } = useUserProps();
  const router = useRouter();
  const t = useTranslations('Common');
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
  return (
    <button className="signInButton" onClick={() => gotoUserPage()}>
      <p>{t('signIn')}</p>
    </button>
  );
};
export default SignInButton;
