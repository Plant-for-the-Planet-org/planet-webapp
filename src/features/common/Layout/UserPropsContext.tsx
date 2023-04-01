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
  impersonatedData: ({} as ImpersonationData) || null,
  setImpersonatedData: (_value: ImpersonationData | null) => {}, // eslint-disable-line no-unused-vars
  supportPin: '',
  setSupportPin: (_value: string) => {},
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
  const [impersonatedData, setImpersonatedData] =
    React.useState<ImpersonationData | null>(null);
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
      } else {
        // any other error
      }
    } catch (err) {
      console.log(err);
    }
    setContextLoaded(true);
  }
  /**
   * Accepts email and enters impersonation mode
   * @param impersonatedEmail
   * @returns false if impersonation fails and user object if successful
   */
  const impersonateUser = async (
    impersonationData: ImpersonationData
  ): Promise<User | boolean> => {
    try {
      setContextLoaded(false);
      const res = await getAccountInfo(token, impersonationData);
      const resJson = await res.json();
      if (res.status === 200) {
        setIsImpersonationModeOn(true);
        const impersonationData: ImpersonationData = {
          targetEmail: resJson.email,
          supportPin: resJson.supportPin,
        };
        setImpersonatedData(impersonationData);
        localStorage.setItem(
          'impersonationData',
          JSON.stringify(impersonationData)
        );
        setUser(resJson);
        setContextLoaded(true);
        return resJson;
      } else {
        console.log(resJson);
        return false;
      }
    } catch (err) {
      console.log(err);
      return false;
    }
  };

  React.useEffect(() => {
    /**
     * 1. Load user profile if impersonation mode is off and impersonatedEmail is not set in local storage
     * 2. Impersonate user on app reload if impersonatedEmail is set in local storage
     */
    const checkImpersonation = async () => {
      if (token && !isImpersonationModeOn) {
        const _impersonationData: string | null =
          localStorage.getItem('impersonationData');

        const data: ImpersonationData = JSON.parse(_impersonationData);

        if (_impersonationData === null) {
          loadUser();
        } else {
          const userData = await impersonateUser(data);
          if (userData === false) {
            localStorage.removeItem('impersonationData');
            loadUser();
          }
        }
      }
    };
    checkImpersonation();
  }, [token, isImpersonationModeOn]);

  return (
    <UserPropsContext.Provider
      value={{
        user: profile,
        setUser,
        isImpersonationModeOn,
        setIsImpersonationModeOn,
        impersonatedData,
        setImpersonatedData,
        supportPin,
        contextLoaded,
        token,
        isLoading,
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
