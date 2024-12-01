import React, { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/actions/cartActions';
import { fetchProductById } from '../redux/actions/productActions';
import { Package, ShoppingCart, Tag } from 'lucide-react';
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { toast } from 'react-toastify';
import { Heart } from 'lucide-react';
import { addToFavorites, removeFromFavorites } from '../redux/actions/favoriteActions';

const ProductDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentProduct: product, loading, error } = useSelector((state) => state.products);
  const currentUser = useSelector(state => state.auth.currentUser);
  const favorites = useSelector(state => state.favorites.items);
  const isFavorite = favorites.some(fav => fav.product_id === product?.id);

  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    }
  }, [id, dispatch]);

  // Obtener todas las variantes activas
  const activeVariants = useMemo(() => {
    if (!product?.ProductVariants) return [];
    return product.ProductVariants.filter(variant => 
      variant.status === 'active' && variant.stock > 0
    );
  }, [product]);

  // Organizar las opciones disponibles
  const { availableColors, availableSizes, optionsByColor, optionsBySize } = useMemo(() => {
    const colorMap = new Map();
    const sizeMap = new Map();
    const byColor = new Map();
    const bySize = new Map();

    activeVariants.forEach(variant => {
      const colorOption = variant.ProductOptions.find(opt => opt.type === 'color');
      const sizeOption = variant.ProductOptions.find(opt => opt.type === 'size');

      if (colorOption && sizeOption) {
        // Agregar a colores disponibles
        colorMap.set(colorOption.id, colorOption);
        // Agregar a tallas disponibles
        sizeMap.set(sizeOption.id, sizeOption);

        // Agrupar por color
        if (!byColor.has(colorOption.id)) {
          byColor.set(colorOption.id, new Set());
        }
        byColor.get(colorOption.id).add(sizeOption.id);

        // Agrupar por talla
        if (!bySize.has(sizeOption.id)) {
          bySize.set(sizeOption.id, new Set());
        }
        bySize.get(sizeOption.id).add(colorOption.id);
      }
    });

    return {
      availableColors: Array.from(colorMap.values()),
      availableSizes: Array.from(sizeMap.values()),
      optionsByColor: byColor,
      optionsBySize: bySize
    };
  }, [activeVariants]);

  // Encontrar la variante correspondiente a las opciones seleccionadas
  useEffect(() => {
    if (selectedColor && selectedSize) {
      const variant = activeVariants.find(v => 
        v.ProductOptions.some(opt => opt.id === selectedColor) &&
        v.ProductOptions.some(opt => opt.id === selectedSize)
      );
      setSelectedVariant(variant || null);
    } else {
      setSelectedVariant(null);
    }
  }, [selectedColor, selectedSize, activeVariants]);

  // Preseleccionar la primera variante disponible
  useEffect(() => {
    if (availableColors.length && !selectedColor) {
      const firstColor = availableColors[0];
      setSelectedColor(firstColor.id);
      
      if (optionsByColor.get(firstColor.id)) {
        const availableSizesForColor = optionsByColor.get(firstColor.id);
        const firstAvailableSize = availableSizes.find(size => 
          availableSizesForColor.has(size.id)
        );
        if (firstAvailableSize) {
          setSelectedSize(firstAvailableSize.id);
        }
      }
    }
  }, [availableColors, optionsByColor, availableSizes, selectedColor]);

  // Handlers para selección de opciones
  const handleColorSelect = (colorId) => {
    setSelectedColor(colorId);
    // Si la talla actual no está disponible para este color, seleccionar la primera disponible
    const availableSizesForColor = optionsByColor.get(colorId);
    if (!availableSizesForColor?.has(selectedSize)) {
      const firstAvailableSize = availableSizes.find(size => 
        availableSizesForColor.has(size.id)
      );
      setSelectedSize(firstAvailableSize?.id || null);
    }
  };

  const handleSizeSelect = (sizeId) => {
    setSelectedSize(sizeId);
    // Si el color actual no está disponible para esta talla, seleccionar el primero disponible
    const availableColorsForSize = optionsBySize.get(sizeId);
    if (!availableColorsForSize?.has(selectedColor)) {
      const firstAvailableColor = availableColors.find(color => 
        availableColorsForSize.has(color.id)
      );
      setSelectedColor(firstAvailableColor?.id || null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600">Error al cargar el producto: {error}</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">No se encontró el producto</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Imagen del producto */}
          <div className="relative group">
            <div className="aspect-square overflow-hidden rounded-xl bg-gray-100">
              <img
                src={selectedVariant?.image_url || activeVariants[0]?.image_url}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
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
              className="absolute top-4 left-4 p-3 bg-white/80 rounded-full hover:bg-white transition-colors shadow-sm"
            >
              <Heart 
                className={`h-6 w-6 ${isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-600'}`} 
              />
            </button>
            {selectedVariant?.stock < 5 && selectedVariant?.stock > 0 && (
              <Badge variant="destructive" className="absolute top-4 right-4">
                ¡Últimas {selectedVariant.stock} unidades!
              </Badge>
            )}
          </div>

          {/* Información del producto */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">{product.name}</h1>
              {selectedVariant && (
                <div className="mt-2">
                  {selectedVariant.discountPrice ? (
                    <div className="flex items-center gap-2">
                      <p className="text-xl font-semibold text-red-600">${selectedVariant.discountPrice}</p>
                      <p className="text-lg text-gray-500 line-through">${selectedVariant.price}</p>
                    </div>
                  ) : (
                    <p className="text-xl font-semibold">${selectedVariant.price}</p>
                  )}
                </div>
              )}
            </div>

            <p className="text-gray-600">{product.description}</p>

            {/* Selector de Color */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">Color</label>
              <div className="flex gap-2">
                {availableColors.map(color => {
                  const isAvailable = !selectedSize || optionsBySize.get(selectedSize)?.has(color.id);
                  return (
                    <button
                      key={color.id}
                      onClick={() => isAvailable && handleColorSelect(color.id)}
                      className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                        selectedColor === color.id 
                          ? 'border-black ring-2 ring-black ring-offset-2' 
                          : 'border-transparent'
                      } ${
                        !isAvailable 
                          ? 'opacity-30 cursor-not-allowed' 
                          : 'hover:border-gray-400'
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                      disabled={!isAvailable}
                    />
                  );
                })}
              </div>
            </div>

            {/* Selector de Talla */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">Talla</label>
              <div className="flex gap-2">
                {availableSizes.map(size => {
                  const isAvailable = !selectedColor || optionsByColor.get(selectedColor)?.has(size.id);
                  return (
                    <button
                      key={size.id}
                      onClick={() => isAvailable && handleSizeSelect(size.id)}
                      className={`px-3 py-2 border rounded-md transition-all duration-200 ${
                        selectedSize === size.id 
                          ? 'border-black bg-black text-white' 
                          : 'border-gray-300'
                      } ${
                        !isAvailable 
                          ? 'opacity-30 cursor-not-allowed' 
                          : 'hover:border-gray-400'
                      }`}
                      disabled={!isAvailable}
                    >
                      {size.value}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="flex items-center gap-2 p-4">
                  <Package className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Marca</p>
                    <p className="font-medium">{product.brand}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex items-center gap-2 p-4">
                  <Tag className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Tags</p>
                    <p className="font-medium">
                      {product.Tags.map(tag => tag.name).join(', ')}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <button
              onClick={() => {
                if (!selectedVariant) {
                  toast.error('Por favor selecciona color y talla');
                  return;
                }
                if (selectedVariant.stock === 0) {
                  toast.error('Producto sin stock disponible');
                  return;
                }
                dispatch(addToCart({
                  ...selectedVariant,
                  productName: product.name,
                  productId: product.id
                }));
                toast.success('¡Producto agregado al carrito!', {
                  position: "bottom-right",
                  autoClose: 2000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  style: { background: '#4B5563', color: 'white' }
                });
              }}
              disabled={!selectedVariant || selectedVariant.stock === 0}
              className={`w-full py-4 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors ${
                !selectedVariant || selectedVariant.stock === 0
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-black hover:bg-gray-800 text-white'
              }`}
            >
              <ShoppingCart className="h-5 w-5" />
              {selectedVariant?.stock === 0 ? 'Sin stock' : 'Agregar al carrito'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;