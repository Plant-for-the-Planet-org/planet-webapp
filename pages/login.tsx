import React, { ReactElement } from 'react';
import UserProfileLoader from '../src/features/common/ContentLoaders/UserProfile/UserProfile';
import { useRouter } from 'next/router';
import { UserPropsContext } from '../src/features/common/Layout/UserPropsContext';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

interface Props {}

function Login({}: Props): ReactElement {
  const router = useRouter();
  const { i18n } = useTranslation();

  // if the user is authenticated check if we have slug, and if we do, send user to slug
  // else send user to login flow

  const { user, contextLoaded, loginWithRedirect } =
    React.useContext(UserPropsContext);

  React.useEffect(() => {
    if (localStorage.getItem('i18nextLng') !== null && i18n) {
      const languageFromLocalStorage: any = localStorage.getItem('i18nextLng');
      i18n.changeLanguage(languageFromLocalStorage);
    }
  }, [i18n]);

  React.useEffect(() => {
    async function loadFunction() {
      // redirect
      if (user) {
        if (localStorage.getItem('redirectLink')) {
          const redirectLink = localStorage.getItem('redirectLink');
          if (redirectLink) {
            localStorage.removeItem('redirectLink');
            router.push(redirectLink);
          }
        } else {
          router.push('/t/[id]', `/t/${user.slug}`, { shallow: true });
        }
      }
    }
    if (contextLoaded) {
      if (user) {
        loadFunction();
      } else if (user === null) {
        // wait for context to redirect to complete signup
      } else {
        loginWithRedirect({
          redirectUri: `${process.env.NEXTAUTH_URL}/login`,
          ui_locales: localStorage.getItem('language') || 'en',
        });
      }
    }
  }, [user, contextLoaded]);

  return (
    <div>
      <UserProfileLoader />
    </div>
  );
}

export default Login;

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(
        locale,
        [
          'bulkCodes',
          'common',
          'country',
          'donate',
          'donation',
          'editProfile',
          'leaderboard',
          'managePay',
          'manageProjects',
          'maps',
          'me',
          'planet',
          'planetcash',
          'redeem',
          'registerTree',
          'tenants',
          'treemapper',
        ],
        null,
        ['en', 'de', 'fr', 'es', 'it', 'pt-BR', 'cs']
      )),
    },
  };
}
