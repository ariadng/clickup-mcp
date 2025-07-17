import { ERROR_CODES } from '../types/index.js';

export function validateApiKey(apiKey: string): boolean {
  return /^pk_\d+_[A-Z0-9]{32}$/.test(apiKey);
}

export function validateInput(input: any, schema: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!input || typeof input !== 'object') {
    errors.push('Input must be an object');
    return { isValid: false, errors };
  }

  // Check required properties
  if (schema.required) {
    for (const required of schema.required) {
      if (!(required in input)) {
        errors.push(`Missing required property: ${required}`);
      }
    }
  }

  // Check property types
  if (schema.properties) {
    for (const [key, prop] of Object.entries(schema.properties)) {
      if (key in input) {
        const value = input[key];
        const propSchema = prop as any;
        
        if (propSchema.type === 'string' && typeof value !== 'string') {
          errors.push(`Property ${key} must be a string`);
        } else if (propSchema.type === 'number' && typeof value !== 'number') {
          errors.push(`Property ${key} must be a number`);
        } else if (propSchema.type === 'integer' && (!Number.isInteger(value) || typeof value !== 'number')) {
          errors.push(`Property ${key} must be an integer`);
        } else if (propSchema.type === 'boolean' && typeof value !== 'boolean') {
          errors.push(`Property ${key} must be a boolean`);
        } else if (propSchema.type === 'array' && !Array.isArray(value)) {
          errors.push(`Property ${key} must be an array`);
        }
        
        // Check enum values
        if (propSchema.enum && !propSchema.enum.includes(value)) {
          errors.push(`Property ${key} must be one of: ${propSchema.enum.join(', ')}`);
        }
      }
    }
  }

  return { isValid: errors.length === 0, errors };
}

export function sanitizeInput(input: any): any {
  if (typeof input === 'string') {
    // Remove potentially dangerous characters and trim
    return input.replace(/[<>]/g, '').trim();
  } else if (typeof input === 'object' && input !== null) {
    if (Array.isArray(input)) {
      return input.map(sanitizeInput);
    } else {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(input)) {
        sanitized[key] = sanitizeInput(value);
      }
      return sanitized;
    }
  }
  return input;
}

export function createValidationError(message: string, details?: any): Error {
  const error = new Error(`${ERROR_CODES.VALIDATION_ERROR}: ${message}`);
  (error as any).details = details;
  return error;
}