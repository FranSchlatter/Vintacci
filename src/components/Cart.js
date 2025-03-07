// src/components/Cart.js
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  removeFromCart,
  updateQuantity,
  clearCart,
} from '../redux/actions/cartActions';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowLeft,
  MessageCircle,
  Tag,
} from 'lucide-react';
import { toast } from 'react-toastify';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector(state => state.cart.items);

  // Constantes
  const SHIPPING_COST = 15000;
  const FREE_SHIPPING_THRESHOLD = 200000;
  const WHATSAPP_NUMBER = '5493424365585';

  const handleRemove = id => {
    dispatch(removeFromCart(id));
    toast.success('Producto eliminado del carrito');
  };

  const handleQuantityChange = (item, increment) => {
    const newQuantity = item.quantity + increment;
    if (newQuantity < 1) return;
    // Aquí podrías agregar validación contra el stock disponible
    dispatch(updateQuantity(item.id, newQuantity));
  };

  const handleClearCart = () => {
    if (window.confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
      dispatch(clearCart());
      toast.info('Carrito vaciado');
    }
  };

  // Función para calcular promociones
  const calculatePromotions = (items) => {
    // Expandimos los items según su cantidad
    let expandedItems = [];
    items.forEach(item => {
      for (let i = 0; i < item.quantity; i++) {
        expandedItems.push({
          ...item,
          singleQuantity: 1,
          singlePrice: parseFloat(item.price),
          discountedPrice: parseFloat(item.price), // Inicialmente sin descuento
          discount: 0
        });
      }
    });

    // Ordenamos los items por precio (de mayor a menor)
    expandedItems.sort((a, b) => b.singlePrice - a.singlePrice);

    // Aplicamos las reglas de promoción
    const totalItems = expandedItems.length;
    
    // Función auxiliar para aplicar descuentos según la cantidad de productos
    const applyDiscounts = () => {
      if (totalItems <= 1) {
        // 1 producto: Precio normal
        return;
      } else if (totalItems === 2) {
        // 2 productos: 50% de descuento en el segundo (menor valor)
        const discountItem = expandedItems[1];
        discountItem.discount = discountItem.singlePrice * 0.5;
        discountItem.discountedPrice = discountItem.singlePrice - discountItem.discount;
      } else if (totalItems === 3) {
        // 3 productos: Paga 2, el de menor valor gratis
        const discountItem = expandedItems[2];
        discountItem.discount = discountItem.singlePrice;
        discountItem.discountedPrice = 0;
      } else if (totalItems === 4) {
        // 4 productos: Aplicamos la misma lógica que 3 (el de menor valor gratis)
        const discountItem = expandedItems[3];
        discountItem.discount = discountItem.singlePrice;
        discountItem.discountedPrice = 0;
      } else if (totalItems === 5) {
        // 5 productos: Paga 3, los 2 de menor valor gratis
        expandedItems[3].discount = expandedItems[3].singlePrice;
        expandedItems[3].discountedPrice = 0;
        expandedItems[4].discount = expandedItems[4].singlePrice;
        expandedItems[4].discountedPrice = 0;
      } else if (totalItems === 6) {
        // 6 productos: Aplicamos la misma lógica que 5 (los 2 de menor valor gratis)
        expandedItems[4].discount = expandedItems[4].singlePrice;
        expandedItems[4].discountedPrice = 0;
        expandedItems[5].discount = expandedItems[5].singlePrice;
        expandedItems[5].discountedPrice = 0;
      } else if (totalItems >= 7) {
        // 7 o más productos: Paga 4, los 3 de menor valor gratis
        // Corregimos el error: solo aplicamos descuento a 3 productos, no a todos los adicionales
        const itemsToDiscount = Math.min(3, totalItems - 4); // Solo descuenta hasta 3 productos
        
        for (let i = totalItems - 1; i >= totalItems - itemsToDiscount; i--) {
          expandedItems[i].discount = expandedItems[i].singlePrice;
          expandedItems[i].discountedPrice = 0;
        }
      }
    };

    applyDiscounts();

    // Calcular subtotal original (sin descuentos)
    const originalSubtotal = expandedItems.reduce(
      (total, item) => total + item.singlePrice,
      0
    );

    // Calcular subtotal con descuentos
    const discountedSubtotal = expandedItems.reduce(
      (total, item) => total + item.discountedPrice,
      0
    );

    // Calcular el total de descuento
    const totalDiscount = originalSubtotal - discountedSubtotal;

    return {
      items: expandedItems,
      originalSubtotal,
      discountedSubtotal,
      totalDiscount,
      appliedPromotion: getPromotionName(totalItems)
    };
  };

  // Función para obtener el nombre de la promoción aplicada
  const getPromotionName = (itemCount) => {
    if (itemCount <= 1) return "Sin promoción";
    if (itemCount === 2) return "Segunda unidad al 50%";
    if (itemCount === 3) return "3x2 - Lleva 3, paga 2";
    if (itemCount === 4) return "4x3 - Lleva 4, paga 3";
    if (itemCount === 5) return "5x3 - Lleva 5, paga 3";
    if (itemCount === 6) return "6x4 - Lleva 6, paga 4";
    if (itemCount >= 7) return "7x4 - Lleva 7, paga solo 4";
    return "Promoción especial";
  };

  // Calcular las promociones
  const promotionResult = calculatePromotions(cartItems);
  
  // Cálculos
  const subtotal = promotionResult.discountedSubtotal;
  const originalSubtotal = promotionResult.originalSubtotal;
  const discount = promotionResult.totalDiscount;
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + shipping;

  // Resumen del carrito para mostrar en el checkout
  // const cartSummary = {
  //   originalSubtotal,
  //   subtotal,
  //   discount,
  //   shipping,
  //   total,
  //   itemCount: cartItems.reduce((count, item) => count + item.quantity, 0),
  //   appliedPromotion: promotionResult.appliedPromotion
  // };

  // Nueva función para crear el mensaje de WhatsApp con el resumen del pedido
  const createWhatsAppMessage = () => {
    let message = "¡Hola! Me gustaría realizar el siguiente pedido:\n\n";
    
    // Detalles de los productos
    message += "*Productos:*\n";
    cartItems.forEach((item) => {
      const itemName = item.name || item.productName;
      
      // Opciones seleccionadas
      const sizeOption = getOptionByType(item, 'size');
      const badgeOption = getOptionByType(item, 'badge');
      const customizeOption = getOptionByType(item, 'customize');
      
      let options = [];
      if (!sizeOption && !badgeOption && !customizeOption) options.push(`Sin personalizar`);
      if (sizeOption) options.push(`Talla: ${sizeOption.name}`);
      if (badgeOption && (customizeOption?.name !== "Sin parches")) options.push(`Parche: ${badgeOption.name}`);
      if (customizeOption && customizeOption.name !== "Sin dorsal") {
        options.push(`Dorsal: ${customizeOption.name} - ${item.customText ? item.customText : "Sin especificar"}`);
      }
      
      // Precios
      const itemPrice = parseFloat(item.price);
      const itemTotalPrice = itemPrice * item.quantity;
      
      // Encontrar si este item tiene descuento
      const itemExpandedList = promotionResult.items.filter(expandedItem => 
        expandedItem.id === item.id
      );
      
      const itemTotalDiscount = itemExpandedList.reduce(
        (sum, expandedItem) => sum + expandedItem.discount,
        0
      );
      
      const finalPrice = itemTotalPrice - itemTotalDiscount;
      
      // Formatear línea del producto
      message += `*${itemName}*\n`;
      message += `Cantidad: ${item.quantity} | ${options.join(' | ')}\n`;

      if (itemTotalDiscount > 0) {
        message += `Precio original: ~$${itemTotalPrice.toFixed(0)}~ → *$${finalPrice.toFixed(0)}* (Promoción aplicada)\n`;
      } else {
        message += `Precio: *$${finalPrice.toFixed(0)}*\n`;
      }

      message += "\n";
    });
    
    // Resumen del pedido
    message += "*Resumen de la compra:*\n";
    message += `Subtotal: $${subtotal.toFixed(0)}\n`;
    
    if (discount > 0) {
      message += `Promoción aplicada: ${promotionResult.appliedPromotion}\n`;
      message += `Descuento: -$${discount.toFixed(0)}\n`;
    }
    
    message += `Envío: ${shipping === 0 ? 'Gratis' : '$' + shipping.toFixed(0)}\n`;
    message += `*Total a pagar:* $${total.toFixed(0)}\n\n`;

    // Datos de pago
    message += "*Para confirmar el pedido, realizá el pago a:*\n";
    message += `   - *Alias:* franschlatter.mp\n`;
    message += `   - *Monto:* $${total.toFixed(0)}\n\n`;

    // Instrucción final
    message += "*Una vez hecho el pago, envianos el comprobante y te confirmamos el pedido.* \nCuando el paquete esté en camino, te pasaremos el número de seguimiento.\n\n";
    message += "¡Gracias por elegirnos!";

    return encodeURIComponent(message);
};


  // Función para abrir WhatsApp con el mensaje
  const handleWhatsAppOrder = () => {
    const message = createWhatsAppMessage();
    const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
    window.open(whatsappURL, '_blank');
  };

  // const handleCheckout = () => {
  //   // Aquí implementarías la lógica de checkout
  //   navigate('/checkout', { state: { cartSummary } });
  // };

  // Función auxiliar para obtener el valor de una opción específica del producto
  const getOptionByType = (item, type) => {
    if (!item.selectedOptions) return null;
    return item.selectedOptions.find(opt => opt.type === type);
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto my-8 p-6 text-center">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
          <ShoppingBag className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold mb-4">Tu carrito está vacío</h2>
          <p className="text-gray-600 mb-6">
            ¡Explora nuestra tienda y encuentra productos increíbles!
          </p>
          <button
            onClick={() => navigate('/products')}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Continuar Comprando
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto my-8 px-4">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Lista de productos */}
        <div className="lg:w-2/3">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Carrito de Compras</h2>
              <button
                onClick={() => navigate('/products')}
                className="text-blue-600 hover:text-blue-800 inline-flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" /> Seguir comprando
              </button>
            </div>

            {/* Banner de promoción activa */}
            {cartItems.length > 1 && (
              <div className="bg-green-100 border border-green-300 text-green-800 px-4 py-3 rounded-lg mb-4 flex items-center">
                <Tag className="w-5 h-5 mr-2 text-green-600" />
                <div>
                  <p className="font-semibold">{promotionResult.appliedPromotion}</p>
                  <p className="text-sm">¡Ahorra ${discount.toFixed(0)} en tu compra!</p>
                </div>
              </div>
            )}

            {/* Items del carrito */}
            <div className="space-y-4">
              {cartItems.map(item => {
                // Obtenemos las opciones por tipo
                const sizeOption = getOptionByType(item, 'size');
                const badgeOption = getOptionByType(item, 'badge');
                const customizeOption = getOptionByType(item, 'customize');
                // const hasCustomText = item.customText && customizeOption && customizeOption.name !== 'Sin dorsal';

                // Encontrar si este item tiene descuento
                const itemTotalPrice = parseFloat(item.price) * item.quantity;
                const itemExpandedList = promotionResult.items.filter(expandedItem => 
                  expandedItem.id === item.id
                );

                const itemTotalDiscount = itemExpandedList.reduce(
                  (sum, expandedItem) => sum + expandedItem.discount,
                  0
                );

                const hasDiscount = itemTotalDiscount > 0;
                const isFullyDiscounted = hasDiscount && (itemTotalPrice - itemTotalDiscount) === 0;

                return (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {/* Imagen */}
                    <img
                      src={Array.isArray(item.image_url) ? item.image_url[0] : item.image_url}
                      alt={item.name || item.productName}
                      className="w-24 h-24 object-cover rounded-lg"
                    />

                    {/* Información del producto */}
                    <div className="flex-1">
                      <h6 className="font-semibold text-md mb-1">{item.name || item.productName}</h6>
                      <div className="flex flex-wrap gap-2 text-sm text-gray-500">
                        {!sizeOption && !badgeOption && !customizeOption && (
                            <span className="bg-gray-100 px-2 py-1 rounded">
                              Sin personalizar
                            </span>
                        )}
                        {sizeOption && (
                          <span className="bg-gray-100 px-2 py-1 rounded">
                            Talla: {sizeOption.name}
                          </span>
                        )}
                        {badgeOption && (customizeOption?.name !== "Sin parches") &&  (
                          <span className="bg-gray-100 px-2 py-1 rounded">
                            Parche: {badgeOption.name}
                          </span>
                        )}
                        {customizeOption && customizeOption.name !== "Sin dorsal" && (
                          <span className="bg-gray-100 px-2 py-1 rounded">
                            {customizeOption.name} - {item.customText ? item.customText : "Sin especificar"}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Controles de cantidad */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleQuantityChange(item, -1)}
                        className="p-1 rounded-full hover:bg-gray-100"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item, 1)}
                        className="p-1 rounded-full hover:bg-gray-100"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Precio */}
                    <div className="text-right">
                      {hasDiscount ? (
                        <>
                          {isFullyDiscounted ? (
                            <p className="text-lg font-bold text-green-600">¡Gratis!</p>
                          ) : (
                            <p className="text-lg font-bold">
                              ${(itemTotalPrice - itemTotalDiscount).toFixed(0)}
                            </p>
                          )}
                          <p className="text-sm text-gray-500 line-through">
                            ${itemTotalPrice.toFixed(0)}
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="text-lg font-bold">
                            ${(parseFloat(item.price) * item.quantity).toFixed(0)}
                          </p>
                          <p className="text-sm text-gray-500">
                            ${parseFloat(item.price).toFixed(0)} c/u
                          </p>
                        </>
                      )}
                    </div>

                    {/* Botón eliminar */}
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Botón vaciar carrito */}
            <div className="mt-6 text-right">
              <button
                onClick={handleClearCart}
                className="text-red-600 hover:text-red-800 inline-flex items-center"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Vaciar Carrito
              </button>
            </div>
          </div>
        </div>

        {/* Resumen del pedido */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h3 className="text-xl font-bold mb-4">Resumen del Pedido</h3>

            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <div className="text-right">
                  <span>${subtotal.toFixed(0)}</span>
                  {discount > 0 && (
                    <div className="text-sm text-gray-500 line-through">
                      ${originalSubtotal.toFixed(0)}
                    </div>
                  )}
                </div>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span className="flex items-center">
                    <Tag className="w-4 h-4 mr-1" /> 
                    {promotionResult.appliedPromotion}
                  </span>
                  <span>-${discount.toFixed(0)}</span>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Envío</span>
                {shipping === 0 ? (
                  <span className="text-green-600 font-medium">¡Gratis!</span>
                ) : (
                  <span>${shipping.toFixed(0)}</span>
                )}
              </div>

              {subtotal < FREE_SHIPPING_THRESHOLD && (
                <div className="bg-blue-50 p-3 rounded-lg text-sm">
                  ¡Agrega ${(FREE_SHIPPING_THRESHOLD - subtotal).toFixed(0)} más
                  para obtener envío gratis!
                </div>
              )}

              <div className="border-t pt-4">
                {discount > 0 && (
                    <div className="flex justify-between items-center text-green-600 text-sm mt-1">
                      <span>Ahorro:</span>
                      <span>${discount.toFixed(0)}</span>
                    </div>
                  )}
                <div className="flex justify-between items-center font-bold text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(0)}</span>
                </div>
              </div>

              <button
                onClick={handleWhatsAppOrder}
                className="w-full py-3 font-bold bg-green-600 text-white rounded-lg hover:bg-green-700 
                          transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                Realizar Pedido
              </button>

              {/* <p className="text-xs text-gray-500 text-center mt-4">
                Los impuestos y gastos adicionales se calcularán en el checkout
              </p> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;