// src/components/Admin/AdminAnalytics.js
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  DollarSign,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

const AdminAnalytics = () => {
  const [timeRange, setTimeRange] = useState('month'); // week, month, year
  const products = useSelector(state => state.products.allProducts);
  const orders = useSelector(state => state.orders?.allOrders || []);
  const users = useSelector(state => state.users.allUsers);

  // Colores para gráficos
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  // Datos de resumen
  const summaryData = {
    totalSales: orders.reduce((sum, order) => sum + order?.total || 0, 0),
    totalOrders: orders.length,
    totalUsers: users.length,
    totalProducts: products.length,
  };

  // Datos para el gráfico de ventas
  const salesData = [
    { name: 'Ene', ventas: 4000 },
    { name: 'Feb', ventas: 3000 },
    { name: 'Mar', ventas: 2000 },
    { name: 'Abr', ventas: 2780 },
    { name: 'May', ventas: 1890 },
    { name: 'Jun', ventas: 2390 },
  ];

  // Datos para el gráfico de productos por categoría
  const categoryData = products.reduce((acc, product) => {
    acc[product.category] = (acc[product.category] || 0) + 1;
    return acc;
  }, {});

  const productsByCategory = Object.entries(categoryData).map(([name, value]) => ({
    name,
    value
  }));

  // Datos para el gráfico de ventas por género
  const salesByGender = [
    { name: 'Hombre', value: 45 },
    { name: 'Mujer', value: 35 },
    { name: 'Unisex', value: 20 }
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Análisis de Datos</h2>
        
        {/* Selector de rango de tiempo */}
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="border rounded-lg px-4 py-2"
        >
          <option value="week">Última Semana</option>
          <option value="month">Último Mes</option>
          <option value="year">Último Año</option>
        </select>
      </div>

      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500">Ventas Totales</p>
              <h3 className="text-2xl font-bold">${summaryData.totalSales}</h3>
              <span className="text-xs text-green-500 flex items-center">
                <ArrowUpRight size={12} className="mr-1" />
                +12.5% vs anterior
              </span>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <DollarSign className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500">Pedidos Totales</p>
              <h3 className="text-2xl font-bold">{summaryData.totalOrders}</h3>
              <span className="text-xs text-red-500 flex items-center">
                <ArrowDownRight size={12} className="mr-1" />
                -2.3% vs anterior
              </span>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <ShoppingBag className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500">Usuarios Activos</p>
              <h3 className="text-2xl font-bold">{summaryData.totalUsers}</h3>
              <span className="text-xs text-green-500 flex items-center">
                <ArrowUpRight size={12} className="mr-1" />
                +5.2% vs anterior
              </span>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Users className="text-purple-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500">Productos Activos</p>
              <h3 className="text-2xl font-bold">{summaryData.totalProducts}</h3>
              <span className="text-xs text-green-500 flex items-center">
                <ArrowUpRight size={12} className="mr-1" />
                +3.1% vs anterior
              </span>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <TrendingUp className="text-yellow-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de ventas */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium mb-4">Ventas por Período</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="ventas" 
                stroke="#0088FE" 
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de productos por categoría */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium mb-4">Productos por Categoría</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={productsByCategory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#00C49F" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico circular de ventas por género */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium mb-4">Ventas por Género</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={salesByGender}
                innerRadius={60}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {salesByGender.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]} 
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* KPIs adicionales */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium mb-4">Métricas Clave</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Valor Promedio de Orden</p>
              <p className="text-2xl font-bold">
                ${(summaryData.totalSales / summaryData.totalOrders || 0).toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Tasa de Conversión</p>
              <p className="text-2xl font-bold">2.4%</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Productos por Orden</p>
              <p className="text-2xl font-bold">3.2</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Tasa de Retorno</p>
              <p className="text-2xl font-bold">1.8%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;