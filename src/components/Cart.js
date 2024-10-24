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
    const totalPrice = cartItems.reduce((total, item) => total + parseFloat(item.price) * item.quantity, 0);

    return (
        <div className="container mx-auto my-8 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Carrito de Compras</h2>
            {cartItems.length === 0 ? (
                <p className="text-gray-500">El carrito está vacío.</p>
            ) : (
                <div>
                    {cartItems.map(item => (
                        <div key={item.id} className="flex justify-between items-center border-b py-4 space-x-4">
                            {/* 1. Imagen del producto */}
                            <img 
                                src={item.image_url} 
                                alt={item.name}
                                className="w-16 h-16 object-cover rounded"
                            />
                            {/* 2. Título + Descripción con ancho limitado */}
                            <div className="flex-1 mx-4 max-w-xs">
                                <h3 className="text-lg font-semibold truncate">{item.name}</h3>
                                <p className="text-gray-600 text-sm truncate">{item.description}</p>
                            </div>
                            {/* 3. Cantidad */}
                            <div className="flex items-center">
                                <p className="text-gray-600 mr-2">Cantidad:</p>
                                <input 
                                    type="number" 
                                    value={item.quantity} 
                                    onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))} 
                                    min="1" 
                                    className="border rounded p-1 w-16"
                                />
                            </div>
                            {/* 4. Precio unitario + Total */}
                            <div className="flex flex-col items-end">
                                <p className="text-gray-600">Precio: ${parseFloat(item.price).toFixed(2)}</p>
                                <p className="text-lg font-bold">Total: ${(parseFloat(item.price) * item.quantity).toFixed(2)}</p>
                            </div>
                            <button 
                                onClick={() => handleRemove(item.id)} 
                                className="text-red-500 hover:text-red-700 ml-4"
                            >
                                Eliminar
                            </button>
                        </div>
                    ))}
                    <div className="mt-4">
                        <h3 className="text-lg font-bold">Total del Carrito: ${totalPrice.toFixed(2)}</h3>
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
