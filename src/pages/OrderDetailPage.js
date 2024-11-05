// src/pages/OrderDetailPage.js
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getOrderDetails } from '../redux/actions/orderActions';
import { 
    Package, 
    Truck, 
    MapPin, 
    Calendar,
    FileText,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle 
} from 'lucide-react';

const OrderDetailPage = () => {
    const { orderId } = useParams();
    const dispatch = useDispatch();
    const order = useSelector(state => state.orders.currentOrder);

    useEffect(() => {
        dispatch(getOrderDetails(orderId));
    }, [dispatch, orderId]);

    const orderStatuses = {
        'pending': { 
            label: 'Pendiente', 
            icon: Clock, 
            color: 'text-yellow-500 bg-yellow-50' 
        },
        'processing': { 
            label: 'En Proceso', 
            icon: Package, 
            color: 'text-blue-500 bg-blue-50' 
        },
        'shipped': { 
            label: 'Enviado', 
            icon: Truck, 
            color: 'text-purple-500 bg-purple-50' 
        },
        'delivered': { 
            label: 'Entregado', 
            icon: CheckCircle, 
            color: 'text-green-500 bg-green-50' 
        },
        'cancelled': { 
            label: 'Cancelado', 
            icon: XCircle, 
            color: 'text-red-500 bg-red-50' 
        }
    };

    const StatusBadge = ({ status }) => {
        const StatusIcon = orderStatuses[status]?.icon;
        const statusInfo = orderStatuses[status];
        
        return (
            <span className={`inline-flex items-center px-3 py-1 rounded-full ${statusInfo.color}`}>
                <StatusIcon size={16} className="mr-2" />
                {statusInfo.label}
            </span>
        );
    };

    if (!order) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    console.log(order)

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold">Pedido #{order.id.slice(0,8)}</h1>
                            <p className="text-gray-500 mt-1">
                                Realizado el {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                        <StatusBadge status={order.status} />
                    </div>
                </div>

                {/* Contenido principal */}
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Productos */}
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold">Productos</h2>
                            {order.items?.map((item) => (
                                <div 
                                    key={item.id} 
                                    className="flex items-center space-x-4 border rounded-lg p-4"
                                >
                                    <img
                                        src={item.Product.image_url}
                                        alt={item.Product.name}
                                        className="w-20 h-20 object-cover rounded"
                                    />
                                    <div className="flex-1">
                                        <h3 className="font-medium">{item.Product.name}</h3>
                                        <p className="text-gray-500">Cantidad: {item.quantity}</p>
                                        <p className="text-gray-500">
                                            ${parseFloat(item.price).toFixed(2)} c/u
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold">
                                            ${(item.quantity * parseFloat(item.price)).toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Información de envío y facturación */}
                        <div className="space-y-6">
                            {/* Información de envío */}
                            <div className="border rounded-lg p-4">
                                <h2 className="text-lg font-semibold flex items-center">
                                    <MapPin className="mr-2" />
                                    Dirección de Envío
                                </h2>
                                <div className="mt-3 text-gray-600">
                                    <p>{order.shipping_address.first_name} {order.shipping_address.last_name}</p>
                                    <p>{order.shipping_address.street} {order.shipping_address.number}</p>
                                    {order.shipping_address.apartment && (
                                        <p>Depto: {order.shipping_address.apartment}</p>
                                    )}
                                    <p>{order.shipping_address.city}, {order.shipping_address.state}</p>
                                    <p>{order.shipping_address.postal_code}</p>
                                </div>
                            </div>

                            {/* Tracking info si está disponible */}
                            {order.tracking_number && (
                                <div className="border rounded-lg p-4">
                                    <h2 className="text-lg font-semibold flex items-center">
                                        <Truck className="mr-2" />
                                        Información de Envío
                                    </h2>
                                    <p className="mt-2">
                                        Número de seguimiento: {order.tracking_number}
                                    </p>
                                </div>
                            )}

                            {/* Resumen de costos */}
                            <div className="border rounded-lg p-4">
                                <h2 className="text-lg font-semibold mb-3">Resumen</h2>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span>Subtotal</span>
                                        <span>${(order.total - order.shipping_cost).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Envío</span>
                                        <span>${parseFloat(order.shipping_cost).toFixed(2)}</span>
                                    </div>
                                    <div className="border-t pt-2 mt-2">
                                        <div className="flex justify-between font-bold">
                                            <span>Total</span>
                                            <span>${parseFloat(order.total).toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Botón de factura si está disponible */}
                            {order.invoice && (
                                <button
                                    onClick={() => window.open(`/invoices/${order.invoice.id}`, '_blank')}
                                    className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                                >
                                    <FileText className="mr-2" />
                                    Ver Factura
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailPage;