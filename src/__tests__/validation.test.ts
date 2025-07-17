import { validateApiKey, validateInput, sanitizeInput } from '../utils/validation.js';

describe('Validation Utils', () => {
  describe('validateApiKey', () => {
    test('should validate correct API key format', () => {
      const validKey = 'pk_12345_ABCDEF1234567890ABCDEF1234567890';
      expect(validateApiKey(validKey)).toBe(true);
    });

    test('should reject incorrect API key format', () => {
      const invalidKeys = [
        'invalid_key',
        'pk_12345',
        'pk_12345_short',
        'pk_abc_ABCDEF1234567890ABCDEF1234567890',
        'pk_12345_abcdef1234567890abcdef1234567890', // lowercase
        ''
      ];

      invalidKeys.forEach(key => {
        expect(validateApiKey(key)).toBe(false);
      });
    });
  });

  describe('validateInput', () => {
    test('should validate input against schema', () => {
      const schema = {
        type: 'object',
        properties: {
          name: { type: 'string' },
          age: { type: 'number' }
        },
        required: ['name']
      };

      const validInput = { name: 'John', age: 30 };
      const result = validateInput(validInput, schema);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should reject invalid input', () => {
      const schema = {
        type: 'object',
        properties: {
          name: { type: 'string' },
          age: { type: 'number' }
        },
        required: ['name']
      };

      const invalidInput = { age: 30 }; // missing required name
      const result = validateInput(invalidInput, schema);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Missing required property: name');
    });
  });

  describe('sanitizeInput', () => {
    test('should sanitize string input', () => {
      const input = 'Hello <script>alert("xss")</script> World';
      const result = sanitizeInput(input);
      expect(result).toBe('Hello scriptalert("xss")/script World');
    });

    test('should sanitize object input', () => {
      const input = {
        name: 'John <script>',
        description: 'Test > description'
      };
      const result = sanitizeInput(input);
      expect(result.name).toBe('John script');
      expect(result.description).toBe('Test  description');
    });

    test('should sanitize array input', () => {
      const input = ['Hello <script>', 'World >'];
      const result = sanitizeInput(input);
      expect(result).toEqual(['Hello script', 'World ']);
    });
  });
});