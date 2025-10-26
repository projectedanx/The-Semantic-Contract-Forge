import React, { Component, ErrorInfo, ReactNode } from 'react';
import { loggingService } from '../services/loggingService';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    loggingService.error("Uncaught render error", error, { componentStack: errorInfo.componentStack });
  }

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
