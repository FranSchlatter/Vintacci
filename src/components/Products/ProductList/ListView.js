import React from 'react';
// import { Heart } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { addToCart } from '../../../redux/actions/cartActions';
// import { addToFavorites } from '../../../redux/actions/favoriteActions';

const ListView = ({ products }) => {
  const dispatch = useDispatch();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price);
  };

  return (
    <div className="space-y-4">
      {products.map(product => {
        const mainVariant = product.ProductVariants[0];

        return (
          <div 
            key={product.id}
            className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-4"
          >
            <div className="flex gap-6">
              {/* Imagen */}
              <div className="relative w-48 h-48 flex-shrink-0">
                <Link to={`/products/${product.id}`}>
                  <img
                    src={product.image_url[0]}
                    alt={product.name}
                    className="w-full h-full object-contain rounded-lg group-hover:scale-105 transition-transform duration-200"
                  />
                </Link>
                {/* {priceInfo?.hasDiscount && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs font-medium rounded">
                    Oferta
                  </div>
                )} */}
              </div>

              {/* Información del producto */}
              <div className="flex-1 space-y-3">
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide">
                    {product.Category?.name}
                  </div>
                  <Link 
                    to={`/products/${product.id}`}
                    className="block text-lg font-medium text-gray-800 hover:text-blue-600"
                  >
                    {product.name}
                  </Link>
                </div>

                <p className="text-gray-600 text-sm line-clamp-2">
                  {product.description}
                </p>

                <div className="flex flex-wrap gap-1">
                  {product.Tags?.map(tag => (
                    <span
                      key={tag.id}
                      className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-3">
                  <div className="space-y-1">
                    <div className="flex items-baseline space-x-2">
                    <span className="text-sm text-gray-500">
                      {formatPrice(product.price)}
                    </span>
                      {/* {priceInfo?.hasDiscount && (
                        <span className="text-sm text-gray-500 line-through">
                          {formatPrice(priceInfo.originalPrice)}
                        </span>
                      )}
                      <span className={`text-xl font-medium ${priceInfo?.hasDiscount ? 'text-red-600' : 'text-gray-900'}`}>
                        {(() => {
                          const priceRange = getProductPriceRange(product);
                          if (!priceRange) return 'Encargar';
                          if (!priceRange.hasMultiplePrices) return formatPrice(priceRange.min);
                          return `${formatPrice(priceRange.min)} - ${formatPrice(priceRange.max)}`;
                        })()}
                      </span> */}
                    </div>
                    {/* <div className="text-sm text-gray-500">
                      {product.ProductVariants.length} variantes disponibles
                    </div> */}
                  </div>

                  <div className="flex gap-2">
                    {/* <button
                      onClick={() => dispatch(addToFavorites(product))}
                      className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                      title="Agregar a favoritos"
                    >
                      <Heart className="h-5 w-5 text-gray-600" />
                    </button> */}
                    <button
                      onClick={() => dispatch(addToCart({ product, variant: mainVariant, quantity: 1 }))}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Agregar al carrito
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ListView;