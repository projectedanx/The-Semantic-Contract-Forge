import React, { Component, ErrorInfo, ReactNode } from 'react';
import { loggingService } from '../services/loggingService';

/**
 * @file components/ErrorBoundary.tsx
 * @description Implements a React Error Boundary to catch JavaScript errors anywhere
 * in its child component tree, log those errors to the central logging service, and display
 * a fallback UI instead of crashing the entire application.
 */

/**
 * Props for the ErrorBoundary component.
 */
export interface ErrorBoundaryProps {
  /** The child components that this boundary wraps and protects. */
  children: ReactNode;
}

/**
 * Internal state for the ErrorBoundary component.
 */
export interface ErrorBoundaryState {
  /** Flag indicating whether an error has been caught by the boundary. */
  hasError: boolean;
}

/**
 * A React class component acting as an Error Boundary.
 * Catches errors during rendering, in lifecycle methods, and in constructors of the whole tree below it.
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  /**
   * Initializes the component state, defaulting to no error.
   */
  public state: ErrorBoundaryState = {
    hasError: false,
  };

  /**
   * React lifecycle method invoked after an error is thrown in a descendant component.
   * Used to update state so the next render shows the fallback UI.
   *
   * @param {Error} _ - The error that was thrown (unused in state derivation).
   * @returns {ErrorBoundaryState} The new state object setting `hasError` to true.
   */
  public static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  /**
   * React lifecycle method invoked after an error has been thrown by a descendant component.
   * Used for logging error details to external services.
   *
   * @param {Error} error - The actual Error object that was thrown.
   * @param {ErrorInfo} errorInfo - React-specific error info, including the component stack trace.
   * @returns {void}
   */
  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    loggingService.error("Uncaught render error", error, { componentStack: errorInfo.componentStack });
  }

  /**
   * Renders the children if no error has occurred, otherwise renders the fallback UI.
   *
   * @returns {ReactNode} The application content or the error fallback UI.
   */
  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-slate-300 p-4">
          <div className="text-center bg-slate-800 p-8 rounded-lg border border-slate-700 shadow-xl">
            <h1 className="text-3xl font-bold text-red-400 font-orbitron">Something went wrong.</h1>
            <p className="mt-4 text-slate-400">
              An unexpected error occurred. Please try reloading the application.
            </p>
            <p className="mt-2 text-xs text-slate-500">
              Our team has been notified of this issue.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-md transition font-semibold"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return (this as React.Component<ErrorBoundaryProps, ErrorBoundaryState>).props.children;
  }
}

export default ErrorBoundary;
