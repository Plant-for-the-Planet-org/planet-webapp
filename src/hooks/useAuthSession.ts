import { useAuth0 } from '@auth0/auth0-react';

export const useAuthSession = () => {
  const {
    isLoading: isAuthLoading,
    isAuthenticated,
    loginWithRedirect,
    getAccessTokenSilently,
    logout: logoutFromAuth0,
    user: auth0User,
    error: auth0Error,
  } = useAuth0();

  const logoutUser = (
    returnUrl: string | undefined = `${window.location.origin}/`
  ) => {
    localStorage.removeItem('impersonationData');
    localStorage.removeItem('redirectLink');
    sessionStorage.removeItem('donationReceiptContext');
    logoutFromAuth0({ returnTo: returnUrl });
  };

  return {
    isAuthLoading,
    isAuthenticated,
    loginWithRedirect,
    getAccessTokenSilently,
    logoutUser,
    auth0User,
    auth0Error,
  };
};
