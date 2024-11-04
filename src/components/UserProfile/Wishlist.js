// src/components/UserProfile/Wishlist.js
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Heart, ShoppingCart, Trash2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { addToCart } from '../../redux/actions/cartActions';
import { toast } from 'react-toastify';
import { removeFromFavorites } from '../../redux/actions/favoriteActions';


const Wishlist = ({ userId }) => {
    const dispatch = useDispatch();
    const favorites = useSelector(state => state.favorites?.items || []);

    const handleAddToCart = (product) => {
        dispatch(addToCart(product));
        toast.success('Producto agregado al carrito');
    };

    const handleRemoveFromWishlist = (productId) => {
        if (userId) {
            dispatch(removeFromFavorites(userId, productId))
                .then(() => {
                })
                .catch(error => {
                    console.error('Error removing from wishlist:', error);
                });
        }
    };

    if (!favorites.length) {
        return (
            <div className="text-center py-12">
                <Heart size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900">
                    Tu lista de deseos está vacía
                </h3>
                <p className="text-gray-500 mt-2">
                    Guarda tus productos favoritos para verlos más tarde
                </p>
                <Link 
                    to="/products"
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                    Explorar productos
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Lista de Deseos</h2>
                <span className="text-sm text-gray-500">
                    {favorites.length} {favorites.length === 1 ? 'producto' : 'productos'}
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {favorites.map((product) => (
                    <div 
                        key={product.id}
                        className="border rounded-lg p-4 flex space-x-4 hover:shadow-md transition-shadow"
                    >
                        {/* Imagen del producto */}
                        <div className="w-32 h-32">
                            <img
                                src={product.image_url}
                                alt={product.name}
                                className="w-full h-full object-cover rounded"
                            />
                        </div>

                        {/* Información del producto */}
                        <div className="flex-1 space-y-2">
                            <Link 
                                to={`/products/${product.id}`}
                                className="text-lg font-medium hover:text-blue-600"
                            >
                                {product.name}
                            </Link>
                            
                            <div className="text-sm text-gray-500">
                                {product.category} • {product.brand}
                            </div>

                            {/* Precio y stock */}
                            <div className="flex justify-between items-center">
                                <div className="text-lg font-bold">
                                    ${parseFloat(product.price).toFixed(2)}
                                </div>
                                {product.stock > 0 ? (
                                    <span className="text-sm text-green-600">
                                        En stock
                                    </span>
                                ) : (
                                    <span className="text-sm text-red-600 flex items-center">
                                        <AlertCircle size={16} className="mr-1" />
                                        Sin stock
                                    </span>
                                )}
                            </div>

                            {/* Botones de acción */}
                            <div className="flex justify-end space-x-2">
                                <button
                                    onClick={() => handleRemoveFromWishlist(product.id)}
                                    className="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-100"
                                    title="Eliminar de favoritos"
                                >
                                    <Trash2 size={20} />
                                </button>
                                
                                <button
                                    onClick={() => handleAddToCart(product)}
                                    disabled={product.stock === 0}
                                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                                        product.stock > 0
                                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }`}
                                >
                                    <ShoppingCart size={20} />
                                    <span>Agregar al carrito</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Wishlist;