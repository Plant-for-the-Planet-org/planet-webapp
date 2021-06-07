import { useAuth0 } from '@auth0/auth0-react';
import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';
import { getAccountInfo } from '../../../utils/apiRequests/api';

interface Props {}

export const UserPropsContext = React.createContext({
  user: false || {} || null,
  setUser: (value: boolean | object | null) => {},
  contextLoaded: false,
  token: null,
  isLoading: true,
  isAuthenticated: false,
  loginWithRedirect: ({}) => {},
  logoutUser: (value: string | undefined) => {},
  auth0User: {},
  auth0Error: {} || undefined,
});

function UserPropsProvider({ children }: any): ReactElement {
  const {
    isLoading,
    isAuthenticated,
    loginWithRedirect,
    getAccessTokenSilently,
    logout,
    user,
    error,
  } = useAuth0();

  const router = useRouter();
  const [contextLoaded, setContextLoaded] = React.useState(false);
  const [token, setToken] = React.useState(null);
  const [profile, setUser] = React.useState<boolean | object | null>(false);

  React.useEffect(() => {
    async function loadToken() {
      const accessToken = await getAccessTokenSilently();
      setToken(accessToken);
    }
    if (!isLoading && isAuthenticated) loadToken();
  }, [isLoading, isAuthenticated]);

  const logoutUser = (
    returnUrl: string | undefined = `${process.env.NEXTAUTH_URL}/`
  ) => {
    setUser(false);
    console.log('returnTo', returnUrl);
    logout({ returnTo: returnUrl });
  };

  React.useEffect(() => {
    console.log('in useeffect');
    async function loadUser() {
      console.log('loading started');
      setContextLoaded(false);
      try {
        const res = await getAccountInfo(token);
        if (res.status === 200) {
          console.log('user found');
          const resJson = await res.json();
          setUser(resJson);
        } else if (res.status === 303) {
          // if 303 -> user doesn not exist in db
          setUser(null);
          console.log('not in db');

          if (typeof window !== 'undefined') {
            console.log('window defined');
            router.push('/complete-signup', undefined, { shallow: true });
          }
        } else if (res.status === 401) {
          // in case of 401 - invalid token: signIn()
          setUser(false);
          setToken(null);
          console.log('invalid token');
          // logoutUser(`${process.env.NEXTAUTH_URL}`);
          loginWithRedirect({
            redirectUri: `${process.env.NEXTAUTH_URL}/login`,
            ui_locales: localStorage.getItem('language') || 'en',
          });
        } else {
          // any other error
        }
      } catch (err) {
        console.log(err);
      }
      setContextLoaded(true);
      console.log('loading complete');
    }
    if (token) loadUser();
  }, [token]);

  return (
    <UserPropsContext.Provider
      value={{
        user: profile,
        setUser,
        contextLoaded,
        token,
        isLoading,
        isAuthenticated,
        loginWithRedirect,
        logoutUser,
        auth0User: user,
        auth0Error: error,
      }}
    >
      {children}
    </UserPropsContext.Provider>
  );
}

export default UserPropsProvider;
