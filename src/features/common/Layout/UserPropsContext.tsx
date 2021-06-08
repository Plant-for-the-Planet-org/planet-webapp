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
    if (!isLoading)
      if (isAuthenticated) loadToken();
      else setContextLoaded(true);
  }, [isLoading, isAuthenticated]);

  const logoutUser = (
    returnUrl: string | undefined = `${process.env.NEXTAUTH_URL}/`
  ) => {
    setUser(false);
    logout({ returnTo: returnUrl });
  };

  React.useEffect(() => {
    async function loadUser() {
      setContextLoaded(false);
      try {
        const res = await getAccountInfo(token);
        if (res.status === 200) {
          const resJson = await res.json();
          setUser(resJson);
        } else if (res.status === 303) {
          // if 303 -> user doesn not exist in db
          setUser(null);
          if (typeof window !== 'undefined') {
            router.push('/complete-signup', undefined, { shallow: true });
          }
        } else if (res.status === 401) {
          // in case of 401 - invalid token: signIn()
          setUser(false);
          setToken(null);
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
