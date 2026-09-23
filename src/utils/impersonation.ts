/**
 * Credentials that identify an impersonation session. Kept in localStorage
 * under IMPERSONATION_STORAGE_KEY and sent as request headers by
 * setHeaderForImpersonation.
 */
export type ImpersonationData = {
  targetEmail: string;
  supportPin: string;
};

const IMPERSONATION_STORAGE_KEY = 'impersonationData';

export const isValidImpersonationData = (
  data: unknown
): data is ImpersonationData => {
  if (typeof data !== 'object' || data === null) return false;
  const { targetEmail, supportPin } = data as Partial<ImpersonationData>;
  return (
    typeof targetEmail === 'string' &&
    targetEmail !== '' &&
    typeof supportPin === 'string' &&
    supportPin !== ''
  );
};

/**
 * Reads IMPERSONATION_STORAGE_KEY from localStorage, returning it only if it
 * parses as valid ImpersonationData. Malformed JSON or incomplete data
 * yields undefined.
 */
export const readStoredImpersonationData = ():
  | ImpersonationData
  | undefined => {
  try {
    const parsed = JSON.parse(
      `${localStorage.getItem(IMPERSONATION_STORAGE_KEY)}`
    );
    return isValidImpersonationData(parsed) ? parsed : undefined;
  } catch {
    return undefined;
  }
};

/**
 * Starts an impersonation session by writing the credentials to localStorage.
 */
export const storeImpersonationData = (data: ImpersonationData): void => {
  localStorage.setItem(IMPERSONATION_STORAGE_KEY, JSON.stringify(data));
};

/**
 * Ends an impersonation session by removing the stored credentials.
 */
export const clearImpersonationData = (): void => {
  localStorage.removeItem(IMPERSONATION_STORAGE_KEY);
};
