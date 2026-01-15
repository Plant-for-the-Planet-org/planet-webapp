import type { APIError } from '@planet-sdk/common';

import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { useAuthStore } from '../stores';
import { useAuth0 } from '@auth0/auth0-react';
import useLocalizedPath from './useLocalizedPath';

const useProfileErrorHandler = () => {
  const router = useRouter();
  const { loginWithRedirect } = useAuth0();
  const { localizedPath } = useLocalizedPath();
  // store: action
  const setToken = useAuthStore((state) => state.setToken);

  const handleProfileError = useCallback(
    (err: APIError) => {
      switch (err.statusCode) {
        case 303:
          router.push(localizedPath('/complete-signup'));
          break;

        case 401:
          setToken(null);
          loginWithRedirect({
            redirectUri: `${window.location.origin}/login`,
            ui_locales: localStorage.getItem('language') || 'en',
          });
          break;

        case 403:
          localStorage.removeItem('impersonationData');
          break;

        case 500:
          console.error('[Profile API] Internal Server Error:', err.message);
          break;

        default:
          console.error('[Profile API] Error:', err.message);
          break;
      }
    },
    [router, loginWithRedirect, localizedPath]
  );

  return { handleProfileError };
};

export default useProfileErrorHandler;
