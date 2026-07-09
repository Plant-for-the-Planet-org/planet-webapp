import { APIError, handleError } from '@planet-sdk/common';
import { useState } from 'react';
import { useErrorHandlingStore } from '../stores/errorHandlingStore';

export enum HTTP_METHOD {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

interface Result<Data> {
  makeRequest: () => Promise<Data | void>;
  isLoading: boolean;
}

interface Props<Data> {
  url: string;
  method: HTTP_METHOD;
  body?: object;
  onSuccess?: (response: Data) => {};
}

const useNextRequest = <Data>({
  url,
  method = HTTP_METHOD.GET,
  body,
  onSuccess,
}: Props<Data>): Result<Data> => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // store
  const setErrors = useErrorHandlingStore((state) => state.setErrors);

  const makeRequest = async (): Promise<Data | void> => {
    setIsLoading(true);

    try {
      const options = {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: method !== HTTP_METHOD.GET && body ? JSON.stringify(body) : null,
      };

      const res = await fetch(url, options);

      if (!res.ok) {
        throw new APIError(res.status, await res.json());
      }

      const responseData = (await res.json()) as Data;

      if (onSuccess) {
        onSuccess(responseData);
      }

      return responseData;
    } catch (err) {
      setIsLoading(false);
      setErrors(handleError(err as APIError));
    }
    setIsLoading(false);
  };

  return { makeRequest, isLoading };
};

export default useNextRequest;
