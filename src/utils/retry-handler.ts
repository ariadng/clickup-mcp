import { ERROR_CODES } from '../types/index.js';
import { Logger } from './logger.js';

export class RetryHandler {
  private readonly maxRetries: number;
  private readonly baseDelay: number;
  private logger: Logger;

  constructor(maxRetries: number = 3, baseDelay: number = 1000, logger: Logger) {
    this.maxRetries = maxRetries;
    this.baseDelay = baseDelay;
    this.logger = logger;
  }

  async executeWithRetry<T>(operation: () => Promise<T>, context: string = 'operation'): Promise<T> {
    let lastError: Error;
    
    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        if (attempt > 0) {
          this.logger.info(`Retrying ${context} (attempt ${attempt + 1}/${this.maxRetries + 1})`);
        }
        
        return await operation();
      } catch (error) {
        lastError = error as Error;
        
        this.logger.warn(`${context} failed on attempt ${attempt + 1}`, {
          error: lastError.message,
          attempt: attempt + 1,
          maxRetries: this.maxRetries + 1
        });
        
        if (attempt === this.maxRetries || !this.isRetryableError(lastError)) {
          if (!this.isRetryableError(lastError)) {
            this.logger.error(`${context} failed with non-retryable error`, lastError.message);
          }
          throw lastError;
        }
        
        const delay = this.baseDelay * Math.pow(2, attempt);
        this.logger.debug(`Waiting ${delay}ms before retry`);
        await this.sleep(delay);
      }
    }
    
    throw lastError!;
  }

  private isRetryableError(error: Error): boolean {
    const errorMessage = error.message.toLowerCase();
    
    // Check for network errors
    if (errorMessage.includes('network') || errorMessage.includes('timeout')) {
      return true;
    }
    
    // Check for rate limit errors (should retry after wait time)
    if (errorMessage.includes(ERROR_CODES.RATE_LIMIT_EXCEEDED.toLowerCase())) {
      return true;
    }
    
    // Check for HTTP status codes in error message
    const statusMatch = error.message.match(/status.*?(\d{3})/i);
    if (statusMatch) {
      const status = parseInt(statusMatch[1]);
      return status >= 500 || status === 429; // Server errors or rate limit
    }
    
    // Check for specific axios errors
    if (error.name === 'AxiosError') {
      const axiosError = error as any;
      if (axiosError.response?.status >= 500 || axiosError.response?.status === 429) {
        return true;
      }
      if (axiosError.code === 'ECONNRESET' || axiosError.code === 'ETIMEDOUT') {
        return true;
      }
    }
    
    return false;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}