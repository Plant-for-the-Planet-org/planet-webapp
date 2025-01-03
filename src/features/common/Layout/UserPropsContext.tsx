import type {
  User as Auth0User,
  RedirectLoginOptions,
} from '@auth0/auth0-react';
import type { FC } from 'react';
import type { User } from '@planet-sdk/common/build/types/user';
import type { SetState } from '../types/common';

import { useAuth0 } from '@auth0/auth0-react';
import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import { getAccountInfo } from '../../../utils/apiRequests/api';
import { useTenant } from './TenantContext';

interface UserPropsContextInterface {
  contextLoaded: boolean;
  token: string | null;
  user: User | null;
  setUser: SetState<User | null>;
  userLang: string;
  isImpersonationModeOn: boolean;
  setIsImpersonationModeOn: SetState<boolean>;
  isLoading: boolean;
  isAuthenticated: boolean;
  auth0User: Auth0User | undefined;
  auth0Error: Error | undefined;
  loginWithRedirect: (
    options?: RedirectLoginOptions | undefined
  ) => Promise<void>;
  logoutUser: (returnUrl?: string | undefined) => void;
  loadUser: () => Promise<void>;
  refetchUserData: boolean;
  setRefetchUserData: SetState<boolean>;
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
  const { tenantConfig } = useTenant();
  const [contextLoaded, setContextLoaded] = React.useState(false);
  const [token, setToken] = React.useState<string | null>(null);
  const [profile, setUser] = React.useState<User | null>(null);
  const [userLang, setUserLang] = React.useState<string>('en');
  const [isImpersonationModeOn, setIsImpersonationModeOn] =
    React.useState(false);
  const [refetchUserData, setRefetchUserData] = React.useState(false);
  const [redirectCount, setRedirectCount] = React.useState(0);

  React.useEffect(() => {
    if (localStorage.getItem('language')) {
      const userLang = localStorage.getItem('language');
      if (userLang) setUserLang(userLang);
    }
  }, []);

  React.useEffect(() => {
    async function loadToken() {
      try {
        const accessToken = await getAccessTokenSilently();
        setToken(accessToken);
      } catch (error) {
        if (process.env.NODE_ENV === 'development')
          console.error('Error fetching access token:', error);

        if (redirectCount < 3) {
          setRedirectCount((prev) => prev + 1);
          loginWithRedirect({
            redirectUri: `${window.location.origin}/login`,
            ui_locales: localStorage.getItem('language') || 'en',
          });
        } else {
          console.error('Redirect limit reached, unable to authenticate user.');
        }
      }
    }
    if (!isLoading)
      if (isAuthenticated) loadToken();
      else setContextLoaded(true);
  }, [isLoading, isAuthenticated, redirectCount]);

  const logoutUser = (
    returnUrl: string | undefined = `${window.location.origin}/`
  ) => {
    localStorage.removeItem('impersonationData');
    localStorage.removeItem('redirectLink');
    logout({ returnTo: returnUrl });
  };

  async function loadUser() {
    setContextLoaded(false);
    try {
      // TODO: Add error handling after figuring out the nature of getAccountInfo function call with impersonatedEmail

      const res = await getAccountInfo({ tenant: tenantConfig?.id, token });
      if (res.status === 200) {
        const resJson = await res.json();
        setUser(resJson as User);
      } else if (res.status === 303) {
        // if 303 -> user does not exist in db
        setUser(null);
        if (typeof window !== 'undefined') {
          router.push('/complete-signup');
        }
      } else if (res.status === 401) {
        // in case of 401 - invalid token: signIn()
        setUser(null);
        setToken(null);
        loginWithRedirect({
          redirectUri: `${window.location.origin}/login`,
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
  }, [token, refetchUserData]);

  React.useEffect(() => {
    if (
      !isLoading &&
      (user === undefined || error !== undefined || !isAuthenticated)
    ) {
      localStorage.removeItem('impersonationData');
    }
    const impersonationData = localStorage.getItem('impersonationData');
    if (impersonationData !== null && !isImpersonationModeOn) {
      setIsImpersonationModeOn(true);
    } else if (impersonationData === null && isImpersonationModeOn) {
      setIsImpersonationModeOn(false);
    }
  }, [user, isLoading, error, isAuthenticated]);

  const value: UserPropsContextInterface | null = {
    contextLoaded,
    token,
    user: profile,
    setUser,
    userLang,
    isImpersonationModeOn,
    setIsImpersonationModeOn,
    isLoading,
    isAuthenticated,
    loginWithRedirect,
    logoutUser,
    auth0User: user,
    auth0Error: error,
    loadUser,
    refetchUserData,
    setRefetchUserData,
  };
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
