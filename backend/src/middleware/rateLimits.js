import rateLimit from "express-rate-limit";

export const globalLimiter = rateLimit({ windowMs: 60_000, limit: 120 });
export const authLimiter = rateLimit({ windowMs: 60_000, limit: 10 });
export const chatLimiter = rateLimit({ windowMs: 60_000, limit: 60 });
export const telegramLimiter = rateLimit({ windowMs: 60_000, limit: 120 });

