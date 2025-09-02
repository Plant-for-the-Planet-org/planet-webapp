import type { SetStateAction, Dispatch, ReactNode } from 'react';
import type { SerializedError } from '@planet-sdk/common';

import { createContext, useState } from 'react';
import useLocalizedPath from '../../../hooks/useLocalizedPath';
import { useRouter } from 'next/router';

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

const ErrorHandlingProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const { localizedPath } = useLocalizedPath();
  const [errors, setErrors] = useState<SerializedError[] | null>(null);
  const redirect = (url: string) => {
    router.push(localizedPath(url));
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
