import { LogLevel } from '../types/index.js';
export class Logger {
    level;
    constructor(level = LogLevel.INFO) {
        this.level = level;
    }
    error(message, meta) {
        if (this.level >= LogLevel.ERROR) {
            console.error(`[ERROR] ${new Date().toISOString()} ${message}`, meta || '');
        }
    }
    warn(message, meta) {
        if (this.level >= LogLevel.WARN) {
            console.warn(`[WARN] ${new Date().toISOString()} ${message}`, meta || '');
        }
    }
    info(message, meta) {
        if (this.level >= LogLevel.INFO) {
            console.error(`[INFO] ${new Date().toISOString()} ${message}`, meta || '');
        }
    }
    debug(message, meta) {
        if (this.level >= LogLevel.DEBUG) {
            console.error(`[DEBUG] ${new Date().toISOString()} ${message}`, meta || '');
        }
    }
    setLevel(level) {
        this.level = level;
    }
}
//# sourceMappingURL=logger.js.map