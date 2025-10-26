import React from 'react';

export const SparklesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M9.93 13.5L9 12l.93-.5L12 9l2.07 2.5L15 12l-.93.5L12 15l-2.07-1.5z" />
    <path d="M18 6l-2.07 2.5L15 9l.93-.5L18 6l2.07 2.5L21 9l-.93-.5L18 6z" />
    <path d="M6 18l-2.07 2.5L3 21l.93-.5L6 18l2.07 2.5L9 21l-.93-.5L6 18z" />
  </svg>
);
