// Simple in-memory rate limiter
const requestCounts = new Map();

export function rateLimiter(req, res, next) {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    const windowMs = 60000; // 1 minute
    const maxRequests = 100; // Per client (generous limit)

    if (!requestCounts.has(ip)) {
        requestCounts.set(ip, []);
    }

    const requests = requestCounts.get(ip);

    // Remove old requests outside window
    const recentRequests = requests.filter(timestamp => now - timestamp < windowMs);

    if (recentRequests.length >= maxRequests) {
        return res.status(429).json({
            success: false,
            error: 'Too many requests, please try again later',
            retry_after: 60
        });
    }

    recentRequests.push(now);
    requestCounts.set(ip, recentRequests);

    next();
}
