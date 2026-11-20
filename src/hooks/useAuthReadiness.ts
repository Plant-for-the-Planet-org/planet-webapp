import { useAuthStore } from '../stores/authStore';
import { useUserStore } from '../stores/userStore';

// Auth is ready for an API call: a token exists and the initial auth check has resolved.
// Distinct from useIsProfileReady - a token can exist before the profile has loaded.
export const useIsAuthReady = (): boolean =>
  useAuthStore((state) => state.token !== null && state.isAuthResolved);

// The profile is ready to read: auth has resolved and the profile has loaded.
// Distinct from useIsAuthReady - do not swap the two, a token alone does not mean the profile is present.
export const useIsProfileReady = (): boolean => {
  const isAuthResolved = useAuthStore((state) => state.isAuthResolved);
  const userProfile = useUserStore((state) => state.userProfile);
  return isAuthResolved && userProfile !== null;
};
