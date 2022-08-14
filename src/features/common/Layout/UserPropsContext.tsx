import { useAuth0 } from '@auth0/auth0-react';
import { App, URLOpenListenerEvent } from '@capacitor/app';
import { Browser } from "@capacitor/browser";
import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';
import { getAccountInfo } from '../../../utils/apiRequests/api';
import { User } from '../types/user';

interface Props {}

export const UserPropsContext = React.createContext({
  user: false || ({} as User) || null,
  setUser: (value: boolean | User | null) => {},
  contextLoaded: false,
  token: null,
  isLoading: true,
  isAuthenticated: false,
  loginWithRedirect: (redirectUri: string | undefined, ui_locales: string | undefined) => {},
  logoutUser: (returnUrl: string | undefined) => {},
  auth0User: {},
  auth0Error: {} || undefined,
});

function UserPropsProvider({ children }: any): ReactElement {
  const {
    isLoading,
    isAuthenticated,
    buildAuthorizeUrl,
    getAccessTokenSilently,
    handleRedirectCallback,
    buildLogoutUrl,
    logout,
    user,
    error,
  } = useAuth0();

  const router = useRouter();
  const [contextLoaded, setContextLoaded] = React.useState(false);
  const [token, setToken] = React.useState<string | null>(null);
  const [profile, setUser] = React.useState<boolean | User | null>(false);

  React.useEffect(() => {
    App.addListener('appUrlOpen', async (event: URLOpenListenerEvent) => {
      // console.log("event.url", event.url)
      // Example url: org.pftp.app://www1.plant-for-the-planet.org/login?code=***&state=***
      //if (event.url.includes('state') && (event.url.includes('code') || event.url.includes('error'))) {
      await handleRedirectCallback(event.url).then(() => {
        const slug = event.url.split('planet.org').pop();
        // console.log("event.slug", slug)
        if (slug && typeof window !== 'undefined') {
            router.push(slug);
        }
      }).catch((error) => {
        // console.error("handleRedirectCallback failed", error)
        setUser(null);
        setToken(null);
        logout({ localOnly: true });
        if (typeof window !== 'undefined') {
          if (error && error.error_description === '401') {
            router.push('/verify-email');
          } else {
            router.push('/');
          }
        }
      });
      //}
      await Browser.close();
    });
  }, [handleRedirectCallback]);

  React.useEffect(() => {
    async function loadToken() {
      const accessToken = await getAccessTokenSilently();
      setToken(accessToken);
    }
    if (!isLoading)
      if (isAuthenticated) loadToken();
      else setContextLoaded(true);
  }, [isLoading, isAuthenticated]);

  const loginWithRedirect = (
    redirectUri: string | undefined = `${process.env.NEXTAUTH_URL}/login`,
    ui_locales: string | undefined = localStorage.getItem('language') || 'en',
  ) => {
    const doLogin = async () => {
      // console.log("redirectUri", redirectUri)
      const url = await buildAuthorizeUrl({
        redirectUri: redirectUri,
        ui_locales: ui_locales,
      });
      await Browser.open({ url, windowName: "_self" });
    }
    doLogin()
  }

  const logoutUser = (
    returnUrl: string | undefined = `${process.env.NEXTAUTH_URL}/`
  ) => {
    setUser(null);
    setToken(null);
    const doLogout = async () => {
      // console.log("returnUrl", returnUrl)
      await Browser.open({
        url: buildLogoutUrl({ returnTo: returnUrl }),
        windowName: "_self",
      });
      logout({ localOnly: true });
    }
    doLogout()
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
        loginWithRedirect(`${process.env.NEXTAUTH_URL}/login`, localStorage.getItem('language') || 'en');
      } else {
        // any other error
      }
    } catch (err) {
      console.log(err);
    }
    setContextLoaded(true);
  }

  React.useEffect(() => {
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
