import { useRouter } from 'next/router';
import React, {
  createContext,
  SetStateAction,
  useState,
  Dispatch,
  FC,
} from 'react';
import { UserPropsContext } from './UserPropsContext';
import { SerializedError } from '@planet-sdk/common';

type SetState<T> = Dispatch<SetStateAction<T>>;

export interface ErrorInterface {
  type?: 'error' | 'warning' | 'info';
  message: string;
  redirect?: string;
  code?: number;
}

interface ErrorHandlingContextInterface {
  error: ErrorInterface | null;
  setError: SetState<ErrorInterface | null>;
  errors: SerializedError[] | null;
  setErrors: SetState<SerializedError[] | null>;
  handleError: (error: ErrorInterface) => void;
  redirect: (url: string) => void;
}

export const ErrorHandlingContext =
  createContext<ErrorHandlingContextInterface>({
    error: null,
    setError: () => {},
    errors: null,
    setErrors: () => {},
    handleError: () => {},
    redirect: () => {},
  });

const ErrorHandlingProvider: FC = ({ children }) => {
  const [error, setError] = useState<ErrorInterface | null>(null);
  const [errors, setErrors] = useState<SerializedError[] | null>(null);
  const router = useRouter();

  const { setUser, logoutUser, loginWithRedirect } =
    React.useContext(UserPropsContext);

  const redirect = (url: string) => {
    router.push(url);
  };

  const handleError = (error: ErrorInterface) => {
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
        errors,
        setErrors,
        handleError,
        redirect,
      }}
    >
      {children}
    </ErrorHandlingContext.Provider>
  );
};

export default ErrorHandlingProvider;
