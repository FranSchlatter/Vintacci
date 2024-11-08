// src/pages/CheckoutPage.js
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearCart } from '../redux/actions/cartActions';
import AddressStep from '../components/Checkout/AddressStep';
import ShippingStep from '../components/Checkout/ShippingStep';
import PaymentStep from '../components/Checkout/PaymentStep';
import OrderSummary from '../components/Checkout/OrderSummary';
import { createOrder } from '../redux/actions/orderActions'
import { generateInvoice } from '../redux/actions/orderActions'
import { toast } from 'react-toastify';
import axios from 'axios';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart.items);
  const currentUser = useSelector(state => state.auth.currentUser);
  const [currentStep, setCurrentStep] = useState(1);
  const [checkoutData, setCheckoutData] = useState({
    address: null,
    shipping: null,
    payment: null
  });

  // Si no hay items en el carrito, redirigir
  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleStepComplete = (step, data) => {
    setCheckoutData(prev => ({
      ...prev,
      [step]: data
    }));
    setCurrentStep(currentStep + 1);
  };

  const handlePaymentComplete = async (paymentData) => {
    try {
      const subtotal = cartItems.reduce((sum, item) => 
        sum + (parseFloat(item.price) * item.quantity), 0
      );
      
      // Asegurarnos de que tenemos la información de envío completa
      const shippingMethod = checkoutData.shipping?.method || 'standard';
      const shippingCost = checkoutData.shipping?.price || 0;
      const total = subtotal + shippingCost;
  
      const orderData = {
        items: cartItems,
        shipping: checkoutData.address,
        billing: checkoutData.address,
        total: total,
        user_id: currentUser.id,
        status: 'pending',
        shipping_method: shippingMethod,  
        shipping_cost: shippingCost,      
        payment_method: paymentData.method || 'credit_card' 
      };
  
      // Crear la orden
      const order = await dispatch(createOrder(orderData));
      
      // Generar factura
      await dispatch(generateInvoice(order.id));

      // Enviar email de confirmación
      try {
        await axios.post('http://localhost:5000/email/order-created', order);
      } catch (emailError) {
        console.error('Error sending order confirmation email:', emailError);
      }

      // Limpiar carrito y redireccionar
      dispatch(clearCart());
      navigate(`/order-confirmation/${order.id}`);
      toast.success('Compra realizada con éxito');
  
    } catch (error) {
      console.error('Error processing order:', error);
      toast.error('Error al procesar la orden');
    }
};

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          {['Dirección', 'Envío', 'Pago'].map((step, index) => (
            <div key={step} className="flex items-center">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center 
                ${currentStep > index + 1 ? 'bg-green-500' : 
                  currentStep === index + 1 ? 'bg-blue-600' : 'bg-gray-300'} 
                text-white font-bold
              `}>
                {index + 1}
              </div>
              <div className="ml-2 text-sm">{step}</div>
              {index < 2 && (
                <div className={`
                  h-1 w-24 mx-4 
                  ${currentStep > index + 1 ? 'bg-green-500' : 'bg-gray-300'}
                `} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main content */}
        <div className="lg:w-2/3">
          {currentStep === 1 && (
            <AddressStep 
              onComplete={(data) => handleStepComplete('address', data)}
            />
          )}
          {currentStep === 2 && (
            <ShippingStep
              onComplete={(data) => handleStepComplete('shipping', data)}
            />
          )}
          {currentStep === 3 && (
            <PaymentStep
              onComplete={handlePaymentComplete}
              amount={cartItems.reduce((total, item) => 
                total + (parseFloat(item.price) * item.quantity), 0
              )}
            />
          )}
        </div>

        {/* Order summary */}
        <div className="lg:w-1/3">
          <OrderSummary 
            items={cartItems}
            shipping={checkoutData.shipping}
          />
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;