export function errorHandler(err, req, res, next) {
    console.error('❌ Error:', err);

    // Gemini API errors
    if (err.type) {
        const statusCode = err.type === 'RATE_LIMIT' ? 429 :
            err.type === 'QUOTA_EXCEEDED' ? 429 :
                err.type === 'BUDGET_EXCEEDED' ? 429 :
                    err.type === 'TIMEOUT' ? 504 :
                        500;

        return res.status(statusCode).json({
            success: false,
            error: err.message,
            type: err.type,
            retryable: err.retryable,
            timestamp: err.timestamp
        });
    }

    // Multer file upload errors
    if (err instanceof Error && err.message.includes('Only PDF')) {
        return res.status(400).json({
            success: false,
            error: err.message
        });
    }

    // Generic error
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        error: err.message || 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
}
