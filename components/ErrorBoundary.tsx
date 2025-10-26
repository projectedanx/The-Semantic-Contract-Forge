import React, { Component, ErrorInfo, ReactNode } from 'react';
import { loggingService } from '../services/loggingService';

/**
 * @interface Props
 * @description Props for the ErrorBoundary component.
 * @property {ReactNode} children - The child components to render.
 */
interface Props {
  children: ReactNode;
}

/**
 * @interface State
 * @description State for the ErrorBoundary component.
 * @property {boolean} hasError - Whether an error has been caught.
 */
interface State {
  hasError: boolean;
}

/**
 * @class ErrorBoundary
 * @extends Component<Props, State>
 * @description A React component that catches JavaScript errors anywhere in its child component tree,
 * logs those errors, and displays a fallback UI instead of the component tree that crashed.
 */
class ErrorBoundary extends Component<Props, State> {
  /**
   * @property {State} state - The state of the component.
   */
  public state: State = {
    hasError: false,
  };

  /**
   * @static
   * @method getDerivedStateFromError
   * @description This lifecycle method is used to update the state so that the next render will show the fallback UI.
   * @param {Error} _ - The error that was thrown.
   * @returns {State} An object with the updated state.
   */
  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  /**
   * @method componentDidCatch
   * @description This lifecycle method is called after an error has been thrown by a descendant component.
   * It receives two parameters: the error that was thrown, and an object with a componentStack key.
   * @param {Error} error - The error that was thrown.
   * @param {ErrorInfo} errorInfo - An object with a componentStack key containing information about which component threw the error.
   */
  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    loggingService.error("Uncaught render error", error, { componentStack: errorInfo.componentStack });
  }

  /**
   * @method render
   * @description Renders the component.
   * @returns {ReactNode} The rendered component.
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

    return this.props.children;
  }
}

export default ErrorBoundary;
