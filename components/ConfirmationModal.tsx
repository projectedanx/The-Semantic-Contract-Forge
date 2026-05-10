import React from 'react';

/**
 * @file components/ConfirmationModal.tsx
 * @description Provides a reusable, accessible modal dialog for confirming destructive
 * or critical actions before they are executed.
 */

/**
 * Props for the ConfirmationModal component.
 */
export interface ConfirmationModalProps {
  /** Indicates whether the modal should be visible on screen. */
  isOpen: boolean;
  /** Callback fired when the user clicks the cancel button or dismisses the modal. */
  onClose: () => void;
  /** Callback fired when the user explicitly clicks the confirm button. */
  onConfirm: () => void;
  /** The primary heading text displayed at the top of the modal. */
  title: string;
  /** The detailed explanatory text informing the user of the consequences. */
  message: string;
  /** Optional custom text for the confirm button. Defaults to 'Confirm'. */
  confirmText?: string;
  /** Optional custom text for the cancel button. Defaults to 'Cancel'. */
  cancelText?: string;
}

/**
 * A reusable React modal component to confirm user actions. It uses a fixed overlay
 * and manages focus implicitly by occupying the center of the viewport.
 *
 * @param {ConfirmationModalProps} props - Configuration options and callbacks for the modal.
 * @returns {React.ReactElement | null} The modal dialog element, or null if `isOpen` is false.
 */
const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', cancelText = 'Cancel' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center" aria-modal="true" role="dialog">
      <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-xl p-6 w-full max-w-md m-4">
        <h2 className="text-xl font-bold text-slate-100">{title}</h2>
        <p className="text-slate-400 mt-2">{message}</p>
        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-md transition font-semibold"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-md transition font-semibold"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
