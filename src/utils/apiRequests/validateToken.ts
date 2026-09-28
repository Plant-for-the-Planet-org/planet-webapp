import type { JwtPayload } from 'jwt-decode';

import jwt_decode from 'jwt-decode';

/**
 * Written for Auth0 access tokens, which always carry a numeric `exp`.
 * A missing `exp` counts as invalid here, even though a plain JWT may omit one, because we cannot tell a deliberate forever token from one that lost the claim.
 */
export const validateToken = (token: string): boolean => {
  try {
    const decoded: JwtPayload = jwt_decode(token);
    const currentTime = Date.now() / 1000;
    if (
      typeof decoded.exp !== 'number' ||
      !Number.isFinite(decoded.exp) ||
      decoded.exp < currentTime
    ) {
      return false;
    }
    return true;
  } catch (err) {
    return false;
  }
};
