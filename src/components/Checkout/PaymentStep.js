// src/components/Checkout/PaymentStep.js
import React, { useState } from 'react';

const PaymentStep = ({ onComplete, amount }) => {
    const [paymentMethod, setPaymentMethod] = useState(null);
    const [loading, setLoading] = useState(false);
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      await onComplete({ method: paymentMethod });
      setLoading(false);
    };
  
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6">Método de Pago</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Simulación de métodos de pago */}
          <div className="space-y-4">
            <div
              onClick={() => setPaymentMethod('card')}
              className={`
                p-4 border rounded-lg cursor-pointer
                ${paymentMethod === 'card' ? 'border-blue-500 bg-blue-50' : ''}
              `}
            >
              <h3 className="font-medium">Tarjeta de Crédito/Débito</h3>
              <p className="text-sm text-gray-500">VISA, Mastercard, American Express</p>
            </div>
            
            <div
              onClick={() => setPaymentMethod('mercadopago')}
              className={`
                p-4 border rounded-lg cursor-pointer
                ${paymentMethod === 'mercadopago' ? 'border-blue-500 bg-blue-50' : ''}
              `}
            >
              <h3 className="font-medium">MercadoPago</h3>
              <p className="text-sm text-gray-500">Pago con cuenta de MercadoPago</p>
            </div>
  
            <div
              onClick={() => setPaymentMethod('transfer')}
              className={`
                p-4 border rounded-lg cursor-pointer
                ${paymentMethod === 'transfer' ? 'border-blue-500 bg-blue-50' : ''}
              `}
            >
              <h3 className="font-medium">Transferencia Bancaria</h3>
              <p className="text-sm text-gray-500">Transferencia o depósito bancario</p>
            </div>
          </div>
  
          <button
            type="submit"
            disabled={!paymentMethod || loading}
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                     disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {loading ? 'Procesando...' : `Pagar $${amount.toFixed(2)}`}
          </button>
        </form>
      </div>
    );
  };

export default PaymentStep;
