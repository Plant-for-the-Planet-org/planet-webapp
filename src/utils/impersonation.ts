/**
 * Credentials that identify an impersonation session. Kept in localStorage
 * under IMPERSONATION_STORAGE_KEY and sent as request headers by
 * setHeaderForImpersonation.
 */
export type ImpersonationData = {
  targetEmail: string;
  supportPin: string;
};

export const IMPERSONATION_STORAGE_KEY = 'impersonationData';

export const isValidImpersonationData = (
  data: unknown
): data is ImpersonationData => {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof (data as ImpersonationData).targetEmail === 'string' &&
    (data as ImpersonationData).targetEmail !== '' &&
    typeof (data as ImpersonationData).supportPin === 'string' &&
    (data as ImpersonationData).supportPin !== ''
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
