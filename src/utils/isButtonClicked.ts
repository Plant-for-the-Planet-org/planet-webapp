import { useEffect, useState } from 'react';

type CallApiFunction = (apiFunction: () => Promise<void>) => Promise<void>;

const useApiCall = (): [CallApiFunction, boolean] => {
  //   useEffect(() => {
  //     return () => {
  //         setIsCallingApi(false);
  //     };
  //   }, []);

  const [isCallingApi, setIsCallingApi] = useState(false);

  const callApi: CallApiFunction = async (apiFunction) => {
    if (!isCallingApi) {
      setIsCallingApi(true);
      // console.log('third', isCallingApi);
      await apiFunction();
      // console.log('forth', isCallingApi);
      setIsCallingApi(false);
    }
  };

  return [callApi, isCallingApi];
};

export default useApiCall;
