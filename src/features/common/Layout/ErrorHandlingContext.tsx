import type { SetStateAction, Dispatch, FC } from 'react';
import type { SerializedError } from '@planet-sdk/common';

import React, { createContext, useState } from 'react';
import useLocalizedRouter from '../../../hooks/useLocalizedRouter';

type SetState<T> = Dispatch<SetStateAction<T>>;

interface ErrorHandlingContextInterface {
  errors: SerializedError[] | null;
  setErrors: SetState<SerializedError[] | null>;
  redirect: (url: string) => void;
}

export const ErrorHandlingContext =
  createContext<ErrorHandlingContextInterface>({
    errors: null,
    setErrors: () => {},
    redirect: () => {},
  });

const ErrorHandlingProvider: FC = ({ children }) => {
  const [errors, setErrors] = useState<SerializedError[] | null>(null);
  const { push } = useLocalizedRouter();
  const redirect = (url: string) => {
    push(url);
  };

  return (
    <ErrorHandlingContext.Provider
      value={{
        errors,
        setErrors,
        redirect,
      }}
    >
      {children}
    </ErrorHandlingContext.Provider>
  );
};

export default ErrorHandlingProvider;
