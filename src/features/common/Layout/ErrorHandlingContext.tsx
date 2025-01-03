import type { SetStateAction, Dispatch, FC } from 'react';
import type { SerializedError } from '@planet-sdk/common';

import { useRouter } from 'next/router';
import React, { createContext, useState } from 'react';

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
  const router = useRouter();

  const redirect = (url: string) => {
    router.push(url);
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
