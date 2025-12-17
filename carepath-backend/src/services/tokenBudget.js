/**
 * Token budget manager to avoid exceeding free tier limits
 */

export class TokenBudgetManager {
    constructor() {
        this.tokensUsed = 0;
        this.lastResetTime = Date.now();
        this.maxTokensPerMinute = parseInt(process.env.MAX_TOKENS_PER_MINUTE) || 1000000;
    }

    async trackUsage(request, response) {
        // Estimate tokens (rough: 1 token ≈ 4 characters)
        const requestTokens = Math.ceil(request.length / 4);
        const responseTokens = Math.ceil(response.length / 4);
        const totalTokens = requestTokens + responseTokens;

        // Reset if new minute
        const now = Date.now();
        if (now - this.lastResetTime > 60000) {
            this.tokensUsed = 0;
            this.lastResetTime = now;
        }

        this.tokensUsed += totalTokens;

        if (this.tokensUsed > this.maxTokensPerMinute * 0.8) {
            console.warn(`⚠️ Token usage at ${(this.tokensUsed / this.maxTokensPerMinute * 100).toFixed(1)}%`);
        }

        return {
            used: this.tokensUsed,
            remaining: this.maxTokensPerMinute - this.tokensUsed,
            percentage: (this.tokensUsed / this.maxTokensPerMinute) * 100
        };
    }

    canMakeRequest(estimatedTokens) {
        return (this.tokensUsed + estimatedTokens) < this.maxTokensPerMinute;
    }
}
