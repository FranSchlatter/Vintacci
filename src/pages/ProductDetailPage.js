// import { useNavigate } from 'react-router-dom';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/actions/cartActions';
import { fetchProductId } from '../redux/actions/productActions';
import { Package, Ruler, Palette, Calendar, Tag, ShoppingCart, Users } from 'lucide-react'; //   Fabric
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { toast } from 'react-toastify';
import { Heart } from 'lucide-react';
import { addToFavorites, removeFromFavorites } from '../redux/actions/favoriteActions';

const ProductDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const product = useSelector((state) => state.products.idProduct);
  const currentUser = useSelector(state => state.auth.currentUser);
  const favorites = useSelector(state => state.favorites.items);
  const isFavorite = favorites.some(fav => fav.product_id === product.id);

  useEffect(() => {
    dispatch(fetchProductId(id));
  }, [id, dispatch]);

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
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
                src={product.image_url}
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
            {product.stock < 5 && (
              <Badge variant="destructive" className="absolute top-4 right-4">
                ¡Últimas {product.stock} unidades!
              </Badge>
            )}
          </div>

          {/* Información del producto */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">{product.name}</h1>
              <p className="text-xl font-semibold mt-2">${product.price}</p>
            </div>

            <p className="text-gray-600">{product.description}</p>

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
                  <Calendar className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Era</p>
                    <p className="font-medium">{product.era}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex items-center gap-2 p-4">
                  <Tag className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Estilo</p>
                    <p className="font-medium">{product.style}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex items-center gap-2 p-4">
                  <Users className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Género</p>
                    <p className="font-medium">{product.sex}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details">Detalles</TabsTrigger>
                <TabsTrigger value="specs">Especificaciones</TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Ruler className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">Talla: {product.size}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Palette className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">Color: {product.color}</span>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="specs" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    {/* <Fabric className="h-4 w-4 text-gray-500" /> */}
                    <span className="text-sm">Material: {product.material}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">Serial: {product.serial_number}</span>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <button
              onClick={() => {
                dispatch(addToCart(product)) 
                toast.success('¡Producto agregado al carrito!', { position: "bottom-right", autoClose: 2000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, style: { background: '#4B5563', color: 'white' }});
              }}
              className="w-full bg-black hover:bg-gray-800 text-white py-4 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <ShoppingCart className="h-5 w-5" />
              Agregar al carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;