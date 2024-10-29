// src/components/Cart.js
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  removeFromCart,
  updateQuantity,
  clearCart,
} from '../redux/actions/cartActions';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowLeft,
  CreditCard,
} from 'lucide-react';
import { toast } from 'react-toastify';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector(state => state.cart.items);

  // Constantes
  const SHIPPING_COST = 30;
  const FREE_SHIPPING_THRESHOLD = 200;

  const handleRemove = id => {
    dispatch(removeFromCart(id));
    toast.success('Producto eliminado del carrito');
  };

  const handleQuantityChange = (item, increment) => {
    const newQuantity = item.quantity + increment;
    if (newQuantity < 1) return;
    // Aquí podrías agregar validación contra el stock disponible
    dispatch(updateQuantity(item.id, newQuantity));
  };

  const handleClearCart = () => {
    if (window.confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
      dispatch(clearCart());
      toast.info('Carrito vaciado');
    }
  };

  // Cálculos
  const subtotal = cartItems.reduce(
    (total, item) => total + parseFloat(item.price) * item.quantity,
    0
  );
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + shipping;

  // Resumen del carrito para mostrar en el checkout
  const cartSummary = {
    subtotal,
    shipping,
    total,
    itemCount: cartItems.reduce((count, item) => count + item.quantity, 0),
  };

  const handleCheckout = () => {
    // Aquí implementarías la lógica de checkout
    navigate('/checkout', { state: { cartSummary } });
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto my-8 p-6 text-center">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
          <ShoppingBag className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold mb-4">Tu carrito está vacío</h2>
          <p className="text-gray-600 mb-6">
            ¡Explora nuestra tienda y encuentra productos increíbles!
          </p>
          <button
            onClick={() => navigate('/products')}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Continuar Comprando
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto my-8 px-4">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Lista de productos */}
        <div className="lg:w-2/3">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Carrito de Compras</h2>
              <button
                onClick={() => navigate('/products')}
                className="text-blue-600 hover:text-blue-800 inline-flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" /> Seguir comprando
              </button>
            </div>

            {/* Items del carrito */}
            <div className="space-y-4">
              {cartItems.map(item => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {/* Imagen */}
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />

                  {/* Información del producto */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">
                      {item.description}
                    </p>
                    <div className="flex items-center text-sm text-gray-500">
                      <span>Talla: {item.size}</span>
                      <span className="mx-2">•</span>
                      <span>Color: {item.color}</span>
                    </div>
                  </div>

                  {/* Controles de cantidad */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleQuantityChange(item, -1)}
                      className="p-1 rounded-full hover:bg-gray-100"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item, 1)}
                      className="p-1 rounded-full hover:bg-gray-100"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Precio */}
                  <div className="text-right">
                    <p className="text-lg font-bold">
                      ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">
                      ${parseFloat(item.price).toFixed(2)} c/u
                    </p>
                  </div>

                  {/* Botón eliminar */}
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Botón vaciar carrito */}
            <div className="mt-6 text-right">
              <button
                onClick={handleClearCart}
                className="text-red-600 hover:text-red-800 inline-flex items-center"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Vaciar Carrito
              </button>
            </div>
          </div>
        </div>

        {/* Resumen del pedido */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h3 className="text-xl font-bold mb-4">Resumen del Pedido</h3>

            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Envío</span>
                {shipping === 0 ? (
                  <span className="text-green-600 font-medium">¡Gratis!</span>
                ) : (
                  <span>${shipping.toFixed(2)}</span>
                )}
              </div>

              {subtotal < FREE_SHIPPING_THRESHOLD && (
                <div className="bg-blue-50 p-3 rounded-lg text-sm">
                  ¡Agrega ${(FREE_SHIPPING_THRESHOLD - subtotal).toFixed(2)} más
                  para obtener envío gratis!
                </div>
              )}

              <div className="border-t pt-4">
                <div className="flex justify-between items-center font-bold text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                                         transition-colors flex items-center justify-center gap-2"
              >
                <CreditCard className="w-5 h-5" />
                Proceder al Pago
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                Los impuestos y gastos adicionales se calcularán en el checkout
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
