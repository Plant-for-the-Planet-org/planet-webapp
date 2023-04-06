import { useAuth0 } from '@auth0/auth0-react';
import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';
import { getAccountInfo } from '../../../utils/apiRequests/api';
import { ImpersonationData } from '../../user/Settings/ImpersonateUser/ImpersonateUserForm';
import { User } from '../types/user';

interface Props {}

export const UserPropsContext = React.createContext({
  user: false || ({} as User) || null,
  setUser: (value: boolean | User | null) => {},
  contextLoaded: false,
  token: null,
  isLoading: true,
  isAuthenticated: false,
  loginWithRedirect: ({}) => {},
  logoutUser: (value: string | undefined) => {},
  auth0User: {},
  auth0Error: {} || undefined,
  userLang: 'en',
  isImpersonationModeOn: false,
  setIsImpersonationModeOn: (_value: boolean) => {}, // eslint-disable-line no-unused-vars
  supportPin: '',
  setSupportPin: (_value: string) => {}, // eslint-disable-line no-unused-vars,
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
  const [profile, setUser] = React.useState<boolean | User | null>(false);
  const [userLang, setUserLang] = React.useState('en');
  const [isImpersonationModeOn, setIsImpersonationModeOn] =
    React.useState(false);
  const [supportPin, setSupportPin] = React.useState<string>('');

  React.useEffect(() => {
    if (localStorage.getItem('language')) {
      const userLang = localStorage.getItem('language');
      if (userLang) setUserLang(userLang);
    }
  }, []);

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
    logout({ returnTo: returnUrl });
  };

  async function loadUser() {
    setContextLoaded(false);
    try {
      const res = await getAccountInfo(token);
      if (res.status === 200) {
        const resJson = await res.json();
        setSupportPin(resJson?.supportPin);
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
      } else if (res.status === 403) {
        localStorage.removeItem('impersonationData');
      } else {
        //any other error
      }
    } catch (err) {
      console.log(err);
    }
    setContextLoaded(true);
  }

  React.useEffect(() => {
    if (token) {
      loadUser();
    }
  }, [token]);

  React.useEffect(() => {
    if (localStorage.getItem('impersonationData') !== null) {
      setIsImpersonationModeOn(true);
    }
  }, [isImpersonationModeOn]);

  return (
    <UserPropsContext.Provider
      value={{
        user: profile,
        setUser,
        isImpersonationModeOn,
        setIsImpersonationModeOn,
        supportPin,
        contextLoaded,
        token,
        isLoading,
        loadUser,
        isAuthenticated,
        loginWithRedirect,
        logoutUser,
        auth0User: user,
        auth0Error: error,
        userLang,
      }}
    >
      {children}
    </UserPropsContext.Provider>
  );
}

export default UserPropsProvider;
