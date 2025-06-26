import React from "react";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-gray-900 border border-[#d4af37]/30 rounded-xl shadow-lg p-8 max-w-sm w-full">
        <h3 className="text-lg font-semibold text-[#d4af37] mb-4">{title}</h3>
        <p className="text-gray-300 mb-6">{message}</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-md bg-gray-700 text-gray-200 hover:bg-gray-800"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-md bg-[#d4af37] text-black hover:bg-[#c5a028]"
          >
            Confirmer
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
