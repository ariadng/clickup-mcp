export declare class RateLimiter {
    private requests;
    private windowStart;
    private readonly limit;
    private readonly windowMs;
    constructor(limit: number);
    checkLimit(): Promise<void>;
    getRemainingRequests(): number;
    getResetTime(): number;
}
//# sourceMappingURL=rate-limiter.d.ts.map