export declare function validateApiKey(apiKey: string): boolean;
export declare function validateInput(input: any, schema: any): {
    isValid: boolean;
    errors: string[];
};
export declare function sanitizeInput(input: any): any;
export declare function createValidationError(message: string, details?: any): Error;
//# sourceMappingURL=validation.d.ts.map