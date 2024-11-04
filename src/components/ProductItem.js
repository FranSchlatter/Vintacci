import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/actions/cartActions';
import { Heart, ShoppingCart, Package, Ruler, Palette } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../components/ui/tooltip";
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { addToFavorites, removeFromFavorites } from '../redux/actions/favoriteActions';

const ProductCard = ({ product }) => {
  const currentUser = useSelector(state => state.auth.currentUser);
  const favorites = useSelector(state => state.favorites.items);
  const isFavorite = favorites.some(fav => fav.product_id === product.id);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleFavoriteClick = async (e) => {
    e.stopPropagation();
    if (!currentUser) {
      toast.error('Debes iniciar sesión para agregar favoritos');
      return;
    }

    try {
      if (isFavorite) {
        await dispatch(removeFromFavorites(currentUser.id, product.id));
      } else {
        await dispatch(addToFavorites(currentUser.id, product.id));
      }
    } catch (error) {
      toast.error('Error al gestionar favoritos');
    }
};

  const handleClick = () => {
    navigate(`/products/${product.id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    dispatch(addToCart(product));
    toast.success('¡Producto agregado al carrito!', { position: "bottom-right", autoClose: 2000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, style: { background: '#4B5563', color: 'white' }});
  };

  return (
    <Card className="w-full max-w-sm transition-all duration-300 hover:shadow-xl cursor-pointer group" onClick={handleClick}>
      <CardHeader className="p-0 relative">
        <div className="relative h-64 overflow-hidden">
          <img 
            src={product.image_url} 
            alt={product.name}
            className="w-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <button 
            onClick={handleFavoriteClick}
            className="absolute top-2 right-2 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
          >
            <Heart 
              className={`h-5 w-5 ${isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-600'}`} 
            />
          </button>
          {product.stock < 5 && (
            <Badge variant="destructive" className="absolute bottom-2 left-2">
              ¡Últimas unidades!
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
            <span className="font-bold text-lg">${product.price}</span>
          </div>
          
          <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
          
          <div className="flex gap-2 flex-wrap">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Package className="h-3 w-3" />
                    {product.brand}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>Marca</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Ruler className="h-3 w-3" />
                    {product.size}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>Talla</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Palette className="h-3 w-3" />
                    {product.color}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>Color</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <button
          onClick={handleAddToCart}
          className="w-full bg-black hover:bg-gray-800 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          <ShoppingCart className="h-5 w-5" />
          Agregar al carrito
        </button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;