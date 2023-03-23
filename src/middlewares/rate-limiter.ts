import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';

const getIP = (request) =>
  request.ip ||
  request.headers['x-forwarded-for'] ||
  request.headers['x-real-ip'] ||
  request.connection.remoteAddress;

export const limiter = rateLimit({
  keyGenerator: getIP,
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

export const speedLimiter = slowDown({
  keyGenerator: getIP,
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 100, // allow 100 requests per minute, then...
  delayMs: 500, // begin adding 500ms of delay per request above 100:
});
