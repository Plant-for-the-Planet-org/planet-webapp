import { useAuth0 } from '@auth0/auth0-react';
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
  loginWithRedirect: ({}) => {},
  logoutUser: (value: string | undefined) => {},
  auth0User: {},
  auth0Error: {} || undefined,
  validEmail: '',
  impersonationEmail: '',
  targetEmail: '',
  doNotShowImpersonation: true,
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
  const [validEmail, setValidEmail] = React.useState('');
  const [impersonationEmail, setImpersonationEmail] = React.useState('');
  const [targetEmail, setTargetEmail] = React.useState('');
  const [alertError, setAlertError] = React.useState<boolean>(false);
  const [doNotShowImpersonation, setDoNotShowImpersonation] =
    React.useState<boolean>(true);

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

  const validation = (validEmail, email) => {
    if (validEmail || email) {
      return validEmail || email;
    } else {
      return undefined;
    }
  };

  async function loadUser() {
    setContextLoaded(false);
    try {
      const res = await getAccountInfo(
        token,
        validation(validEmail, impersonationEmail)
      );
      if (res.status === 200) {
        const resJson = await res.json();
        setUser(resJson);
        const firstUser = localStorage.getItem('firstUser');
        const secondUser = localStorage.getItem('secondUser');
        if (resJson?.allowedToSwitch) {
          //this logic  only run if user authorized for doing impersonation
          if (firstUser === null) {
            localStorage.setItem('firstUser', resJson?.email);
          }
        }
        // as first user email will be there in localstorage, and if response contains
        //another email contrary to the first user email then that email would be associated to impersonatee account
        //and store in local storage as second user(valid email)
        if (firstUser && firstUser !== resJson?.email) {
          localStorage.setItem('secondUser', resJson?.email);
          setValidEmail(resJson?.email);
          if (secondUser === null) router.push('/profile');
        }
      } else if (res.status === 403) {
        setAlertError(true);
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

  React.useEffect(() => {
    if (token) loadUser();
  }, [token, validEmail, impersonationEmail]);

  React.useEffect(() => {
    const emailFromLocal = localStorage.getItem('secondUser');
    if (emailFromLocal) {
      setValidEmail(emailFromLocal);
    }
  }, [impersonationEmail, validEmail]);

  React.useEffect(() => {
    const firstUser = localStorage.getItem('firstUser');
    const secondUser = localStorage.getItem('secondUser');
    //this logic is to prevent reverse impersonation (if the second user also has the impersonation authorization)
    if (firstUser) {
      setDoNotShowImpersonation(false);
      if (secondUser) {
        setDoNotShowImpersonation(true);
      }
    } else {
      setDoNotShowImpersonation(true);
    }
  }, [user, doNotShowImpersonation, validEmail]);

  return (
    <UserPropsContext.Provider
      value={{
        alertError,
        setAlertError,
        targetEmail,
        setTargetEmail,
        impersonationEmail,
        setImpersonationEmail,
        doNotShowImpersonation,
        setDoNotShowImpersonation,
        user: profile,
        setUser,
        validEmail,
        setValidEmail,
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
