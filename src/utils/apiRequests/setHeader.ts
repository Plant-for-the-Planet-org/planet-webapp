import type { ImpersonationData } from '../impersonation';
import {
  isValidImpersonationData,
  readStoredImpersonationData,
} from '../impersonation';

/**
 * Returns a new header with the impersonation keys added when there is valid impersonation data.
 * Does not mutate the header passed in.
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

  const finalHeader = { ...header };

  if (validImpersonationData) {
    finalHeader['X-SWITCH-USER'] = validImpersonationData.targetEmail;
    finalHeader['X-USER-SUPPORT-PIN'] = validImpersonationData.supportPin;
  }
  return finalHeader;
};
