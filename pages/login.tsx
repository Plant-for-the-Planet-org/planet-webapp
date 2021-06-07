import React, { ReactElement } from 'react';
import UserProfileLoader from '../src/features/common/ContentLoaders/UserProfile/UserProfile';
import { useRouter } from 'next/router';
import { UserPropsContext } from '../src/features/common/Layout/UserPropsContext';

interface Props {}

function Login({}: Props): ReactElement {
  const router = useRouter();

  // if the user is authenticated check if we have slug, and if we do, send user to slug
  // else send user to login flow

  const { user, contextLoaded, loginWithRedirect } = React.useContext(
    UserPropsContext
  );

  React.useEffect(() => {
    async function loadFunction() {
      // redirect
      console.log('loading started');
      if (user) {
        console.log('user found');
        if (localStorage.getItem('redirectLink')) {
          const redirectLink = localStorage.getItem('redirectLink');
          if (redirectLink) {
            console.log('redirectLink found');
            localStorage.removeItem('redirectLink');
            router.push(redirectLink);
          }
        } else {
          console.log('redirectLink not found');
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
        console.log('not authenticated');
        loginWithRedirect({
          redirectUri: `${process.env.NEXTAUTH_URL}/login`,
          ui_locales: localStorage.getItem('language') || 'en',
        });
      }
    }
    console.log('context', contextLoaded);
  }, [user, contextLoaded]);

  return (
    <div>
      <UserProfileLoader />
    </div>
  );
}

export default Login;
