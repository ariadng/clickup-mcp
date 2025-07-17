import { ERROR_CODES } from '../types/index.js';

export class RateLimiter {
  private requests: number = 0;
  private windowStart: number = Date.now();
  private readonly limit: number;
  private readonly windowMs: number = 60000; // 1 minute

  constructor(limit: number) {
    this.limit = limit;
  }

  async checkLimit(): Promise<void> {
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

  getRemainingRequests(): number {
    const now = Date.now();
    
    if (now - this.windowStart >= this.windowMs) {
      return this.limit;
    }
    
    return Math.max(0, this.limit - this.requests);
  }

  getResetTime(): number {
    return this.windowStart + this.windowMs;
  }
}