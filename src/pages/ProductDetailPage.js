import React, { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/actions/cartActions';
import { fetchProductById } from '../redux/actions/productActions';
// import { Heart, ShoppingCart } from 'lucide-react';
import { ShoppingCart } from 'lucide-react';
import { toast } from 'react-toastify';
// import { addToFavorites, removeFromFavorites } from '../redux/actions/favoriteActions';

const ProductDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentProduct: product, loading, error } = useSelector((state) => state.products);
  // const currentUser = useSelector(state => state.auth.currentUser);
  // const favorites = useSelector(state => state.favorites.items);
  // const isFavorite = favorites.some(fav => fav.product_id === product?.id);

  const [selectedOptions, setSelectedOptions] = useState({});
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [hoveredBadge, setHoveredBadge] = useState(null);
  const [customText, setCustomText] = useState("");

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

  // Traducir tipos de opciones
  const getTranslatedType = (type) => {
    const translations = {
      size: 'Talle',
      badge: 'Parche',
      customize: 'Dorsal'
    };
    return translations[type] || type;
  };

  // Ordenar talles correctamente
  const sortSizes = (sizes) => {
    const sizeOrder = ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'];
    const kidSizeOrder = ['2', '4', '6', '8', '10', '12', '14', '16'];
    
    return [...sizes].sort((a, b) => {
      // Primero verificamos si son talles de adultos
      const aAdultIndex = sizeOrder.indexOf(a.name);
      const bAdultIndex = sizeOrder.indexOf(b.name);
      
      // Si ambos son talles de adultos, ordenamos por la lista sizeOrder
      if (aAdultIndex !== -1 && bAdultIndex !== -1) {
        return aAdultIndex - bAdultIndex;
      }
      
      // Si solo uno es talle de adulto, este va después del talle de niño
      if (aAdultIndex !== -1) return 1;
      if (bAdultIndex !== -1) return -1;
      
      // Si llegamos aquí, asumimos que son talles de niños
      const aKidIndex = kidSizeOrder.indexOf(a.name);
      const bKidIndex = kidSizeOrder.indexOf(b.name);
      
      if (aKidIndex !== -1 && bKidIndex !== -1) {
        return aKidIndex - bKidIndex;
      }
      
      // Si no podemos determinar el orden, mantenemos el orden original
      return 0;
    });
  };

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
      
      // Definir el orden de selección de opciones (primero size, luego badge, luego customize)
      const typeOrder = ['size', 'badge', 'customize'];
      
      typeOrder.forEach(type => {
        if (uniqueOptionsByType[type]?.length > 0) {
          const options = type === 'size' 
            ? sortSizes(uniqueOptionsByType[type])
            : uniqueOptionsByType[type];
            
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

  // Determinar qué tipos de opciones mostrar (solo aquellos con más de una opción)
  const typesToShow = useMemo(() => {
    return Object.entries(uniqueOptionsByType)
      .filter(([_, options]) => options.length > 1)
      .map(([type]) => type);
  }, [uniqueOptionsByType]);

  // Ordenar los tipos según el orden requerido
  const orderedTypes = useMemo(() => {
    const typeOrder = ['size', 'badge', 'customize'];
    return typesToShow.sort((a, b) => {
      return typeOrder.indexOf(a) - typeOrder.indexOf(b);
    });
  }, [typesToShow]);

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
                  <div className="relative w-full h-full">
                    <img
                      src={img}
                      alt={`${product.name} - vista ${index + 1}`}
                      className="w-full h-full object-contain"
                    />
                    {/* Etiqueta para miniaturas */}
                    {index > 0 && (
                      <div className="absolute bottom-0 left-0 w-2/5 h-1/5 bg-white/95 backdrop-blur-sm rounded-tr-md shadow-sm flex items-center justify-center">
                        <p className="text-[6px] font-medium text-gray-800">Importado</p>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Imagen principal con tamaño fijo */}
            <div className="relative flex-1">
              <div className="aspect-square w-full relative overflow-hidden">
                <img
                  src={images[selectedImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
                
                {/* Etiqueta con texto estilizado para la imagen principal */}
                {selectedImageIndex > 0 && (
                  <div className="absolute bottom-0 left-0 w-2/5 h-1/5 flex items-center justify-start">
                    <div className="px-4 py-2 bg-white/95 backdrop-blur-sm rounded-tr-lg shadow-sm w-full h-full flex flex-col justify-center">
                      <p className="text-sm font-bold text-gray-800 leading-tight">Producto <span className="text-blue-600">IMPORTADO</span></p>
                      <p className="text-xs font-medium text-gray-700 leading-tight">Calidad <span className="font-extrabold">ORIGINAL</span></p>
                      <p className="text-xs italic text-gray-600 mt-0.5 leading-tight">Disponible por encargue</p>
                    </div>
                  </div>
                )}
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

          {/* Selectores de opciones (solo mostrando los que tienen más de una opción) */}
          <div className="space-y-6">
            {orderedTypes.map(type => {
              const options = type === 'size' 
                ? sortSizes(uniqueOptionsByType[type]) 
                : uniqueOptionsByType[type];
              
              return (
                <div key={type}>
                  <div className="flex justify-between items-baseline mb-2">
                    <label className="text-sm font-medium capitalize">{getTranslatedType(type)}</label>
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
                          onMouseEnter={() => type === 'badge' && setHoveredBadge(option)}
                          onMouseLeave={() => setHoveredBadge(null)}
                          className={`px-4 py-2 text-sm rounded-full transition-colors flex items-center gap-2 ${
                            selectedOptions[type] === option.id
                              ? 'bg-black text-white'
                              : 'bg-gray-100 hover:bg-gray-200'
                          }`}
                        >
                          {type === 'badge' && option.image_url && (
                            <img 
                              src={option.image_url} 
                              alt={option.name}
                              className="w-6 h-6 object-contain rounded-full"
                            />
                          )}
                          {option.name}
                        </button>
                        
                        {/* Preview ampliada al hacer hover */}
                        {hoveredBadge?.id === option.id && type === 'badge' && option.image_url && (
                          <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-white rounded-lg shadow-lg p-2">
                            <img 
                              src={option.image_url} 
                              alt={option.name}
                              className="w-32 h-32 object-contain rounded-lg"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {/* Campo de texto para customización */}
                  {type === 'customize' && (
                    <div className="mt-2">
                      <input
                        type="text"
                        value={customText}
                        onChange={(e) => setCustomText(e.target.value)}
                        placeholder="Ejemplo: #10 Messi"
                        className="w-full px-4 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Botón de compra */}
          <button
            onClick={() => {
              if (!selectedVariant) return;
              
              // Encontramos las opciones seleccionadas con toda su información
              const selectedOptionsWithDetails = Object.entries(selectedOptions).map(([type, optionId]) => {
                const option = uniqueOptionsByType[type].find(opt => opt.id === optionId);
                return {
                  type,
                  id: optionId,
                  name: option.name,
                  price: option.price,
                };
              });
              
              // Creamos el objeto para el carrito
              const cartItem = {
                id: selectedVariant.id,
                productId: product.id,
                name: product.name,
                description: product.description,
                image_url: product.image_url,
                price: selectedVariant.price,
                quantity: 1,
                sku: selectedVariant.sku,
                selectedOptions: selectedOptionsWithDetails,
                customText: orderedTypes.includes('customize') ? customText : null,
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