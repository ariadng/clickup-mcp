import { LogLevel } from '../types/index.js';
export declare class Logger {
    private level;
    constructor(level?: LogLevel);
    error(message: string, meta?: any): void;
    warn(message: string, meta?: any): void;
    info(message: string, meta?: any): void;
    debug(message: string, meta?: any): void;
    setLevel(level: LogLevel): void;
}
//# sourceMappingURL=logger.d.ts.map