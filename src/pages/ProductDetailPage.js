import React, { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/actions/cartActions';
import { fetchProductById } from '../redux/actions/productActions';
import { Heart, ShoppingCart } from 'lucide-react';
import { toast } from 'react-toastify';
import { addToFavorites, removeFromFavorites } from '../redux/actions/favoriteActions';

const ProductDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentProduct: product, loading, error } = useSelector((state) => state.products);
  const currentUser = useSelector(state => state.auth.currentUser);
  const favorites = useSelector(state => state.favorites.items);
  const isFavorite = favorites.some(fav => fav.product_id === product?.id);

  const [selectedOptions, setSelectedOptions] = useState({});
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [hoveredBadge, setHoveredBadge] = useState(null);

  // Normalizar el array de imágenes
  const images = useMemo(() => {
    if (!product?.image_url) return [];
    return Array.isArray(product.image_url) ? product.image_url : [product.image_url];
  }, [product]);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    }
  }, [id, dispatch]);

  // Agrupar y deduplicar opciones por tipo
  const optionsByType = useMemo(() => {
    if (!product?.ProductVariants) return {};
    
    return product.ProductVariants.reduce((acc, variant) => {
      variant.ProductOptions.forEach(option => {
        if (!acc[option.type]) {
          acc[option.type] = new Map();
        }
        acc[option.type].set(option.id, option);
      });
      return acc;
    }, {});
  }, [product]);

  // Convertir Map a Array para renderizado
  const uniqueOptionsByType = useMemo(() => {
    return Object.entries(optionsByType).reduce((acc, [type, optionsMap]) => {
      acc[type] = Array.from(optionsMap.values());
      return acc;
    }, {});
  }, [optionsByType]);

  // Actualizar variante seleccionada cuando cambian las opciones
  useEffect(() => {
    if (!product?.ProductVariants) return;

    const variant = product.ProductVariants.find(v => {
      return v.ProductOptions.every(opt => 
        selectedOptions[opt.type] === opt.id
      );
    });

    setSelectedVariant(variant || null);
  }, [selectedOptions, product]);

  // Preseleccionar primera opción de cada tipo
  useEffect(() => {
    if (Object.keys(uniqueOptionsByType).length > 0) {
      const initialSelections = {};
      Object.entries(uniqueOptionsByType).forEach(([type, options]) => {
        if (options.length > 0) {
          initialSelections[type] = options[0].id;
        }
      });
      setSelectedOptions(initialSelections);
    }
  }, [uniqueOptionsByType]);

  const handleOptionSelect = (type, optionId) => {
    setSelectedOptions(prev => ({
      ...prev,
      [type]: optionId
    }));
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin" />
    </div>;
  }

  if (error || !product) {
    return <div className="min-h-screen flex items-center justify-center text-gray-600">
      {error || 'Producto no encontrado'}
    </div>;
  }

  return (
    <div className="min-h-screen bg-white py-8 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Sección de imágenes con layout ajustado */}
        <div className="relative">
          {/* Contenedor principal de imágenes con flex */}
          <div className="flex gap-4">
            {/* Miniaturas verticales con altura máxima y scroll */}
            <div className="flex flex-col gap-2 max-h-[500px] overflow-y-auto">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`w-16 h-16 flex-shrink-0 border-2 rounded overflow-hidden transition-colors ${
                    selectedImageIndex === index 
                      ? 'border-black' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} - vista ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Imagen principal con tamaño fijo */}
            <div className="relative flex-1">
              <div className="aspect-square w-full">
                <img
                  src={images[selectedImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <button 
                  onClick={() => {
                    if (!currentUser) {
                      toast.error('Debes iniciar sesión para agregar favoritos');
                      return;
                    }
                    if (isFavorite) {
                      dispatch(removeFromFavorites(currentUser.id, product.id));
                    } else {
                      dispatch(addToFavorites(currentUser.id, product.id));
                    }
                  }}
                  className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-sm"
                >
                  <Heart className={`h-5 w-5 ${isFavorite ? 'fill-black' : ''}`} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Información del producto */}
        <div className="flex flex-col space-y-6">
          <div>
            <h1 className="text-2xl font-semibold mb-2">{product.name}</h1>
            <p className="text-xl font-medium">${Number(product.price).toLocaleString()}</p>
          </div>

          <div className="prose prose-sm">
            <p className="whitespace-pre-line">{product.description}</p>
          </div>

          {/* Selectores de opciones */}
          <div className="space-y-6">
            {Object.entries(uniqueOptionsByType).map(([type, options]) => (
              <div key={type}>
                <div className="flex justify-between items-baseline mb-2">
                  <label className="text-sm font-medium capitalize">{type}</label>
                  {options.find(opt => opt.id === selectedOptions[type])?.price > 0 && (
                    <span className="text-sm text-gray-500">
                      +${Number(options.find(opt => opt.id === selectedOptions[type])?.price).toLocaleString()}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {options.map(option => (
                    <div key={option.id} className="relative">
                      <button
                        onClick={() => handleOptionSelect(type, option.id)}
                        onMouseEnter={() => option.type === 'badge' && setHoveredBadge(option)}
                        onMouseLeave={() => setHoveredBadge(null)}
                        className={`px-4 py-2 text-sm rounded-full transition-colors flex items-center gap-2 ${
                          selectedOptions[type] === option.id
                            ? 'bg-black text-white'
                            : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                      >
                        {option.type === 'badge' && option.image_url && (
                          <img 
                            src={option.image_url} 
                            alt={option.name}
                            className="w-6 h-6 object-cover rounded-full"
                          />
                        )}
                        {option.name}
                      </button>
                      
                      {/* Preview ampliada al hacer hover */}
                      {hoveredBadge?.id === option.id && option.type === 'badge' && option.image_url && (
                        <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-white rounded-lg shadow-lg p-2">
                          <img 
                            src={option.image_url} 
                            alt={option.name}
                            className="w-32 h-32 object-cover rounded-lg"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Botón de compra */}
          <button
            onClick={() => {
              if (!selectedVariant) return;
              
              const cartItem = {
                ...selectedVariant,
                productName: product.name,
                productId: product.id,
                selectedOptions: Object.entries(selectedOptions).map(([type, optionId]) => ({
                  type,
                  name: uniqueOptionsByType[type].find(opt => opt.id === optionId).name,
                  price: uniqueOptionsByType[type].find(opt => opt.id === optionId).price,
                  image: uniqueOptionsByType[type].find(opt => opt.id === optionId).image
                })),
                finalPrice: selectedVariant.price
              };

              dispatch(addToCart(cartItem));
              toast.success('¡Agregado al carrito!');
            }}
            disabled={!selectedVariant}
            className={`w-full py-4 flex items-center justify-center gap-2 text-sm font-medium transition-colors ${
              selectedVariant ? 'bg-black text-white hover:bg-gray-900' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            <ShoppingCart className="h-4 w-4" />
            {selectedVariant ? `Agregar - $${Number(selectedVariant.price).toLocaleString()}` : 'Selecciona las opciones'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;