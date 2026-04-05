import { rateLimit } from 'express-rate-limit'

const rateLimitResponse = (req,res) => { 
    return res.status(429).json({ 
        error: 'Too many requests. Please try it again later' 
    });
} 

export const generalLimiter = rateLimit ({
     windowMs: 15 * 60 * 1000, // 15 minutes
     max : 200 ,
     standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
     legacyHeaders: false, // Disable the `X-RateLimit-*` headers
     handler: rateLimitResponse
})

export const authLimiter = rateLimit ({ 
    windowMs: 15 * 60 * 1000, // 15 minutes
    max : 10, 
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    handler: rateLimitResponse
})

export const  writeLimiter = rateLimit ({ 
    windowMs: 15 * 60 * 1000, // 15 minutes
    max : 100, 
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    handler: rateLimitResponse
})

export const AIlimiter = rateLimit ({ 
    windowMs: 15 * 60 * 1000, // 15 minutes
    max : 40, 
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    handler: rateLimitResponse
})