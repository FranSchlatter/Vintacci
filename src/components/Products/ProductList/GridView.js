import React from 'react';
// import { Heart, ShoppingCart } from 'lucide-react';
import { ShoppingCart } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { addToCart } from '../../../redux/actions/cartActions';
import { toast } from 'react-toastify';
// import { addToFavorites } from '../../../redux/actions/favoriteActions';

const GridView = ({ products }) => {
  const dispatch = useDispatch();

  // Función para mostrar el precio con el formato correcto
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map(product => {
        const mainVariant = product.ProductVariants[0];
        // const priceInfo = getDisplayPrice(product);
        
        return (
          <div 
            key={product.id}
            className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            {/* Imagen y acciones rápidas */}
            <div className="relative aspect-square overflow-hidden rounded-t-lg">
              <Link to={`/products/${product.id}`}>
                <img
                  src={product.image_url[0]}
                  alt={product.name}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
                />
              </Link>

              {/* Botones de acción rápida */}
              <div className="absolute top-2 right-2 space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                {/* <button
                  onClick={() => dispatch(addToFavorites(product))}
                  className="p-2 bg-white rounded-full shadow hover:bg-gray-100 transition-colors"
                  title="Agregar a favoritos"
                >
                  <Heart className="h-5 w-5 text-gray-600" />
                </button> */}
                <button
                 onClick={() => {
                  // Creamos el objeto para el carrito
                  const cartItem = {
                        id: mainVariant.id,
                        productId: product.id,
                        name: product.name,
                        description: product.description,
                        image_url: product.image_url,
                        price: mainVariant.price,
                        quantity: 1,
                        sku: mainVariant.sku,
                        selectedOptions: null,
                        customText: null,
                      };
                      dispatch(addToCart(cartItem));
                      toast.success('¡Agregado al carrito!');
                    }}
                  className="p-2 bg-white rounded-full shadow hover:bg-gray-100 transition-colors"
                  title="Agregar al carrito"
                >
                  <ShoppingCart className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Información del producto */}
            <div className="p-4 space-y-2">
              {/* Categoría */}
              <div className="text-xs text-gray-500 uppercase tracking-wide">
                {product.Category?.name}
              </div>

              {/* Nombre del producto */}
              <Link 
                to={`/products/${product.id}`}
                className="block text-gray-800 font-medium hover:text-blue-600 truncate"
              >
                {product.name}
              </Link>

              <div className="flex items-baseline space-x-2">
                <span className="text-sm text-gray-500">
                  {formatPrice(product.price)}
                </span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {product.Tags?.slice(0, 3).map(tag => (
                  <span
                    key={tag.id}
                    className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                  >
                    {tag.name}
                  </span>
                ))}
                {product.Tags?.length > 3 && (
                  <span className="px-2 py-1 text-gray-400 text-xs">
                    +{product.Tags.length - 3}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default GridView;