// src/components/Checkout/OrderSummary.js
import React from 'react';

const OrderSummary = ({ items, shipping }) => {
    const subtotal = items.reduce((total, item) => 
      total + (parseFloat(item.price) * item.quantity), 0
    );
    const shippingCost = shipping?.price || 0;
    const total = subtotal + shippingCost;
  
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold mb-4">Resumen del Pedido</h3>
        
        {/* Items */}
        <div className="space-y-4 mb-6">
          {items.map(item => (
            <div key={item.id} className="flex justify-between">
              <div className="flex items-start">
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="ml-4">
                  <h4 className="font-medium">{item.name}</h4>
                  <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
                </div>
              </div>
              <span className="font-medium">
                ${(parseFloat(item.price) * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
  
        {/* Totales */}
        <div className="space-y-2 pt-4 border-t">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Envío</span>
            <span>
              {shipping ? 
                shipping.price === 0 ? 
                  'Gratis' : 
                  `$${shipping.price.toFixed(2)}` 
                : 'Por calcular'}
            </span>
          </div>
          <div className="flex justify-between pt-4 border-t font-bold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    );
  };

export default OrderSummary;
