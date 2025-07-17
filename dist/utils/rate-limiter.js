import { ERROR_CODES } from '../types/index.js';
export class RateLimiter {
    requests = 0;
    windowStart = Date.now();
    limit;
    windowMs = 60000; // 1 minute
    constructor(limit) {
        this.limit = limit;
    }
    async checkLimit() {
        const now = Date.now();
        if (now - this.windowStart >= this.windowMs) {
            this.requests = 0;
            this.windowStart = now;
        }
        if (this.requests >= this.limit) {
            const waitTime = this.windowMs - (now - this.windowStart);
            throw new Error(`${ERROR_CODES.RATE_LIMIT_EXCEEDED}: Rate limit exceeded. Wait ${waitTime}ms`);
        }
        this.requests++;
    }
    getRemainingRequests() {
        const now = Date.now();
        if (now - this.windowStart >= this.windowMs) {
            return this.limit;
        }
        return Math.max(0, this.limit - this.requests);
    }
    getResetTime() {
        return this.windowStart + this.windowMs;
    }
}
//# sourceMappingURL=rate-limiter.js.map