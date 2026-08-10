/**
 * Credentials that identify an impersonation session. Kept in localStorage
 * under 'impersonationData' and sent as request headers by
 * setHeaderForImpersonation.
 */
export type ImpersonationData = {
  targetEmail: string;
  supportPin: string;
};
