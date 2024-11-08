import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Search, Package, Truck, CheckCircle, 
  XCircle, Clock, Save, Mail 
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { fetchOrders, updateOrder } from '../../redux/actions/orderActions';
import { parseISO } from 'date-fns';
import axios from 'axios';
import CustomEmailModal from './Modals/CustomEmailModal';

const AdminOrderPanel = () => {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.orders?.allOrders || []);
  const navigate = useNavigate();
  
  // Estados locales
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });
  const [editingNotes, setEditingNotes] = useState({});
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  const handleRowClick = (orderId) => {
    navigate(`/orders/${orderId}`);
  };

  // Estados posibles de un pedido
  const orderStatuses = {
    'pending': { label: 'Pendiente', icon: Clock, color: 'text-yellow-500' },
    'processing': { label: 'En Proceso', icon: Package, color: 'text-blue-500' },
    'shipped': { label: 'Enviado', icon: Truck, color: 'text-purple-500' },
    'delivered': { label: 'Entregado', icon: CheckCircle, color: 'text-green-500' },
    'cancelled': { label: 'Cancelado', icon: XCircle, color: 'text-red-500' }
  };

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  // Función auxiliar para manejar fechas
  const getDateFromOrder = (order) => {
    const dateStr = order.createdAt || order.created_at;
    if (!dateStr) return new Date();
    try {
      return parseISO(dateStr);
    } catch (e) {
      console.error('Error parsing date:', dateStr);
      return new Date(dateStr);
    }
  }

  // Filtrado de órdenes
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toString().includes(searchTerm) || 
                         order.user?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.user?.last_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    const orderDate = getDateFromOrder(order);
    const orderDateString = orderDate.toISOString().split('T')[0];
    
    const matchesDateRange = (
        !dateRange.start || orderDateString >= dateRange.start
    ) && (
        !dateRange.end || orderDateString <= dateRange.end
    );

    return matchesSearch && matchesStatus && matchesDateRange;
  });

  // Manejador para las notas
  const handleNotesChange = (orderId, notes) => {
    setEditingNotes({
      ...editingNotes,
      [orderId]: notes
    });
  };

  // Manejador para guardar las notas
  const handleSaveNotes = async (orderId) => {
    try {
      await dispatch(updateOrder(orderId, { notes: editingNotes[orderId] }));
      toast.success('Notas guardadas correctamente');
    } catch (error) {
      toast.error('Error al guardar las notas');
    }
  };

  // Manejador de cambio de estado
  const handleStatusChange = async (e, orderId) => {
    e.stopPropagation();
    try {
      await dispatch(updateOrder(orderId, { status: e.target.value }));
      
      // Obtener la orden actualizada
      const orderResponse = await axios.get(`http://localhost:5000/orders/${orderId}`);
      const updatedOrder = orderResponse.data;

      // Enviar email de actualización de estado
      await axios.post('http://localhost:5000/email/order-status', updatedOrder);
      
      toast.success('Estado del pedido actualizado');
    } catch (error) {
      console.error('Error:', error);
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
              placeholder="Busqueda por ID o cliente"
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
            {(dateRange.start || dateRange.end) && (
              <button
                onClick={() => setDateRange({ start: '', end: '' })}
                className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Limpiar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Lista de pedidos */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Pedido</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notas</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredOrders.map((order) => (
              <tr 
                key={order.id} 
                onClick={() => handleRowClick(order.id)}
                className="cursor-pointer hover:bg-gray-50"
              >
                <td className="px-6 py-4 whitespace-nowrap">#{order.id.slice(0,8)}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {`${order.user?.first_name} ${order.user?.last_name}`}
                  </div>
                  <div className="text-sm text-gray-500">{order.user?.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {getDateFromOrder(order).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={order.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${parseFloat(order.total).toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" onClick={e => e.stopPropagation()}>
                  <div className="flex items-center space-x-2">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(e, order.id)}
                      className="border rounded-lg px-2 py-1"
                    >
                      {Object.entries(orderStatuses).map(([key, { label }]) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => {
                        setSelectedOrder(order);
                        setIsEmailModalOpen(true);
                      }}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                      title="Enviar email personalizado"
                    >
                      <Mail size={20} className="text-gray-600" />
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4" onClick={e => e.stopPropagation()}>
                  <div className="flex items-start space-x-2">
                    <textarea
                      value={editingNotes[order.id] ?? order.notes ?? ''}
                      onChange={(e) => handleNotesChange(order.id, e.target.value)}
                      placeholder="Agregar notas..."
                      className="border rounded-lg px-3 py-2 w-full min-h-[80px] resize-y"
                    />
                    <button
                      onClick={() => handleSaveNotes(order.id)}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                      title="Guardar notas"
                    >
                      <Save size={20} className="text-gray-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de Email Personalizado */}
      {selectedOrder && (
        <CustomEmailModal
          order={selectedOrder}
          isOpen={isEmailModalOpen}
          onClose={() => {
            setIsEmailModalOpen(false);
            setSelectedOrder(null);
          }}
        />
      )}
    </div>
  );
};

export default AdminOrderPanel;