import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';

interface Props {}

export const ErrorHandlingContext = React.createContext({
  error: null,
  setError: () => {},
  handleError: ({}) => {},
});

function ErrorHandlingProvider({ children }: any): ReactElement {
  const [error, setError] = React.useState<{} | null>(null);
  const router = useRouter();

  const handleError = (error: any) => {
    setError(error);
    setTimeout(() => {
      setError(null);
      if (error.redirect) {
        // if (typeof error.redirect === 'string') {
        router.push(error.redirect);
        // } else {
        // router.push('/');
        // }
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
