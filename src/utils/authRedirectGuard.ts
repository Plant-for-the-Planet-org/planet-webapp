// Shared brake for the login-redirect loop. Token-acquisition failures
// (useInitializeAuth) and persistent profile 401s (useProfileErrorHandler)
// both funnel through this single counter so either kind of failure - or a
// mix of both - still trips the same limit, instead of each guard resetting
// the other's count.
//
// The count is cleared only on a genuinely healthy authenticated session
// (the profile actually loads), not merely on token acquisition succeeding.
// Clearing on token success alone would let a persistent profile 401 reset
// the counter every time, right before it fails again, so the limit would
// never trip.
//
// Stored in sessionStorage so it survives full-page redirects (loginWithRedirect
// navigates away and back).
const REDIRECT_COUNT_STORAGE_KEY = 'authRedirectCount';
export const MAX_REDIRECT_ATTEMPTS = 3;

// In-memory fallback for contexts where storage access throws (private mode,
// blocked storage). The persistent count is best-effort; what matters is that
// a storage failure never stops the auth flow from redirecting or resolving.
let inMemoryRedirectCount = 0;

const getRedirectCount = (): number => {
  try {
    const stored = Number(sessionStorage.getItem(REDIRECT_COUNT_STORAGE_KEY));
    return Number.isFinite(stored) && stored > 0 ? stored : 0;
  } catch {
    return inMemoryRedirectCount;
  }
};

const setRedirectCount = (count: number): void => {
  inMemoryRedirectCount = count;
  try {
    sessionStorage.setItem(REDIRECT_COUNT_STORAGE_KEY, String(count));
  } catch {
    // Storage blocked; the in-memory value above is the fallback.
  }
};

export const hasExceededRedirectLimit = (): boolean =>
  getRedirectCount() >= MAX_REDIRECT_ATTEMPTS;

export const registerRedirectAttempt = (): void => {
  setRedirectCount(getRedirectCount() + 1);
};

export const clearRedirectCount = (): void => {
  inMemoryRedirectCount = 0;
  try {
    sessionStorage.removeItem(REDIRECT_COUNT_STORAGE_KEY);
  } catch {
    // Storage blocked; the in-memory reset above is the fallback.
  }
};

// Prevents the shared auth-expiry handler from running more than once at the
// same time. Multiple authenticated requests can fail together when a session
// expires, and without this lock each one could clear the session and redirect.
//
// A later call could also overwrite the saved return route with `/login` after
// the first call has already redirected there.
//
// In-memory state is enough because this only needs to cover the short period
// while the first redirect is happening.
let isAuthExpiryHandlingInFlight = false;

// Returns true for the first caller. Any concurrent caller gets false and
// should stop without handling the expiry again.
export const beginAuthExpiryHandling = (): boolean => {
  if (isAuthExpiryHandlingInFlight) return false;
  isAuthExpiryHandlingInFlight = true;
  return true;
};

// Reset after the session becomes valid again so a future expiry can be handled.
export const resetAuthExpiryHandling = (): void => {
  isAuthExpiryHandlingInFlight = false;
};

// Check whether auth expiry is already being handled.
// Page-level redirects should wait to avoid overwriting redirectLink or redirecting twice.
export const isAuthExpiryHandlingActive = (): boolean =>
  isAuthExpiryHandlingInFlight;
