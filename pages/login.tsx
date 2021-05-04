import React, { ReactElement } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import UserProfileLoader from '../src/features/common/ContentLoaders/UserProfile/UserProfile';
import { useRouter } from 'next/router';
import { UserPropsContext } from '../src/features/common/Layout/UserPropsContext';

interface Props {}

function Login({}: Props): ReactElement {
  const router = useRouter();

  // if the user is authenticated check if we have slug, and if we do, send user to slug
  // else send user to login flow
  const {
    isAuthenticated,
    isLoading,
    loginWithRedirect,
    getAccessTokenSilently,
    logout,
  } = useAuth0();
  const { userprofile } = React.useContext(UserPropsContext);

  React.useEffect(() => {
    async function loadFunction() {
      const token = await getAccessTokenSilently();
      // redirect

      if (typeof window !== 'undefined' && userprofile) {
        if (localStorage.getItem('redirectLink')) {
          const redirectLink = localStorage.getItem('redirectLink');
          if (redirectLink) {
            localStorage.removeItem('redirectLink');
            router.replace(redirectLink);
          }
        } else {
          router.push(`/t/${userprofile.slug}`);
        }
      }
    }
    if (!isLoading && isAuthenticated) {
      loadFunction();
    } else if (!isLoading && !isAuthenticated) {
      loginWithRedirect({
        redirectUri: `${process.env.NEXTAUTH_URL}/login`,
        ui_locales: localStorage.getItem('language') || 'en',
      });
    }
  }, [isAuthenticated, isLoading]);

  return (
    <div>
      <UserProfileLoader />
    </div>
  );
}

export default Login;
