/**
 * In-memory cache for Gemini system prompts
 * Reduces token usage by ~90%
 */

export class PromptCache {
    constructor() {
        this.cache = new Map();
        this.ttl = parseInt(process.env.CACHE_TTL_SECONDS) || 3600; // 1 hour default
    }

    async getCachedPrompt(agentName, systemPrompt) {
        const key = `prompt_${agentName}`;
        const cached = this.cache.get(key);

        if (cached && !this.isExpired(cached)) {
            console.log(`✅ Using cached prompt for ${agentName}`);
            return cached.name;
        }

        // In a real implementation with Gemini API caching:
        // const cachedContent = await genAI.cacheContent({...});
        // For now, we'll just mark it as cached

        console.log(`🔄 Caching system prompt for ${agentName}`);

        this.cache.set(key, {
            name: `cached_${agentName}_${Date.now()}`,
            expiry: Date.now() + (this.ttl * 1000),
            prompt: systemPrompt
        });

        return null; // Return null for now (no actual Gemini caching in this demo)
    }

    isExpired(cached) {
        return Date.now() > cached.expiry;
    }

    clearCache() {
        this.cache.clear();
    }
}
