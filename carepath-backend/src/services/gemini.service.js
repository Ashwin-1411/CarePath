import { GoogleGenerativeAI } from '@google/generative-ai';
import { PromptCache } from './promptCache.js';
import { TokenBudgetManager } from './tokenBudget.js';

class GeminiWrapper {
    constructor() {
        this.genAI = null;
        this.promptCache = new PromptCache();
        this.tokenBudget = new TokenBudgetManager();
        this.requestTimestamps = [];
        this.initialized = false;
    }

    initialize() {
        if (this.initialized) return;

        if (!process.env.GEMINI_API_KEY) {
            throw new Error('GEMINI_API_KEY environment variable is required');
        }

        this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        this.initialized = true;
        console.log('✅ Gemini API initialized');
    }

    /**
     * Rate limit: 15 requests per minute (free tier)
     */
    async waitForRateLimitSlot() {
        const now = Date.now();
        const oneMinuteAgo = now - 60000;

        // Clean old timestamps
        this.requestTimestamps = this.requestTimestamps.filter(ts => ts > oneMinuteAgo);

        const maxRPM = parseInt(process.env.MAX_REQUESTS_PER_MINUTE) || 15;

        if (this.requestTimestamps.length >= maxRPM) {
            const oldestRequest = this.requestTimestamps[0];
            const waitMs = 60000 - (now - oldestRequest) + 100; // +100ms buffer

            console.log(`⏳ Rate limit reached, waiting ${waitMs}ms...`);
            await new Promise(resolve => setTimeout(resolve, waitMs));

            return this.waitForRateLimitSlot(); // Recursive call
        }

        this.requestTimestamps.push(now);
    }

    /**
     * Call Gemini with caching support
     */
    async generateContent({
        systemPrompt,
        userPrompt,
        temperature = 0.1,
        responseSchema = null,
        agentName = 'unknown'
    }) {
        // Lazy initialization
        this.initialize();

        try {
            // Wait for rate limit slot
            await this.waitForRateLimitSlot();

            // Check token budget
            const estimatedTokens = Math.ceil((systemPrompt.length + userPrompt.length) / 4);
            if (!this.tokenBudget.canMakeRequest(estimatedTokens)) {
                throw new Error('Token budget exceeded for current time window');
            }

            // Get cached system prompt if enabled
            let cachedPromptName = null;
            if (process.env.ENABLE_PROMPT_CACHING === 'true') {
                cachedPromptName = await this.promptCache.getCachedPrompt(agentName, systemPrompt);
            }

            // Configure model
            const generationConfig = {
                temperature,
                maxOutputTokens: 4096,
            };

            if (responseSchema) {
                generationConfig.responseMimeType = 'application/json';
                generationConfig.responseSchema = responseSchema;
            }

            const model = this.genAI.getGenerativeModel({
                model: 'gemini-2.0-flash-exp',
                generationConfig
            });

            // Build request
            let request;

            if (cachedPromptName) {
                // Use cached system prompt
                request = {
                    cachedContent: cachedPromptName,
                    contents: [{
                        role: 'user',
                        parts: [{ text: userPrompt }]
                    }]
                };
            } else {
                // Full prompt (no caching)
                const fullPrompt = `${systemPrompt}\n\n---\n\n${userPrompt}`;
                request = {
                    contents: [{
                        role: 'user',
                        parts: [{ text: fullPrompt }]
                    }]
                };
            }

            // Make API call
            const startTime = Date.now();
            const result = await model.generateContent(request);
            const response = await result.response;
            const duration = Date.now() - startTime;

            // Track token usage
            const responseText = response.text();
            await this.tokenBudget.trackUsage(
                cachedPromptName ? userPrompt : (systemPrompt + userPrompt),
                responseText
            );

            console.log(`✅ Gemini call successful (${agentName}) - ${duration}ms`);

            return {
                success: true,
                data: responseSchema ? JSON.parse(responseText) : responseText,
                metadata: {
                    model: 'gemini-2.0-flash-exp',
                    duration_ms: duration,
                    cached: !!cachedPromptName,
                    agent: agentName
                }
            };

        } catch (error) {
            console.error(`❌ Gemini API error (${agentName}):`, error.message);

            // Parse error type
            const errorType = this.parseErrorType(error);

            throw {
                type: errorType,
                message: error.message,
                retryable: this.isRetryableError(errorType),
                timestamp: new Date().toISOString()
            };
        }
    }

    parseErrorType(error) {
        if (error.status === 429) return 'RATE_LIMIT';
        if (error.status === 500 || error.status === 503) return 'SERVER_ERROR';
        if (error.code === 'ETIMEDOUT') return 'TIMEOUT';
        if (error.message?.includes('quota')) return 'QUOTA_EXCEEDED';
        if (error.message?.includes('budget')) return 'BUDGET_EXCEEDED';
        return 'UNKNOWN';
    }

    isRetryableError(errorType) {
        return ['RATE_LIMIT', 'SERVER_ERROR', 'TIMEOUT'].includes(errorType);
    }

    /**
     * Call with automatic retry logic
     */
    async generateContentWithRetry(params, maxRetries = 3) {
        let lastError;

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                return await this.generateContent(params);
            } catch (error) {
                lastError = error;

                if (!error.retryable || attempt === maxRetries) {
                    throw error;
                }

                // Exponential backoff
                const backoffMs = Math.min(1000 * Math.pow(2, attempt - 1), 32000);
                const jitter = Math.random() * 0.3 * backoffMs;
                const totalWait = Math.floor(backoffMs + jitter);

                console.warn(`⚠️ Attempt ${attempt}/${maxRetries} failed, retrying in ${totalWait}ms...`);
                await new Promise(resolve => setTimeout(resolve, totalWait));
            }
        }

        throw lastError;
    }
}

export default new GeminiWrapper();
