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
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();

  const { userprofile, isLoaded } = React.useContext(UserPropsContext);

  React.useEffect(() => {
    async function loadFunction() {
      // redirect
      console.log('loading started');
      if (userprofile) {
        console.log('userprofile found');
        if (localStorage.getItem('redirectLink')) {
          const redirectLink = localStorage.getItem('redirectLink');
          if (redirectLink) {
            console.log('redirectLink found');
            localStorage.removeItem('redirectLink');
            router.replace(redirectLink);
          }
        } else {
          console.log('redirectLink not found');
          router.push('/t/[id]', `/t/${userprofile.slug}`, { shallow: true });
        }
      }
    }
    if (!isLoading && isAuthenticated && isLoaded) {
      loadFunction();
    } else if (!isLoading && !isAuthenticated) {
      console.log('not authenticated');
      loginWithRedirect({
        redirectUri: `${process.env.NEXTAUTH_URL}/login`,
        ui_locales: localStorage.getItem('language') || 'en',
      });
    }
    console.log('nothing', isLoaded);
  }, [isAuthenticated, isLoading, isLoaded]);

  return (
    <div>
      <UserProfileLoader />
    </div>
  );
}

export default Login;
