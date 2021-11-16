import React, { ReactElement } from 'react';

interface Props {}

export const ErrorHandlingContext = React.createContext({
    error: null,
    setError: ({}) => {},
});

function ErrorHandlingProvider({ children }: any): ReactElement {
    const [error, setError] = React.useState<{}|null>(null);
  return (
    <ErrorHandlingContext.Provider
      value={{
        error,
        setError,
      }}
    >
      {children}
    </ErrorHandlingContext.Provider>
  );
}

export default ErrorHandlingProvider;
