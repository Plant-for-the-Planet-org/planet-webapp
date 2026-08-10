import type { ImpersonationData } from '../../features/user/Settings/ImpersonateUser/ImpersonateUserForm';
/**
 * Sets keys for header in impersonation mode
 */
export const setHeaderForImpersonation = (
  header: Record<string, string>,
  impersonationData?: ImpersonationData
) => {
  let impersonationDataFromLocal: ImpersonationData | undefined;
  try {
    impersonationDataFromLocal = JSON.parse(
      `${localStorage.getItem('impersonationData')}`
    );
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
