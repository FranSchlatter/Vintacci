// src/pages/OrderConfirmationPage.js
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const OrderConfirmationPage = () => {
  const { orderNumber } = useParams();

  return (
    <div className="container mx-auto py-16 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <CheckCircle className="w-16 h-16 mx-auto text-green-500" />
        </div>
        
        <h1 className="text-3xl font-bold mb-4">
          ¡Gracias por tu compra!
        </h1>
        
        <p className="text-lg text-gray-600 mb-8">
          Tu pedido #{orderNumber} ha sido confirmado.
          Te enviaremos un email con los detalles y el seguimiento de tu pedido.
        </p>

        <div className="space-y-4">
          <Link
            to="/products"
            className="block w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg 
                     hover:bg-blue-700 transition-colors"
          >
            Seguir Comprando
          </Link>
          
          <Link
            to={`/account/orders/${orderNumber}`}
            className="block w-full sm:w-auto px-6 py-3 border border-gray-300 
                     rounded-lg hover:bg-gray-50 transition-colors"
          >
            Ver Detalles
            </Link>
        </div>

        <div className="mt-12 p-6 bg-gray-50 rounded-lg text-left">
          <h2 className="text-xl font-bold mb-4">Resumen del Pedido</h2>
          <div className="space-y-2">
            <p><span className="font-medium">Estado:</span> Confirmado</p>
            <p><span className="font-medium">Fecha:</span> {new Date().toLocaleDateString()}</p>
            <p><span className="font-medium">Método de pago:</span> Tarjeta de crédito</p>
            <p><span className="font-medium">Dirección de envío:</span></p>
            <p className="text-gray-600 ml-4">
              123 Calle Principal<br />
              Ciudad, Provincia<br />
              CP 12345
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;