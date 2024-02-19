import {
  useAuth0,
  User as Auth0User,
  RedirectLoginOptions,
} from '@auth0/auth0-react';
import { useRouter } from 'next/router';
import React, { FC, useContext } from 'react';
import { getAccountInfo } from '../../../utils/apiRequests/api';
import { User } from '@planet-sdk/common/build/types/user';
import { SetState } from '../types/common';
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

      const res = await getAccountInfo(tenantConfig?.id, token);
      if (res.status === 200) {
        const resJson = await res.json();
        setUser(resJson as User);
      } else if (res.status === 303) {
        // if 303 -> user doesn not exist in db
        setUser(null);
        if (typeof window !== 'undefined') {
          router.push('/complete-signup', undefined, { shallow: true });
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
    if (localStorage.getItem('impersonationData') !== null) {
      setIsImpersonationModeOn(true);
    }
  }, [isImpersonationModeOn]);

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
