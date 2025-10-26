import React from 'react';

/**
 * @interface ConfirmationModalProps
 * @description Props for the ConfirmationModal component.
 * @property {boolean} isOpen - Whether the modal is open.
 * @property {() => void} onClose - Function to call when the modal is closed.
 * @property {() => void} onConfirm - Function to call when the confirm button is clicked.
 * @property {string} title - The title of the modal.
 * @property {string} message - The message to display in the modal.
 * @property {string} [confirmText] - The text for the confirm button. Defaults to 'Confirm'.
 * @property {string} [cancelText] - The text for the cancel button. Defaults to 'Cancel'.
 */
interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

/**
 * @component ConfirmationModal
 * @description A reusable modal component to confirm user actions.
 * @param {ConfirmationModalProps} props - The props for the component.
 * @returns {React.ReactElement | null} A modal dialog for confirming an action, or null if not open.
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
