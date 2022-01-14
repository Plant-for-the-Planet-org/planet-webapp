import jwt_decode, { JwtPayload } from 'jwt-decode';

export const decodeToken = (token: string): JwtPayload => {
  return jwt_decode(token);
};
