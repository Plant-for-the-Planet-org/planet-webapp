import type { Request } from 'express';

import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';

const getIP = (request: Request) =>
  (request.ip ||
    request.headers['x-forwarded-for'] ||
    request.headers['x-real-ip'] ||
    request.connection.remoteAddress) as string;

export const rateLimiter = rateLimit({
  keyGenerator: getIP,
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // limit each IP to 200 requests per windowMs
  message: '{"error":"Too many requests, please try again later."}',
});

export const speedLimiter = slowDown({
  keyGenerator: getIP,
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 100, // allow 100 requests per minute, then...
  delayMs: 500, // begin adding 500ms of delay per request above 100:
  skipFailedRequests: true, // skip slowing down failed requests (status >= 400)
});
