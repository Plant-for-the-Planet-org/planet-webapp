import type { ImpersonationData } from '../../features/user/Settings/ImpersonateUser/ImpersonateUserForm';

const isValidImpersonationData = (
  data: unknown
): data is ImpersonationData => {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof (data as ImpersonationData).targetEmail === 'string' &&
    typeof (data as ImpersonationData).supportPin === 'string'
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
    const parsed = JSON.parse(
      `${localStorage.getItem('impersonationData')}`
    );
    impersonationDataFromLocal = isValidImpersonationData(parsed)
      ? parsed
      : undefined;
  } catch {
    impersonationDataFromLocal = undefined;
  }

  const targetEmail =
    impersonationData?.targetEmail || impersonationDataFromLocal?.targetEmail;
  const supportPin =
    impersonationData?.supportPin || impersonationDataFromLocal?.supportPin;

  if (targetEmail) {
    header['X-SWITCH-USER'] = targetEmail;
  }
  if (supportPin) {
    header['X-USER-SUPPORT-PIN'] = supportPin;
  }
  return header;
};
