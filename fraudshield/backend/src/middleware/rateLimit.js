import rateLimit from 'express-rate-limit';

export const createRateLimiter = (windowMs = 15 * 60 * 1000, maxRequests = 100) => {
  return rateLimit({
    windowMs,
    max: maxRequests,
    message: {
      error: 'Too many requests from this IP. Try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

export const reportLimiter = createRateLimiter(15 * 60 * 1000, 5); // 5 reports per 15min
export const searchLimiter = createRateLimiter(15 * 60 * 1000, 30); // 30 searches per 15min
