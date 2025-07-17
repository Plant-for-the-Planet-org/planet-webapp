import type { ImpersonationData } from '../../features/user/Settings/ImpersonateUser/ImpersonateUserForm';
/**
 * Sets keys for header in impersonation mode
 */
export const setHeaderForImpersonation = (header: Record<string, string>) => {
  const impersonationDataFromLocal: ImpersonationData = JSON.parse(
    `${localStorage.getItem('impersonationData')}`
  );
  if (impersonationDataFromLocal) {
    if (impersonationDataFromLocal?.targetEmail) {
      header['X-SWITCH-USER'] = impersonationDataFromLocal?.targetEmail;
    }

    if (impersonationDataFromLocal?.supportPin) {
      header['X-USER-SUPPORT-PIN'] = impersonationDataFromLocal?.supportPin;
    }
    const impersonationHeader = header;
    return impersonationHeader;
  } else {
    return header;
  }
};
