import { useAuth0 } from '@auth0/auth0-react';
import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';
import { getAccountInfo } from '../../../utils/apiRequests/api';

interface Props {}

export const UserPropsContext = React.createContext({
  userprofile: false || {} || null,
  setUserprofile: (value: boolean | object | null) => {},
  isLoaded: false,
  token: null,
});

function UserPropsProvider({ children }: any): ReactElement {
  const {
    isLoading,
    isAuthenticated,
    loginWithRedirect,
    getAccessTokenSilently,
  } = useAuth0();

  const router = useRouter();
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [token, setToken] = React.useState(null);
  const [userprofile, setUserprofile] = React.useState<boolean | object | null>(
    false
  );

  React.useEffect(() => {
    async function loadUserProfile() {
      let token = null;
      if (isAuthenticated) {
        token = await getAccessTokenSilently();
        setToken(token);
      }
      if (token) {
        try {
          const res = await getAccountInfo(token);
          if (res.status === 200) {
            const resJson = await res.json();
            setUserprofile(resJson);
          } else if (res.status === 303) {
            // if 303 -> user doesn not exist in db
            setUserprofile(null);
            if (typeof window !== 'undefined') {
              router.push('/complete-signup');
            }
          } else if (res.status === 401) {
            // in case of 401 - invalid token: signIn()
            setUserprofile(false);
            loginWithRedirect({
              redirectUri: `${process.env.NEXTAUTH_URL}`,
              ui_locales: localStorage.getItem('language') || 'en',
            });
          } else {
            // any other error
          }
        } catch (err) {
          console.log(err);
        }
      }
      setIsLoaded(true);
    }
    if (!isLoading && isAuthenticated) loadUserProfile();
  }, [isLoading, isAuthenticated]);

  return (
    <UserPropsContext.Provider
      value={{
        userprofile,
        setUserprofile,
        isLoaded,
        token,
      }}
    >
      {children}
    </UserPropsContext.Provider>
  );
}

export default UserPropsProvider;
