import React, { ReactElement } from 'react';

interface Props {}

export const ErrorHandlingContext = React.createContext({
    error: null,
    setError: () => {},
    handleError: ({}) => {},
});

function ErrorHandlingProvider({ children }: any): ReactElement {
    const [error, setError] = React.useState<{}|null>(null);
    const handleError = (error: any) => {
        setError(error);
        setTimeout(() => {
            setError(null);
        } , 5000);
    }
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
