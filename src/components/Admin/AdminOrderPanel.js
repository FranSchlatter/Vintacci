// src/components/Admin/AdminOrderPanel.js
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Search, Filter, Package, Truck, CheckCircle, 
  XCircle, Clock, AlertCircle 
} from 'lucide-react';
import { toast } from 'react-toastify';
// Asumiendo que crearemos estas acciones
import { fetchOrders, updateOrderStatus } from '../../redux/actions/orderActions';

const AdminOrderPanel = () => {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.orders?.allOrders || []);
  
  // Estados locales
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });

  // Estados posibles de un pedido
  const orderStatuses = {
    'pending': { label: 'Pendiente', icon: Clock, color: 'text-yellow-500' },
    'processing': { label: 'En Proceso', icon: Package, color: 'text-blue-500' },
    'shipped': { label: 'Enviado', icon: Truck, color: 'text-purple-500' },
    'delivered': { label: 'Entregado', icon: CheckCircle, color: 'text-green-500' },
    'cancelled': { label: 'Cancelado', icon: XCircle, color: 'text-red-500' },
    'problem': { label: 'Con Problemas', icon: AlertCircle, color: 'text-orange-500' }
  };

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  // Filtrado de órdenes
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toString().includes(searchTerm) ||
      order.customer_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    const orderDate = new Date(order.created_at);
    const matchesDateRange = (!dateRange.start || orderDate >= new Date(dateRange.start)) &&
                           (!dateRange.end || orderDate <= new Date(dateRange.end));

    return matchesSearch && matchesStatus && matchesDateRange;
  });

  // Manejador de cambio de estado
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await dispatch(updateOrderStatus(orderId, newStatus));
      toast.success('Estado del pedido actualizado');
    } catch (error) {
      toast.error('Error al actualizar el estado del pedido');
    }
  };

  // Renderizar el badge de estado
  const StatusBadge = ({ status }) => {
    const StatusIcon = orderStatuses[status].icon;
    return (
      <span className={`flex items-center space-x-1 ${orderStatuses[status].color}`}>
        <StatusIcon size={16} />
        <span>{orderStatuses[status].label}</span>
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Gestión de Pedidos</h2>
        
        {/* Estadísticas rápidas */}
        <div className="flex space-x-4">
          {Object.entries(orderStatuses).map(([key, value]) => (
            <div key={key} className="text-center">
              <div className={`text-2xl font-bold ${value.color}`}>
                {orders.filter(order => order.status === key).length}
              </div>
              <div className="text-xs text-gray-500">{value.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          {/* Búsqueda */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Buscar por ID o cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          </div>

          {/* Filtro de estado */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-lg px-4 py-2"
          >
            <option value="all">Todos los estados</option>
            {Object.entries(orderStatuses).map(([key, { label }]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>

          {/* Filtro de fecha */}
          <div className="flex items-center space-x-2">
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="border rounded-lg px-4 py-2"
            />
            <span>a</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="border rounded-lg px-4 py-2"
            />
          </div>
        </div>
      </div>

      {/* Lista de pedidos */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID Pedido
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cliente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredOrders.map((order) => (
              <tr key={order.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  #{order.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {order.customer_name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {order.customer_email}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(order.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={order.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${order.total}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className="border rounded-lg px-2 py-1"
                  >
                    {Object.entries(orderStatuses).map(([key, { label }]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrderPanel;