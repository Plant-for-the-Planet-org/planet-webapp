import type {
  User as Auth0User,
  RedirectLoginOptions,
} from '@auth0/auth0-react';
import type { FC } from 'react';
import type { User } from '@planet-sdk/common/build/types/user';
import type { SetState } from '../types/common';
import type { ImpersonationData } from '../../../utils/apiRequests/impersonation';

import { useAuth0 } from '@auth0/auth0-react';
import { useRouter } from 'next/router';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useTenant } from './TenantContext';
import { useLocale } from 'next-intl';
import getsessionId from '../../../utils/apiRequests/getSessionId';
import { setHeaderForImpersonation } from '../../../utils/apiRequests/setHeader';
import { APIError } from '@planet-sdk/common';
import getLocalizedPath from '../../../utils/localizedPath';

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
  fetchUserProfile: (impersonationData?: ImpersonationData) => Promise<User>;
}

export const UserPropsContext = createContext<UserPropsContextInterface | null>(
  null
);

export const UserPropsProvider: FC = ({ children }) => {
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
  const locale = useLocale();
  const { tenantConfig } = useTenant();
  const [contextLoaded, setContextLoaded] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [profile, setUser] = useState<User | null>(null);
  const [userLang, setUserLang] = useState<string>('en');
  const [isImpersonationModeOn, setIsImpersonationModeOn] = useState(false);
  const [refetchUserData, setRefetchUserData] = useState(false);
  const [redirectCount, setRedirectCount] = useState(0);

  useEffect(() => {
    if (localStorage.getItem('language')) {
      const userLang = localStorage.getItem('language');
      if (userLang) setUserLang(userLang);
    }
  }, []);

  useEffect(() => {
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
    sessionStorage.removeItem('donationReceiptContext');
    logout({ returnTo: returnUrl });
  };

  const fetchUserProfile = useCallback(
    async (impersonationData?: ImpersonationData): Promise<User> => {
      if (!process.env.API_ENDPOINT) {
        throw new Error(
          'API_ENDPOINT is not defined in the environment variables.'
        );
      }
      const sessionId = await getsessionId();
      const header = {
        'tenant-key': `${tenantConfig.id}`,
        'X-SESSION-ID': sessionId,
        Authorization: `Bearer ${token}`,
        'x-locale': locale,
      };

      const response = await fetch(`${process.env.API_ENDPOINT}/app/profile`, {
        method: 'GET',
        headers: setHeaderForImpersonation(header, impersonationData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new APIError(response.status, errorData);
      }
      return await response.json();
    },
    [token, tenantConfig.id, locale]
  );

  async function loadUser() {
    setContextLoaded(false);
    try {
      const res = await fetchUserProfile();
      setUser(res);
    } catch (err) {
      if (err instanceof APIError) {
        switch (err.statusCode) {
          case 303:
            setUser(null);
            router.push(getLocalizedPath('/complete-signup', locale));
            break;
          case 401:
            setUser(null);
            setToken(null);
            loginWithRedirect({
              redirectUri: `${window.location.origin}/login`,
              ui_locales: localStorage.getItem('language') || 'en',
            });
            break;
          case 403:
            localStorage.removeItem('impersonationData');
            break;
          case 500:
            console.error('Internal Server Error:', err.message);
            break;
          default:
            console.error('API error:', err.message);
            break;
        }
      } else {
        console.error('Unexpected error:', err);
      }
    }
    setContextLoaded(true);
  }

  useEffect(() => {
    if (token) {
      loadUser();
    }
  }, [token, refetchUserData]);

  useEffect(() => {
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
    fetchUserProfile,
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
