/**
 * @file services/loggingService.ts
 * @description A simple, extensible logging service for structured logging.
 * In a real-world enterprise application, this module would act as the adapter
 * integrating with observability platforms like Sentry, LogRocket, or Datadog.
 */

/**
 * Defines the available log severity levels.
 */
type LogLevel = 'INFO' | 'WARN' | 'ERROR';

/**
 * A centralized class to handle application logging with varying severity levels.
 * It provides a structured format outputting to the console, automatically attaching
 * ISO timestamps and extracting stack traces for errors.
 */
class Logger {
  /**
   * The core internal logging method that formats and writes the message to the console.
   *
   * @private
   * @param {LogLevel} level - The severity level of the log message ('INFO', 'WARN', or 'ERROR').
   * @param {string} message - The primary text message to log.
   * @param {unknown} [details] - Optional additional data payload to log alongside the message.
   * @returns {void}
   */
  private log(level: LogLevel, message: string, details?: unknown): void {
    const timestamp = new Date().toISOString();
    // @ts-expect-error - indexing console by string level name
    console[level.toLowerCase()]?.(
      `[${timestamp}] [${level}] ${message}`,
      details ?? ''
    );
  }

  /**
   * Logs an informational message indicating normal application flow.
   *
   * @param {string} message - The informational message to log.
   * @param {unknown} [details] - Optional additional contextual data to append.
   * @returns {void}
   */
  info(message: string, details?: unknown): void {
    this.log('INFO', message, details);
  }

  /**
   * Logs a warning message indicating a potential issue that is not yet fatal.
   *
   * @param {string} message - The warning message to log.
   * @param {unknown} [details] - Optional additional contextual data to append.
   * @returns {void}
   */
  warn(message: string, details?: unknown): void {
    this.log('WARN', message, details);
  }

  /**
   * Logs a critical error message, specifically extracting error messages, stack traces,
   * and capturing state context without leaking sensitive parameters.
   *
   * @param {string} message - A high-level description of what operation failed.
   * @param {Error | unknown} error - The caught error object or exception payload.
   * @param {Record<string, unknown>} [context] - Optional dictionary of application state context relevant to the failure.
   * @returns {void}
   */
  error(message: string, error: Error | unknown, context?: Record<string, unknown>): void {
    const details = {
      errorMessage: error instanceof Error ? error.message : 'An unknown error occurred.',
      stack: error instanceof Error ? error.stack : undefined,
      context,
    };
    this.log('ERROR', message, details);
  }
}

/**
 * A singleton instance of the `Logger` class.
 * This is exported for direct use throughout the application components and services.
 */
export const loggingService = new Logger();
