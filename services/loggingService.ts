/**
 * @file A simple, extensible logging service.
 * In a real-world app, this could be integrated with a third-party service like Sentry, LogRocket, or Datadog.
 */

/**
 * @typedef {'INFO' | 'WARN' | 'ERROR'} LogLevel
 * @description Defines the available log levels.
 */
type LogLevel = 'INFO' | 'WARN' | 'ERROR';

/**
 * @class Logger
 * @description A class to handle logging with different levels.
 * It provides a structured way to output logs to the console.
 */
class Logger {
  /**
   * The core logging method.
   * @private
   * @param {LogLevel} level - The level of the log message.
   * @param {string} message - The main log message.
   * @param {unknown} [details] - Optional additional details to log.
   */
  private log(level: LogLevel, message: string, details?: unknown) {
    const timestamp = new Date().toISOString();
    console[level.toLowerCase()]?.(
      `[${timestamp}] [${level}] ${message}`,
      details ?? ''
    );
  }

  /**
   * Logs an informational message.
   * @param {string} message - The message to log.
   * @param {unknown} [details] - Optional additional details.
   */
  info(message: string, details?: unknown) {
    this.log('INFO', message, details);
  }

  /**
   * Logs a warning message.
   * @param {string} message - The message to log.
   * @param {unknown} [details] - Optional additional details.
   */
  warn(message: string, details?: unknown) {
    this.log('WARN', message, details);
  }

  /**
   * Logs an error message, including stack trace and context if available.
   * @param {string} message - A descriptive message for the error.
   * @param {Error | unknown} error - The error object.
   * @param {Record<string, any>} [context] - Optional additional context for the error.
   */
  error(message: string, error: Error | unknown, context?: Record<string, any>) {
    const details = {
      errorMessage: error instanceof Error ? error.message : 'An unknown error occurred.',
      stack: error instanceof Error ? error.stack : undefined,
      context,
    };
    this.log('ERROR', message, details);
  }
}

/**
 * @const {Logger} loggingService
 * @description A singleton instance of the Logger class, exported for use throughout the application.
 */
export const loggingService = new Logger();
