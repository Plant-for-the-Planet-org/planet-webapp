import { useAuth0 } from '@auth0/auth0-react';
import { useRouter } from 'next/router';
import React, { FC, useContext } from 'react';
import { getAccountInfo } from '../../../utils/apiRequests/api';
import { User } from '@planet-sdk/common/build/types/user';
import { SetState } from '../types/common';

interface Auth0User {
  email: string;
  email_verified: boolean;
  name: string;
  nickname: string;
  picture: string;
  sub: string;
  updated_at: string;
}
interface UserPropsContextInterface {
  contextLoaded: boolean;
  setContextLoaded: SetState<boolean>;
  token: string | null;
  setToken: SetState<string | null>;
  user: User | undefined;
  setUser: SetState<User | undefined>;
  userLang: string;
  setUserLang: SetState<string>;
  isImpersonationModeOn: boolean;
  setIsImpersonationModeOn: SetState<boolean>;
  isLoading: boolean;
  isAuthenticated: boolean;
  auth0User: Auth0User;
  auth0Error: Error | undefined;
  loginWithRedirect: (value: any) => Promise<void>;
  logoutUser: (value?: string | undefined) => void;
  loadUser: () => Promise<void>;
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
  const [profile, setUser] = React.useState<User | undefined>(undefined);
  const [userLang, setUserLang] = React.useState<string>('en');
  const [isImpersonationModeOn, setIsImpersonationModeOn] =
    React.useState<boolean>(false);

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
      // TODO: Add error handling after figuring out the nature of getAccountInfo function call with impersonatedEmail

      const res = await getAccountInfo(token);
      if (res.status === 200) {
        const resJson = await res.json();
        setUser(resJson);
      } else if (res.status === 303) {
        // if 303 -> user doesn not exist in db
        setUser(undefined);
        if (typeof window !== 'undefined') {
          router.push('/complete-signup', undefined, { shallow: true });
        }
      } else if (res.status === 401) {
        // in case of 401 - invalid token: signIn()
        setUser(undefined);
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

  const value: UserPropsContextInterface | null = {
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
    isLoading,
    isAuthenticated,
    loginWithRedirect,
    logoutUser,
    auth0User: user,
    auth0Error: error,
    loadUser,
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
