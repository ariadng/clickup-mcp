// Test setup file
// This file is run before each test suite

// Mock console methods to avoid noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.CLICKUP_API_KEY = 'pk_test_key_for_testing_only';
process.env.CLICKUP_TIMEOUT = '5000';
process.env.CLICKUP_RATE_LIMIT = '10';