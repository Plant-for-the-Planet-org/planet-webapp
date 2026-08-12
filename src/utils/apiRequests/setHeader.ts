import type { ImpersonationData } from './impersonation';

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
 * Reads 'impersonationData' from localStorage, returning it only if it
 * parses as valid ImpersonationData. Malformed JSON or incomplete data
 * yields undefined.
 */
export const readStoredImpersonationData = (): ImpersonationData | undefined => {
  try {
    const parsed = JSON.parse(`${localStorage.getItem('impersonationData')}`);
    return isValidImpersonationData(parsed) ? parsed : undefined;
  } catch {
    return undefined;
  }
};

/**
 * Sets keys for header in impersonation mode
 */
export const setHeaderForImpersonation = (
  header: Record<string, string>,
  impersonationData?: ImpersonationData
) => {
  const validImpersonationData = isValidImpersonationData(impersonationData)
    ? impersonationData
    : readStoredImpersonationData();

  if (validImpersonationData) {
    header['X-SWITCH-USER'] = validImpersonationData.targetEmail;
    header['X-USER-SUPPORT-PIN'] = validImpersonationData.supportPin;
  }
  return header;
};
