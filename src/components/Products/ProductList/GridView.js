import React from 'react';
import { Heart, ShoppingCart } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { addToCart } from '../../../redux/actions/cartActions';
import { addToFavorites } from '../../../redux/actions/favoriteActions';

const GridView = ({ products }) => {
  const dispatch = useDispatch();

  // Función para mostrar el precio con el formato correcto
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price);
  };

  const getProductPriceRange = (product) => {
    const activeVariants = product.ProductVariants.filter(v => 
      v.status === 'active' && v.stock > 0
    );
  
    if (!activeVariants.length) return null;
  
    const prices = activeVariants.map(variant => {
      const currentDate = new Date();
      const hasValidDiscount = variant.discountPrice && 
        new Date(variant.discountStart) <= currentDate &&
        new Date(variant.discountEnd) >= currentDate;
  
      return hasValidDiscount ? Number(variant.discountPrice) : Number(variant.price);
    });
  
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
      hasMultiplePrices: Math.min(...prices) !== Math.max(...prices)
    };
  };

  // Función para determinar el precio a mostrar (normal o con descuento)
  const getDisplayPrice = (product) => {
    const mainVariant = product.ProductVariants[0];
    if (!mainVariant) return null;

    const hasValidDiscount = mainVariant.discountPrice && 
                           new Date(mainVariant.discountStart) <= new Date() &&
                           new Date(mainVariant.discountEnd) >= new Date();

    return {
      currentPrice: hasValidDiscount ? mainVariant.discountPrice : mainVariant.price,
      originalPrice: hasValidDiscount ? mainVariant.price : null,
      hasDiscount: hasValidDiscount
    };
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map(product => {
        const mainVariant = product.ProductVariants[0];
        const priceInfo = getDisplayPrice(product);
        
        return (
          <div 
            key={product.id}
            className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            {/* Imagen y acciones rápidas */}
            <div className="relative aspect-square overflow-hidden rounded-t-lg">
              <Link to={`/products/${product.id}`}>
                <img
                  src={mainVariant?.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
              </Link>

              {/* Botones de acción rápida */}
              <div className="absolute top-2 right-2 space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                  onClick={() => dispatch(addToFavorites(product))}
                  className="p-2 bg-white rounded-full shadow hover:bg-gray-100 transition-colors"
                  title="Agregar a favoritos"
                >
                  <Heart className="h-5 w-5 text-gray-600" />
                </button>
                <button
                  onClick={() => dispatch(addToCart({ product, variant: mainVariant, quantity: 1 }))}
                  className="p-2 bg-white rounded-full shadow hover:bg-gray-100 transition-colors"
                  title="Agregar al carrito"
                >
                  <ShoppingCart className="h-5 w-5 text-gray-600" />
                </button>
              </div>

              {/* Badge de descuento */}
              {priceInfo?.hasDiscount && (
                <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs font-medium rounded">
                  Oferta
                </div>
              )}
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

              {/* Precios */}
              <div className="flex items-baseline space-x-2">
                {priceInfo?.hasDiscount && (
                  <span className="text-sm text-gray-500 line-through">
                    {formatPrice(priceInfo.originalPrice)}
                  </span>
                )}
                <span className={`text-lg font-medium ${priceInfo?.hasDiscount ? 'text-red-600' : 'text-gray-900'}`}>
                  {(() => {
                    const priceRange = getProductPriceRange(product);
                    if (!priceRange) return 'No disponible';
                    if (!priceRange.hasMultiplePrices) return formatPrice(priceRange.min);
                    return `${formatPrice(priceRange.min)} - ${formatPrice(priceRange.max)}`;
                  })()}
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

              {/* Variantes disponibles */}
              <div className="pt-2 border-t">
                <div className="text-xs text-gray-500">
                  {product.ProductVariants.length} variantes disponibles
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default GridView;