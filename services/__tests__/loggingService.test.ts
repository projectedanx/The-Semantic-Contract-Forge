import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { loggingService } from '../loggingService';

/**
 * @file Unit tests for loggingService.
 * Focuses on verifying that logs are correctly formatted and sent to the console.
 */

describe('loggingService', () => {
  const mockDate = new Date('2023-01-01T00:00:00.000Z');

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(mockDate);
    // Spy on console methods
    vi.spyOn(console, 'info').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('info', () => {
    it('should log an info message with correctly formatted timestamp and details', () => {
      const message = 'Test info message';
      const details = { key: 'value' };

      loggingService.info(message, details);

      expect(console.info).toHaveBeenCalledWith(
        `[2023-01-01T00:00:00.000Z] [INFO] ${message}`,
        details
      );
    });

    it('should log an info message with an empty string if details are missing', () => {
      const message = 'Test info message without details';

      loggingService.info(message);

      expect(console.info).toHaveBeenCalledWith(
        `[2023-01-01T00:00:00.000Z] [INFO] ${message}`,
        ''
      );
    });
  });

  describe('warn', () => {
    it('should log a warning message with correctly formatted timestamp and details', () => {
      const message = 'Test warning message';
      const details = { warning: 'be careful' };

      loggingService.warn(message, details);

      expect(console.warn).toHaveBeenCalledWith(
        `[2023-01-01T00:00:00.000Z] [WARN] ${message}`,
        details
      );
    });
  });

  describe('error', () => {
    it('should log an error message with Error object details', () => {
      const message = 'An error occurred';
      const error = new Error('Original error message');
      error.stack = 'Mock stack trace';

      loggingService.error(message, error);

      expect(console.error).toHaveBeenCalledWith(
        `[2023-01-01T00:00:00.000Z] [ERROR] ${message}`,
        {
          errorMessage: 'Original error message',
          stack: 'Mock stack trace',
          context: undefined,
        }
      );
    });

    it('should handle unknown error types gracefully', () => {
      const message = 'A weird error occurred';
      const error = 'Not an Error object';

      loggingService.error(message, error);

      expect(console.error).toHaveBeenCalledWith(
        `[2023-01-01T00:00:00.000Z] [ERROR] ${message}`,
        {
          errorMessage: 'An unknown error occurred.',
          stack: undefined,
          context: undefined,
        }
      );
    });

    it('should include additional context in the error log', () => {
      const message = 'Error with context';
      const error = new Error('Contextual error');
      const context = { userId: '123', action: 'test' };

      loggingService.error(message, error, context);

      expect(console.error).toHaveBeenCalledWith(
        `[2023-01-01T00:00:00.000Z] [ERROR] ${message}`,
        {
          errorMessage: 'Contextual error',
          stack: expect.any(String),
          context: context,
        }
      );
    });
  });
});
