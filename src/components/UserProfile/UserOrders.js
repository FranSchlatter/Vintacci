// src/components/UserProfile/UserOrders.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders } from '../../redux/actions/orderActions';
import { 
    Package, 
    Truck, 
    CheckCircle, 
    XCircle, 
    Clock, 
    AlertCircle,
    ChevronRight,
    Eye
} from 'lucide-react';
import { Link } from 'react-router-dom';

const UserOrders = ({ userId }) => {
    const dispatch = useDispatch();
    const orders = useSelector(state => 
        state.orders.allOrders.filter(order => order.user_id === userId)
    );

    // Estados posibles de un pedido con sus estilos
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
        },
        'problem': { 
            label: 'Con Problemas', 
            icon: AlertCircle, 
            color: 'text-orange-500 bg-orange-50' 
        }
    };

    useEffect(() => {
        dispatch(fetchOrders());
    }, [dispatch]);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-AR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const StatusBadge = ({ status }) => {
        const StatusIcon = orderStatuses[status]?.icon || Clock;
        const statusInfo = orderStatuses[status] || orderStatuses.pending;
        
        return (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${statusInfo.color}`}>
                <StatusIcon size={16} className="mr-1" />
                {statusInfo.label}
            </span>
        );
    };

    if (!orders.length) {
        return (
            <div className="text-center py-12">
                <Package size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No hay pedidos aún</h3>
                <p className="text-gray-500 mt-2">¡Empieza a comprar para ver tus pedidos aquí!</p>
                <Link 
                    to="/products"
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                    Ir a la tienda
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Mis Pedidos</h2>
            
            <div className="space-y-4">
                {orders.map((order) => (
                    <div 
                        key={order.id}
                        className="bg-white border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                    >
                        {/* Encabezado del pedido */}
                        <div className="border-b px-6 py-4">
                            <div className="flex justify-between items-center">
                                <div className="space-y-1">
                                    <p className="text-sm text-gray-500">
                                        Pedido realizado el {formatDate(order.created_at)}
                                    </p>
                                    <p className="font-medium">
                                        Nº de Pedido: {order.id.slice(0,8)}...
                                    </p>
                                </div>
                                <StatusBadge status={order.status} />
                            </div>
                        </div>

                        {/* Productos del pedido */}
                        <div className="px-6 py-4">
                            <div className="space-y-4">
                                {order.items?.map((item) => (
                                    <div key={item.id} className="flex items-center space-x-4">
                                        <img
                                            src={item.product.image_url}
                                            alt={item.product.name}
                                            className="w-20 h-20 object-cover rounded"
                                        />
                                        <div className="flex-1">
                                            <h4 className="font-medium">{item.product.name}</h4>
                                            <p className="text-sm text-gray-500">
                                                Cantidad: {item.quantity}
                                            </p>
                                            <p className="text-sm font-medium">
                                                ${parseFloat(item.price).toFixed(2)} c/u
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Footer con total y acciones */}
                        <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
                            <div className="text-gray-900">
                                <span className="text-sm">Total:</span>
                                <span className="ml-2 text-lg font-bold">
                                    ${parseFloat(order.total).toFixed(2)}
                                </span>
                            </div>
                            
                            <div className="flex items-center space-x-4">
                                {order.invoice && (
                                    <button
                                        onClick={() => window.open(`/invoices/${order.invoice.id}`, '_blank')}
                                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                    >
                                        Ver Factura
                                    </button>
                                )}
                                
                                <Link
                                    to={`/orders/${order.id}`}
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                >
                                    <Eye size={16} className="mr-2" />
                                    Ver Detalles
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserOrders;