export const ERROR_CODES = {
    INVALID_API_KEY: 'INVALID_API_KEY',
    RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
    RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    NETWORK_ERROR: 'NETWORK_ERROR'
};
export var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["ERROR"] = 0] = "ERROR";
    LogLevel[LogLevel["WARN"] = 1] = "WARN";
    LogLevel[LogLevel["INFO"] = 2] = "INFO";
    LogLevel[LogLevel["DEBUG"] = 3] = "DEBUG";
})(LogLevel || (LogLevel = {}));
//# sourceMappingURL=index.js.map