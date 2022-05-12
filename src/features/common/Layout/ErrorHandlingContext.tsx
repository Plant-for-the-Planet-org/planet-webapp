import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';
import { UserPropsContext } from './UserPropsContext';

interface Props {}

export const ErrorHandlingContext = React.createContext({
  error: null,
  setError: () => {},
  handleError: ({}) => {},
});

function ErrorHandlingProvider({ children }: any): ReactElement {
  const [error, setError] = React.useState<{} | null>(null);
  const router = useRouter();
  const { setUser, logoutUser, loginWithRedirect } =
    React.useContext(UserPropsContext);

  const handleError = (error: any) => {
    setError(error);
    setTimeout(() => {
      setError(null);
      if (error.redirect) {
        if (error.code === 401) {
          setUser(false);
          logoutUser(`${process.env.NEXTAUTH_URL}/`);
          loginWithRedirect({
            redirectUri: `${process.env.NEXTAUTH_URL}/login`,
            ui_locales: localStorage.getItem('language') || 'en',
          });
        } else {
          router.push(error.redirect);
        }
      }
    }, 5000);
  };
  return (
    <ErrorHandlingContext.Provider
      value={{
        error,
        setError,
        handleError,
      }}
    >
      {children}
    </ErrorHandlingContext.Provider>
  );
}

export default ErrorHandlingProvider;
