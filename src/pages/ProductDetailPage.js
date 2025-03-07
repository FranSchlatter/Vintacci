import React, { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/actions/cartActions';
import { fetchProductById } from '../redux/actions/productActions';
import { ShoppingCart } from 'lucide-react';
import { toast } from 'react-toastify';

const ProductDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentProduct: product, loading, error } = useSelector((state) => state.products);

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
    <div className="min-h-screen bg-gray-50 pt-8 pb-16">
      {/* Breadcrumb navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
        <nav className="text-sm">
          <ol className="list-none p-0 inline-flex">
            <li className="flex items-center">
              <a href="/" className="text-gray-500 hover:text-gray-700">Inicio</a>
              <span className="mx-2 text-gray-400">/</span>
            </li>
            <li className="flex items-center">
              <a href="/products" className="text-gray-500 hover:text-gray-700">Productos</a>
              <span className="mx-2 text-gray-400">/</span>
            </li>
            <li className="flex items-center">
              <span className="text-gray-800 font-medium">{product.name}</span>
            </li>
          </ol>
        </nav>
      </div>

      {/* Product content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Image section */}
            <div className="p-6 lg:p-8 bg-gray-50">
              <div className="flex flex-col h-full">
                {/* Main image with aspect ratio */}
                <div className="relative mb-4 bg-white rounded-xl shadow-sm p-4">
                  <div className="aspect-square w-full relative overflow-hidden">
                    <img
                      src={images[selectedImageIndex]}
                      alt={product.name}
                      className="w-full h-full object-contain rounded-lg transition-opacity duration-300"
                    />
                    
                    {/* Etiqueta para la imagen principal */}
                    {selectedImageIndex > 0 && (
                      <div className="absolute bottom-1 left-1 max-w-[180px]">
                        <div className="px-4 py-3 bg-white/95 backdrop-blur-sm rounded-lg shadow-md">
                          <p className="text-xs font-bold text-gray-800 leading-tight">Producto <span className="text-blue-600">IMPORTADO</span></p>
                          <p className="text-xs font-medium text-gray-700 leading-tight">Calidad <span className="font-extrabold">ORIGINAL</span></p>
                          <p className="text-xs italic text-gray-600 mt-0.5 leading-tight">Disponible por encargue</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Thumbnails - horizontal scrolling in all views */}
                <div className="flex overflow-x-auto gap-3 pb-2 px-1 hide-scrollbar">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`w-20 h-20 flex-shrink-0 border-2 rounded-lg mt-2 overflow-hidden shadow-sm transition-all hover:scale-105 ${
                        selectedImageIndex === index 
                          ? 'border-black scale-105' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="relative w-full h-full bg-white">
                        <img
                          src={img}
                          alt={`${product.name} - vista ${index + 1}`}
                          className="w-full h-full object-contain p-1"
                        />
                        {index > 0 && (
                          <div className="absolute bottom-0 left-0 w-6 h-4 bg-white rounded-tr-md flex items-center justify-center">
                            <span className="text-[6px] font-bold text-black">INFO</span>
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Product info section */}
            <div className="p-6 lg:p-8 flex flex-col">
              <div className="flex-1">
                {/* Title and price section */}
                <div className="border-b border-gray-200 pb-6 mb-6">
                  <h1 className="text-2xl sm:text-2xl font-bold mb-2 text-gray-900">{product.name}</h1>
                  <div className="flex items-baseline gap-3">
                    <p className="text-2xl font-bold text-gray-900">${Number(product.price).toLocaleString()}</p>
                    {product.compare_at_price && product.compare_at_price > product.price && (
                      <p className="text-lg text-gray-500 line-through">${Number(product.compare_at_price).toLocaleString()}</p>
                    )}
                  </div>
                </div>

                {/* Description section */}
                <div className="mb-8 prose prose-sm max-w-none text-gray-600">
                  <p className="whitespace-pre-line">{product.description}</p>
                </div>

                {/* Options section */}
                <div className="space-y-6">
                  {orderedTypes.map(type => {
                    const options = type === 'size' 
                      ? sortSizes(uniqueOptionsByType[type]) 
                      : uniqueOptionsByType[type];
                    
                    return (
                      <div key={type} className="border rounded-lg p-4 bg-gray-50">
                        <div className="flex justify-between items-baseline mb-3">
                          <label className="text-sm font-semibold capitalize text-gray-800">{getTranslatedType(type)}</label>
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
                                className={`px-4 py-2 text-sm rounded-lg transition-all flex items-center gap-2 ${
                                  selectedOptions[type] === option.id
                                    ? 'bg-black text-white shadow-md scale-105'
                                    : 'bg-white border border-gray-200 hover:bg-gray-100 hover:border-gray-300'
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
                          <div className="mt-3">
                            <input
                              type="text"
                              value={customText}
                              onChange={(e) => setCustomText(e.target.value)}
                              placeholder="Ejemplo: #10 Messi"
                              className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent bg-white"
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Actions area */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row gap-4">
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
                    className={`w-full sm:flex-1 py-4 px-6 flex items-center justify-center gap-2 text-base font-medium rounded-lg shadow-sm transition-all transform hover:translate-y-[-2px] ${
                      selectedVariant ? 'bg-black text-white hover:bg-gray-900' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <ShoppingCart className="h-5 w-5" />
                    {selectedVariant ? `Agregar al carrito - $${Number(selectedVariant.price).toLocaleString()}` : 'Selecciona las opciones'}
                  </button>
                </div>

                {/* Additional product info */}
                <div className="mt-6 flex flex-wrap gap-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 10C20 16 12 22 12 22C12 22 4 16 4 10C4 7.87827 4.84285 5.84344 6.34315 4.34315C7.84344 2.84285 9.87827 2 12 2C14.1217 2 16.1566 2.84285 17.6569 4.34315C19.1571 5.84344 20 7.87827 20 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Envío a todo el país
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Tiempo de entrega: 20-30 días hábiles
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19 14C20.49 12.54 22 10.79 22 8.5C22 7.04131 21.4205 5.64236 20.3891 4.61091C19.3576 3.57946 17.9587 3 16.5 3C14.74 3 13.5 3.5 12 5C10.5 3.5 9.26 3 7.5 3C6.04131 3 4.64236 3.57946 3.61091 4.61091C2.57946 5.64236 2 7.04131 2 8.5C2 10.8 3.5 12.55 5 14L12 21L19 14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Garantía de calidad
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Estilos adicionales */}
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default ProductDetailPage;