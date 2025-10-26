// A simple, extensible logging service.
// In a real-world app, this could be integrated with a third-party service like Sentry, LogRocket, or Datadog.

type LogLevel = 'INFO' | 'WARN' | 'ERROR';

class Logger {
  private log(level: LogLevel, message: string, details?: unknown) {
    const timestamp = new Date().toISOString();
    console[level.toLowerCase()]?.(
      `[${timestamp}] [${level}] ${message}`,
      details ?? ''
    );
  }

  info(message: string, details?: unknown) {
    this.log('INFO', message, details);
  }

  warn(message: string, details?: unknown) {
    this.log('WARN', message, details);
  }

  error(message: string, error: Error | unknown, context?: Record<string, any>) {
    const details = {
      errorMessage: error instanceof Error ? error.message : 'An unknown error occurred.',
      stack: error instanceof Error ? error.stack : undefined,
      context,
    };
    this.log('ERROR', message, details);
  }
}

// Export a singleton instance
export const loggingService = new Logger();
