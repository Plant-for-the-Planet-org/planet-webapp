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
  let validImpersonationData: ImpersonationData | undefined;

  if (impersonationData === undefined) {
    validImpersonationData = readStoredImpersonationData();
  } else if (isValidImpersonationData(impersonationData)) {
    validImpersonationData = impersonationData;
  }

  if (validImpersonationData) {
    header['X-SWITCH-USER'] = validImpersonationData.targetEmail;
    header['X-USER-SUPPORT-PIN'] = validImpersonationData.supportPin;
  }
  return header;
};
