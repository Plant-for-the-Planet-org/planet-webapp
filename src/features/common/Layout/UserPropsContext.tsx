import { useAuth0 } from '@auth0/auth0-react';
import { useRouter } from 'next/router';
import React, { FC, useContext, useMemo } from 'react';
import { getAccountInfo } from '../../../utils/apiRequests/api';
import { User } from '../types/user';
import { SetState } from '../types/common';

interface UserPropsContextInterface {
  contextLoaded: boolean;
  setContextLoaded: SetState<boolean>;
  token: string | null;
  setToken: SetState<string | null>;
  user: boolean | User | null;
  setUser: SetState<boolean | User | null>;
  userLang: string;
  setUserLang: SetState<string>;
  isImpersonationModeOn: boolean;
  setIsImpersonationModeOn: SetState<boolean>;
  impersonatedEmail: string | null;
  setImpersonatedEmail: SetState<string | null>;
  loginWithRedirect: (value: {}) => {};
  logoutUser: (value: string) => void;
}

export const UserPropsContext =
  React.createContext<UserPropsContextInterface | null>(null);

export const UserPropsProvider: FC = ({ children }) => {
  const router = useRouter();
  const {
    isLoading,
    isAuthenticated,
    loginWithRedirect,
    getAccessTokenSilently,
    logout,
    user,
    error,
  } = useAuth0();

  const [contextLoaded, setContextLoaded] = React.useState<boolean>(false);
  const [token, setToken] = React.useState<string | null>(null);
  const [profile, setUser] = React.useState<boolean | User | null>(false);
  const [userLang, setUserLang] = React.useState<string>('en');
  const [isImpersonationModeOn, setIsImpersonationModeOn] =
    React.useState<boolean>(false);
  const [impersonatedEmail, setImpersonatedEmail] = React.useState<
    string | null
  >(null);

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
    impersonatedEmail: string
  ): Promise<User | boolean> => {
    try {
      setContextLoaded(false);
      const res = await getAccountInfo(token, impersonatedEmail);
      const resJson = await res.json();
      if (res.status === 200) {
        setIsImpersonationModeOn(true);
        setImpersonatedEmail(resJson.email);
        localStorage.setItem('impersonatedEmail', resJson.email);
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
        const _impersonatedEmail = localStorage.getItem('impersonatedEmail');
        if (_impersonatedEmail === null) {
          loadUser();
        } else {
          const userData = await impersonateUser(_impersonatedEmail);
          if (userData === false) {
            localStorage.removeItem('impersonatedEmail');
            loadUser();
          }
        }
      }
    };
    checkImpersonation();
  }, [token, isImpersonationModeOn]);

  const value: UserPropsContextInterface | null = useMemo(
    () => ({
      contextLoaded,
      setContextLoaded,
      token,
      setToken,
      user: profile,
      setUser,
      userLang,
      setUserLang,
      isImpersonationModeOn,
      setIsImpersonationModeOn,
      impersonatedEmail,
      setImpersonatedEmail,
      isLoading,
      isAuthenticated,
      loginWithRedirect,
      logoutUser,
      auth0User: user,
      auth0Error: error,
    }),
    [
      contextLoaded,
      token,
      profile,
      userLang,
      isImpersonationModeOn,
      impersonatedEmail,
      isLoading,
      isAuthenticated,
      user,
      error,
    ]
  );
  return (
    <UserPropsContext.Provider value={value}>
      {children}
    </UserPropsContext.Provider>
  );
};

export const useUserProps = (): UserPropsContextInterface => {
  const context = useContext(UserPropsContext);
  if (!context) {
    throw new Error('UserPropsContext must be used within UserPropsProvider ');
  }
  return context;
};
