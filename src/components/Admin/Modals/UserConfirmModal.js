// src/components/Admin/Modals/UserConfirmModal.js
import React from 'react';
import { X } from 'lucide-react';

const UserConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">{title || 'Eliminar Usuario'}</h3>
          <button onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        
        <p className="text-gray-600 mb-6">
          {message || '¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.'}
        </p>
        
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg hover:bg-gray-100"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserConfirmModal;