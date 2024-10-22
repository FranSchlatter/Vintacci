// src/components/Cart.js
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromCart, updateQuantity, clearCart } from '../redux/actions/cartActions';

const Cart = () => {
    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state.cart.items);

    const handleRemove = (id) => {
        dispatch(removeFromCart(id));
    };

    const handleQuantityChange = (id, quantity) => {
        if (quantity < 1) return; // Evitar cantidades negativas
        dispatch(updateQuantity(id, quantity));
    };

    const handleClearCart = () => {
        dispatch(clearCart());
    };

    // Calcular el total
    const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    return (
        <div className="container mx-auto my-8 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Carrito de Compras</h2>
            {cartItems.length === 0 ? (
                <p className="text-gray-500">El carrito está vacío.</p>
            ) : (
                <div>
                    {cartItems.map(item => (
                        <div key={item.id} className="flex justify-between items-center border-b py-4">
                            <div className="flex items-center">
                                {/* Imagen del producto */}
                                <img 
                                    src={item.image_url} // Asegúrate de que el producto tenga una propiedad image_url
                                    alt={item.name}
                                    className="w-16 h-16 object-cover rounded mr-4"
                                />
                                <div>
                                    <h3 className="text-lg font-semibold">{item.name}</h3>
                                    <p className="text-gray-600">Precio: ${item.price}</p>
                                    <p className="mt-2">
                                        Cantidad: 
                                        <input 
                                            type="number" 
                                            value={item.quantity} 
                                            onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))} 
                                            min="1" 
                                            className="ml-2 border rounded p-1 w-16"
                                        />
                                    </p>
                                </div>
                            </div>
                            <button 
                                onClick={() => handleRemove(item.id)} 
                                className="text-red-500 hover:text-red-700"
                            >
                                Eliminar
                            </button>
                        </div>
                    ))}
                    <div className="mt-4">
                        <h3 className="text-lg font-bold">Total: ${totalPrice.toFixed(2)}</h3>
                    </div>
                    <button 
                        onClick={handleClearCart} 
                        className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                        Vaciar Carrito
                    </button>
                </div>
            )}
        </div>
    );
};

export default Cart;