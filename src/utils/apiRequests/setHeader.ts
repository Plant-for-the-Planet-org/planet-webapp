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
 * Sets keys for header in impersonation mode
 */
export const setHeaderForImpersonation = (
  header: Record<string, string>,
  impersonationData?: ImpersonationData
) => {
  let impersonationDataFromLocal: ImpersonationData | undefined;
  try {
    const parsed = JSON.parse(`${localStorage.getItem('impersonationData')}`);
    impersonationDataFromLocal = isValidImpersonationData(parsed)
      ? parsed
      : undefined;
  } catch {
    impersonationDataFromLocal = undefined;
  }

  const validImpersonationData = isValidImpersonationData(impersonationData)
    ? impersonationData
    : impersonationDataFromLocal;

  if (validImpersonationData) {
    header['X-SWITCH-USER'] = validImpersonationData.targetEmail;
    header['X-USER-SUPPORT-PIN'] = validImpersonationData.supportPin;
  }
  return header;
};
