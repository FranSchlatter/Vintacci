// src/components/Admin/Modals/CustomEmailModal.js
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const CustomEmailModal = ({ order, isOpen, onClose }) => {
  const [emailData, setEmailData] = useState({
    subject: '',
    message: '',
    estimatedDate: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/email/order-custom', {
        orderId: order.id,
        ...emailData
      });
      toast.success('Notificación enviada correctamente');
      onClose();
    } catch (error) {
      toast.error('Error al enviar la notificación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 ${isOpen ? 'flex' : 'hidden'} items-center justify-center`}>
      <div className="bg-white rounded-lg p-6 w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">Notificar Incidencia en Pedido</h2>
        
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <p><strong>Pedido:</strong> #{order?.id}</p>
          <p><strong>Cliente:</strong> {order?.user?.first_name} {order?.user?.last_name}</p>
          <p><strong>Email:</strong> {order?.user?.email}</p>
          <p><strong>Estado actual:</strong> {order?.status}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Tipo de Incidencia</label>
            <select
              value={emailData.subject}
              onChange={(e) => setEmailData(prev => ({ ...prev, subject: e.target.value }))}
              className="w-full border rounded-lg px-3 py-2"
              required
            >
              <option value="">Seleccionar tipo...</option>
              <option value="Demora en el envío">Demora en el envío</option>
              <option value="Problema de stock">Problema de stock</option>
              <option value="Problema con el pago">Problema con el pago</option>
              <option value="Actualización importante">Actualización importante</option>
              <option value="Otro">Otro</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Nueva fecha estimada (opcional)</label>
            <input
              type="date"
              value={emailData.estimatedDate}
              onChange={(e) => setEmailData(prev => ({ ...prev, estimatedDate: e.target.value }))}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Mensaje detallado</label>
            <textarea
              value={emailData.message}
              onChange={(e) => setEmailData(prev => ({ ...prev, message: e.target.value }))}
              className="w-full border rounded-lg px-3 py-2 min-h-[150px]"
              placeholder="Describe la situación y las acciones que se están tomando..."
              required
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Enviando...' : 'Enviar Notificación'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomEmailModal;