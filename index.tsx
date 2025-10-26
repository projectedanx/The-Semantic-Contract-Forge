/**
 * @file The entry point for the React application.
 * This file handles the rendering of the main App component into the DOM.
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';

/**
 * The root DOM element where the React application will be mounted.
 * @const {HTMLElement}
 */
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

/**
 * The root React fiber renderer.
 * @const {ReactDOM.Root}
 */
const root = ReactDOM.createRoot(rootElement);

// Render the main application.
// React.StrictMode is used to highlight potential problems in an application.
// ErrorBoundary is used to catch runtime errors in the component tree and display a fallback UI.
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
