import type { ImpersonationData } from '../impersonation';
import {
  isValidImpersonationData,
  readStoredImpersonationData,
} from '../impersonation';

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
