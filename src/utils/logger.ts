import { LogLevel } from '../types/index.js';

export class Logger {
  constructor(private level: LogLevel = LogLevel.INFO) {}

  error(message: string, meta?: any): void {
    if (this.level >= LogLevel.ERROR) {
      console.error(`[ERROR] ${new Date().toISOString()} ${message}`, meta || '');
    }
  }

  warn(message: string, meta?: any): void {
    if (this.level >= LogLevel.WARN) {
      console.warn(`[WARN] ${new Date().toISOString()} ${message}`, meta || '');
    }
  }

  info(message: string, meta?: any): void {
    if (this.level >= LogLevel.INFO) {
      console.error(`[INFO] ${new Date().toISOString()} ${message}`, meta || '');
    }
  }

  debug(message: string, meta?: any): void {
    if (this.level >= LogLevel.DEBUG) {
      console.error(`[DEBUG] ${new Date().toISOString()} ${message}`, meta || '');
    }
  }

  setLevel(level: LogLevel): void {
    this.level = level;
  }
}