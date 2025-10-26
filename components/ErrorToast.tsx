import React, { useEffect, useState } from 'react';
import { XCircleIcon } from './icons/XCircleIcon';

interface ErrorToastProps {
  message: string | null;
  onDismiss: () => void;
}

const ErrorToast: React.FC<ErrorToastProps> = ({ message, onDismiss }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        handleDismiss();
      }, 6000); // Auto-dismiss after 6 seconds

      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [message]);

  const handleDismiss = () => {
    setIsVisible(false);
    // Allow animation to finish before calling the parent dismiss handler
    setTimeout(() => {
        onDismiss();
    }, 300);
  }

  return (
    <div
      aria-live="assertive"
      className={`fixed inset-0 flex items-end justify-center px-4 py-6 pointer-events-none sm:p-6 z-50`}
    >
      <div
        className={`w-full max-w-sm bg-red-800/90 backdrop-blur-sm shadow-lg rounded-lg pointer-events-auto ring-1 ring-red-400 ring-opacity-50 transition-all duration-300 ease-in-out
          ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}
      >
        <div className="p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <XCircleIcon className="h-6 w-6 text-red-300" aria-hidden="true" />
            </div>
            <div className="ml-3 w-0 flex-1 pt-0.5">
              <p className="text-sm font-medium text-red-100">Error</p>
              <p className="mt-1 text-sm text-red-200">{message}</p>
            </div>
            <div className="ml-4 flex-shrink-0 flex">
              <button
                type="button"
                className="inline-flex rounded-md text-red-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                onClick={handleDismiss}
              >
                <span className="sr-only">Close</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorToast;
