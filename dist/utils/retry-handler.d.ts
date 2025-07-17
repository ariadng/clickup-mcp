import { Logger } from './logger.js';
export declare class RetryHandler {
    private readonly maxRetries;
    private readonly baseDelay;
    private logger;
    constructor(maxRetries: number | undefined, baseDelay: number | undefined, logger: Logger);
    executeWithRetry<T>(operation: () => Promise<T>, context?: string): Promise<T>;
    private isRetryableError;
    private sleep;
}
//# sourceMappingURL=retry-handler.d.ts.map