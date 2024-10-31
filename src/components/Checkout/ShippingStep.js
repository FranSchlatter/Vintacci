// src/components/Checkout/ShippingStep.js
import React, { useState } from 'react';

const ShippingStep = ({ onComplete }) => {
    const [selectedMethod, setSelectedMethod] = useState(null);
    
    const shippingMethods = [
      {
          id: 'standard',
          name: 'Envío Estándar',
          method: 'standard',          // Para shipping_method
          price: 15,
          cost: 15,                   // Para shipping_cost
          time: '3-5 días hábiles'
      },
      {
          id: 'express',
          name: 'Envío Express',
          method: 'express',
          price: 30,
          cost: 30,
          time: '24-48 horas'
      }
  ];

  const handleMethodSelect = (method) => {
    setSelectedMethod({
        ...method,
        shipping_method: method.method,  // Asegurarnos de incluir estos campos
        shipping_cost: method.cost
    });
};
  
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6">Método de Envío</h2>
        <div className="space-y-4">
          {shippingMethods.map((method) => (
            <div
              key={method.id}
              onClick={() => handleMethodSelect(method)}
              className={`
                p-4 border rounded-lg cursor-pointer
                ${selectedMethod?.id === method.id ? 'border-blue-500 bg-blue-50' : ''}
              `}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{method.name}</h3>
                  <p className="text-sm text-gray-500">{method.time}</p>
                </div>
                <div className="text-lg font-bold">
                  {method.price === 0 ? 'Gratis' : `$${method.price}`}
                </div>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={() => selectedMethod && onComplete(selectedMethod)}
          disabled={!selectedMethod}
          className="w-full mt-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                   disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Continuar
        </button>
      </div>
    );
  };

export default ShippingStep;
